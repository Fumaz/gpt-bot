import {hydrateReply, ParseModeFlavor} from "@grammyjs/parse-mode";
import {hydrate, HydrateFlavor} from "@grammyjs/hydrate";
import {Bot, Context} from "grammy";
import {run} from "@grammyjs/runner";
import {BOT_TOKEN, BOT_USERNAME} from "./config.js";
import {inline} from "./modules/inline.js";

export type GPTContext = ParseModeFlavor<HydrateFlavor<Context>>;

const bot = new Bot<GPTContext>(BOT_TOKEN);

bot.use(hydrateReply);
bot.use(hydrate());

bot.use(inline);

console.log("🤖 Logged in as @" + BOT_USERNAME);
run(bot);
