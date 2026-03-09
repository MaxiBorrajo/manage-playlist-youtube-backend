import Anthropic from "@anthropic-ai/sdk";
import { ConflictException } from "@nestjs/common";

export class AnthropicRefusalException extends ConflictException {
    constructor( msg: Anthropic.Messages.Message & { _request_id?: string | null },) {
        super(`Claude stopped due to safety concerns.. Request ID: ${msg._request_id}`);
    }
}