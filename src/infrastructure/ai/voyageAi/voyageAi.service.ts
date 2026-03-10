import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VoyageAIClient } from 'voyageai';
import { NoEmbeddingReturnException } from './exceptions/noEmbeddingReturn.exception';
import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';

@Injectable()
export class VoyageAiService {
  //   private voyageClient: VoyageAIClient;

  private pipePromise: Promise<FeatureExtractionPipeline>;

  constructor() {
    console.log('[VoyageAiService] Initializing pipeline...');
    this.pipePromise = pipeline(
      'feature-extraction',
      'Xenova/bge-base-en-v1.5',
    ).then((pipe) => {
      console.log('[VoyageAiService] Pipeline ready');
      return pipe;
    });
  }

  private getPipe() {
    return this.pipePromise;
  }

  async getEmbedding(text: string): Promise<number[]> {
    try {
      console.log('[VoyageAiService] Loading pipeline...');
      const pipe = await this.getPipe();
      console.log('[VoyageAiService] Pipeline loaded, generating embedding...');
      const output = await pipe(text, { pooling: 'mean', normalize: true });
      console.log('[VoyageAiService] Embedding generated, dims:', output.dims);
      return Array.from(output.data as Float32Array);
    } catch (error) {
      console.error('[VoyageAiService] Error generating embedding:', error);
      throw new NoEmbeddingReturnException();
    }
  }
}
