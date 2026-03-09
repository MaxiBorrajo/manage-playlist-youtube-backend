import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VoyageAIClient } from 'voyageai';
import { NoEmbeddingReturnException } from './exceptions/noEmbeddingReturn.exception';
@Injectable()
export class VoyageAiService {
  private voyageClient: VoyageAIClient;

  constructor(private readonly configService: ConfigService) {
    this.voyageClient = new VoyageAIClient({
      apiKey: this.configService.get<string>('VOYAGE_AI_API_KEY'),
    });
  }

  async getEmbedding(text: string) {
    const { data } = await this.voyageClient.embed({
      input: text,
      model: 'voyage-3.5-lite',
    });

    if (!data || data.length === 0) {
      throw new NoEmbeddingReturnException();
    }

    return data[0].embedding!;
  }
}
