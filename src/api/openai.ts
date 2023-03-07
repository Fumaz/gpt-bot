import {Configuration, OpenAIApi} from "openai";
import {API_KEY, MODEL} from "../config.js";

const configuration = new Configuration({
    apiKey: API_KEY
});

const openai = new OpenAIApi(configuration);

export async function generateResponse(prompt: string) {
    const completion = await openai.createCompletion({
        model: MODEL,
        prompt: prompt
    });

    return completion.data.choices[0].text;
}
