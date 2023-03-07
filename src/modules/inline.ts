import {Composer} from "grammy";
import {InlineQueryResult} from "grammy/types";
import {GPTContext} from "../bot.js";
import {generateResponse} from "../api/openai.js";
import {nanoid} from "nanoid/async";

export const inline = new Composer<GPTContext>();

inline.inlineQuery(/.*/, async (ctx) => {
    const query = ctx.inlineQuery.query.trim();

    if (!query) {
        return;
    }

    const results: InlineQueryResult[] = [];

    try {
        const response = await generateResponse(query);

        if (!response) {
            throw new Error("No response");
        }

        results.push({
            type: "article",
            id: await nanoid(64),
            title: "Your answer is ready!",
            description: response.trim(),
            input_message_content: {
                message_text: `🧑‍💻 <b>Prompt:</b> ${query}\n\n🤖 <b>Answer:</b> ${response.trim()}`,
                parse_mode: "HTML"
            },
        });
    } catch (e) {
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

    await ctx.answerInlineQuery(results);
});
