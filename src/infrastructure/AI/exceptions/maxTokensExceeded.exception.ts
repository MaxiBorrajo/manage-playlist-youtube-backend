import { PayloadTooLargeException } from '@nestjs/common';

export class MaxTokensExceededException extends PayloadTooLargeException {
  constructor(outputTokens: number) {
    super(
      `Claude stopped because it reached the max_tokens limit specified in your request. Output tokens: ${outputTokens}`,
    );
  }
}
