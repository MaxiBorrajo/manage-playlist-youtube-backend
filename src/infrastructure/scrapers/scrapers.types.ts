import Anthropic from "@anthropic-ai/sdk";
import { ToolReferenceBlockParam, ToolResultBlockParam } from "@anthropic-ai/sdk/resources";

export interface Scraper {
    execute(toolBlocks: Anthropic.Messages.ToolUseBlock[], ...args: any[]): Promise<ToolResultBlockParam[]>;
}

export abstract class ScraperTool implements Scraper {
    toolName: string;

    constructor(toolName:string) {
        this.toolName = toolName;
    }

    async execute(toolBlocks: Anthropic.Messages.ToolUseBlock[], ...args: any[]): Promise<ToolResultBlockParam[]> {
        const correspondingToolBlocks = toolBlocks.filter(block => block.name === this.toolName);

        const results: ToolResultBlockParam[] = []

        await Promise.all(correspondingToolBlocks.map(async (block) => {
            const result = await this.executeTool(block, ...args);
            results.push(result);
        }));

        return results;
    }

    abstract executeTool(block: Anthropic.Messages.ToolUseBlock, ...args: any[]): Promise<ToolResultBlockParam>

}