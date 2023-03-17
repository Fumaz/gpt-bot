import {Composer} from "grammy";
import {GPTContext} from "../bot.js";
import {generateResponse} from "../api/openai.js";
import {ADMINS} from "../config.js";

export const gpt4 = new Composer<GPTContext>();

gpt4.command("gpt4", async (ctx) => {
    if (!ADMINS.includes(ctx.from?.id || 0)) {
        return;
    }

    const text = ctx.match;

    if (!text) {
        await ctx.replyWithHTML("Please provide a prompt.");
        return;
    }

    const message = await ctx.replyWithHTML("Generating...");

    const response = await generateResponse(text, "gpt-4", 1024);

    await ctx.replyWithHTML(response);

    await message.delete();
});
