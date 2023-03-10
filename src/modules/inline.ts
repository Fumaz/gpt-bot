import {Composer} from "grammy";
import {InlineQueryResult} from "grammy/types";
import {GPTContext} from "../bot.js";
import {generateImage, generateResponse} from "../api/openai.js";
import {nanoid} from "nanoid/async";
import {ADMINS} from "../config.js";

export const inline = new Composer<GPTContext>();

async function createImageResult(prompt: string): Promise<InlineQueryResult> {
    try {
        const imageURL = await generateImage(prompt);

        if (!imageURL) {
            throw new Error("No response");
        }

        return {
            type: "photo",
            id: await nanoid(64),
            photo_url: imageURL,
            thumb_url: imageURL,
            caption: `🧑‍💻 <b>Prompt:</b> ${prompt}`,
            parse_mode: "HTML"
        }
    } catch (e) {
        console.log(e);

        return {
            type: "article",
            id: await nanoid(64),
            title: "An error occurred!",
            description: "An error occurred while generating your image.",
            input_message_content: {
                message_text: "An error occurred while generating your image."
            }
        };
    }
}

inline.inlineQuery(/.*/, async (ctx) => {
    if (!ADMINS.includes(ctx.from?.id || 0)) {
        return;
    }

    const query = ctx.inlineQuery.query.trim();

    if (!query) {
        return;
    }

    const results: InlineQueryResult[] = [];

    if (query.toLowerCase().startsWith("image")) {
        const prompt = query.slice(5).trim();

        if (!prompt) {
            return;
        }

        results.push(await createImageResult(prompt));
    } else {
        try {
            const response = await generateResponse(query);

            if (!response) {
                throw new Error("No response");
            }

            results.push({
                type: "article",
                id: await nanoid(64),
                title: "Your answer is ready!",
                description: response.trim().replace('language model', 'telegram bot'),
                input_message_content: {
                    message_text: `🧑‍💻 <b>Prompt:</b> ${query}\n\n🤖 <b>Answer:</b> ${response.trim().replace('language model', 'telegram bot')}`,
                    parse_mode: "HTML"
                },
            });
        } catch (e) {
            console.log(e);

            results.push({
                type: "article",
                id: await nanoid(64),
                title: "An error occurred!",
                description: "An error occurred while generating your answer.",
                input_message_content: {
                    message_text: "An error occurred while generating your answer."
                }
            });
        }
    }

    await ctx.answerInlineQuery(results);
});
