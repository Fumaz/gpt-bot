import {Configuration, OpenAIApi} from "openai";
import {API_KEY, MODEL} from "../config.js";

const configuration = new Configuration({
    apiKey: API_KEY
});

const openai = new OpenAIApi(configuration);

export async function generateResponse(prompt: string, model: string = MODEL, max_tokens: number = 256) {
    const completion = await openai.createChatCompletion({
        model: MODEL,
        messages: [{
            role: "user",
            content: prompt
        }],
        max_tokens: max_tokens,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    });

    for (const choice of completion.data.choices) {
        const message = choice.message;

        if (!message) {
            continue;
        }

        if (message.role === "assistant") {
            return message.content;
        }
    }

    throw new Error("No response");
}

export async function generateImage(prompt: string) {
    const completion = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "url"
    });

    return completion.data.data[0].url;
}
