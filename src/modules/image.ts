import {Composer} from "grammy";
import {GPTContext} from "../bot.js";
import {generateImage} from "../api/openai.js";
import {ADMINS} from "../config.js";

export const image = new Composer<GPTContext>();

image.command("image", async (ctx) => {
    if (!ADMINS.includes(ctx.from?.id || 0)) {
        return;
    }

    const text = ctx.match;

    if (!text) {
        await ctx.replyWithHTML("❌ Please provide a prompt.");
        return;
    }

    const creating = await ctx.replyWithHTML("🖼️ Creating your image...");

    try {
        const image = await generateImage(text);

        if (!image) {
            throw new Error("No response");
        }

        await ctx.replyWithPhoto(image, {
            caption: `🧑‍💻 <b>Prompt:</b> ${text}`,
            parse_mode: "HTML"
        });
    } catch (e) {
        await ctx.replyWithHTML("❌ An error occurred while generating your image.");
    }

    await creating.delete();
});
