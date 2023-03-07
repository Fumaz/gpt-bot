import {Composer} from "grammy";
import {GPTContext} from "../bot.js";
import {generateImage} from "../api/openai.js";

export const image = new Composer<GPTContext>();

image.command("image", async (ctx) => {
    const text = ctx.match;

    if (!text) {
        await ctx.replyWithHTML("❌ Please provide a prompt.");
        return;
    }

    try {
        const image = await generateImage(text);

        if (!image) {
            await ctx.replyWithHTML("❌ An error occurred while generating your image.");
            return;
        }

        await ctx.replyWithPhoto(image, {
            caption: `🧑‍💻 <b>Prompt:</b> ${text}`,
            parse_mode: "HTML"
        });
    } catch (e) {
        await ctx.replyWithHTML("❌ An error occurred while generating your image.");
        return;
    }
});
