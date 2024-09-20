import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import {
  ChatCompletionCreateParamsBase,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions.mjs";

const apikey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apikey,
});
type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;
    const instruction: Message = {
      role: "system",
      content:
        "You are a code generator. You must answer only in mardown code snippets. Use code comments for explanations. If the question is not related to programming, reply Boom. If there are any words that are not related to programming, say oops No, i am out",
    };
    const yoyo: Message[] = [instruction, ...messages];
    console.log(yoyo);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!apikey) {
      return new NextResponse("Missing OpenAI API Key", { status: 500 });
    }
    if (!messages) {
      return new NextResponse("No messages provided", { status: 400 });
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: yoyo,
    });
    console.log("response tada");
    console.log(response.choices[0]);
    return NextResponse.json(response.choices[0].message.content);
  } catch (err) {}
}
