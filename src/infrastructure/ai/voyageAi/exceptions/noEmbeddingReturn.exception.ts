import { InternalServerError } from "@anthropic-ai/sdk";
import { InternalServerErrorException } from "@nestjs/common";

export class NoEmbeddingReturnException extends InternalServerErrorException {
    constructor() {
        super('No embedding data returned from VoyageAI');
    }
}