import {Composer} from "grammy";
import {GPTContext} from "../bot.js";
import {generateResponse} from "../api/openai.js";

export const gpt4 = new Composer<GPTContext>();

gpt4.command("gpt4", async (ctx) => {
    const text = ctx.match;

    if (!text) {
        await ctx.replyWithHTML("Please provide a prompt.");
        return;
    }

    const message = await ctx.replyWithHTML("Generating...");

    const response = await generateResponse(text, "gpt-4");

    await ctx.replyWithHTML(response);

    await message.delete();
});
