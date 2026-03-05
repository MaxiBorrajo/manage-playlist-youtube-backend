import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';
import { serperDevTool } from '../scrapers/serper.dev/serperDev.constants';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import {  ToolResultBlockParam } from '@anthropic-ai/sdk/resources';
import { PlaylistResponseSchema } from './claude.types';
import { AnthropicRefusalException } from './exceptions/anthropicRefusal.exception';
import { MaxTokensExceededException } from './exceptions/maxTokensExceeded.exception';
import { ToolsExecutionService } from './toolsExecution.service';

@Injectable()
export class ClaudeService {
  anthropic: Anthropic = new Anthropic({
    apiKey: this.configService.get('CLAUDE_API_KEY'),
  });

  tools: Anthropic.Tool[] = [serperDevTool];

  constructor(private readonly configService: ConfigService, private readonly toolsExecutionService: ToolsExecutionService) {}

  async generateResponse(
    newMessage: Anthropic.Messages.MessageParam,
    messages: Anthropic.Messages.MessageParam[],
  ) {
    //Ver de siempre poder añadir mas contexto a la conversación, y no solo el ultimo mensaje del usuario
    const msg = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      system: `
        Sos un curador experto de contenido de YouTube dentro de la app PlaylistAI. Tu objetivo es ayudar al usuario a armar una playlist personalizada de videos de YouTube basada en lo que quiere aprender o ver.

        FLUJO DE TRABAJO:
        1. Analiza el mensaje del usuario y evalua si ya proporciono contexto suficiente para buscar:
          - Nivel actual en el tema (principiante/intermedio/avanzado)
          - Tiempo disponible (videos cortos <15min, medianos, o cursos largos)
          - Idioma preferido
          - Enfoque (teorico vs practico)

          Si el usuario ya especifico al menos 2 de estos parametros, NO hagas preguntas. Inferi lo que falte con sentido comun y procede directamente a buscar videos llamando a "search_videos".
          Si el usuario da un mensaje muy vago sin ningun parametro (ej: "quiero aprender algo de programacion"), ahi si hace 1-2 preguntas puntuales. Nunca mas de 2 preguntas.

        2. Cuando tengas suficiente contexto, genera queries de busqueda optimizadas llamando la funcion "search_videos". Genera entre 2 y 4 queries distintas que cubran diferentes angulos del tema.

        3. Con los resultados, presenta al usuario una seleccion curada:
          - Agrupa por categoria si tiene sentido (ej: "Fundamentos", "Practica", "Avanzado")
          - Explica brevemente por que recomendas cada video o grupo
          - Indica duracion y canal
          - Si encontraste playlists de terceros relevantes, mencionalo

        4. Cuando el usuario confirme su seleccion, propone un orden logico de visualizacion y llama a "create_playlist" con los videos ordenados.

        REGLAS:
        - Nunca inventes URLs ni IDs de videos. Solo usa los que vienen de los resultados de busqueda.
        - Si los resultados de busqueda son pobres, decilo y sugeri refinar la busqueda.
        - Se conciso. No des parrafos largos explicando cada video.
        - Si el usuario pide algo que no es contenido de YouTube (ej: que le expliques un tema), podes dar una respuesta breve pero redirigilo a armar una playlist sobre eso.
        - Maximo 15 videos por playlist a menos que el usuario pida mas.
        - Responde siempre en el idioma que use el usuario.
        - Cuando necesites buscar videos, lanza todas las queries en paralelo en una sola respuesta, no de forma secuencial una por una.
        - IMPORTANTE: Si el usuario explicitamente dice que no le hagas preguntas o que busques directamente, obedece siempre. La preferencia del usuario tiene prioridad sobre el flujo por defecto.
      `,
      max_tokens: 2500,
      messages: [...messages, newMessage],
      tools: this.tools,
      output_config: { format: zodOutputFormat(PlaylistResponseSchema) },
    });

    return this.handleResponse(msg, messages);
  }

  async handleResponse(
    msg: Anthropic.Messages.Message & { _request_id?: string | null },
    messages: Anthropic.Messages.MessageParam[],
  ) {
    if (msg.stop_reason === 'tool_use') {
      return this.handleToolUse(msg, messages);
    }

    //Claude stopped because it reached the max_tokens limit specified in your request.
    if (msg.stop_reason === 'max_tokens') {
      return this.handleMaxTokens(msg);
    }

    //Claude encountered one of your custom stop sequences.
    if (msg.stop_reason === 'pause_turn') {
      return await this.handlePause([
        ...messages,
        {
          role: msg.role,
          content: msg.content,
        },
      ]);
    }

    if (msg.stop_reason === 'refusal') {
      return this.handleRefusal(msg);
    }

    if (msg.stop_reason === 'end_turn' && !msg.content) {
      return this.handleEmptyResponse([
        ...messages,
        {
          role: msg.role,
          content: msg.content,
        },
      ]);
    }

    if (msg.stop_reason === 'stop_sequence') {
      console.warn(
        `Claude stopped because it encountered one of your custom stop sequences. Request ID: ${msg._request_id}`,
      );
    }

    return msg.content;
  }

  async handleToolUse(
    msg: Anthropic.Messages.Message & { _request_id?: string | null },
    messages: Anthropic.Messages.MessageParam[],
  ) {
    const toolResults = await this.executeTools(msg.content);

    messages.push({
      role: msg.role,
      content: msg.content,
    });

    return this.generateResponse(
      {
        role: 'user',
        content: toolResults,
      },
      messages,
    );
  }

  async executeTools(
    content: Anthropic.Messages.ContentBlock[],
  ): Promise<string | Anthropic.Messages.ContentBlockParam[]> {
    const toolsResults: ToolResultBlockParam[] = await this.toolsExecutionService.execute(content);

    return toolsResults
  }

  handleRefusal(
    msg: Anthropic.Messages.Message & { _request_id?: string | null },
  ) {
    throw new AnthropicRefusalException(msg);
  }

  async handlePause(
    messages: Anthropic.Messages.MessageParam[],
    maxRetries = 5,
  ) {
    const msg = await this.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages,
    });

    if (msg.stop_reason !== 'pause_turn') {
      return this.handleResponse(msg, messages);
    }

    if (maxRetries <= 0) {
      return msg.content[0];
    }

    return await this.handlePause(
      [
        ...messages,
        {
          role: msg.role,
          content: msg.content,
        },
      ],
      maxRetries - 1,
    );
  }

  handleMaxTokens(
    msg: Anthropic.Messages.Message & { _request_id?: string | null },
  ) {
    throw new MaxTokensExceededException(msg.usage.output_tokens);
  }

  async handleEmptyResponse(messages: Anthropic.Messages.MessageParam[]) {
    return await this.generateResponse(
      {
        role: 'user',
        content: 'Please provide a response to the previous message.',
      },
      messages,
    );
  }
}
