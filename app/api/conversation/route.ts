import { checkApiLimit, increaseApiLimit } from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const apikey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apikey,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!apikey) {
      return new NextResponse("Missing OpenAI API Key", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("No messages provided", { status: 400 });
    }
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expire", { status: 403 });
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });
    if (!isPro) {
      await increaseApiLimit();
    }
    console.log("response tada");
    console.log(response.choices[0]);
    return NextResponse.json(response.choices[0].message.content);
  } catch (err) {
    console.log(err);
    return new NextResponse("DB error", { status: 400 });
  }
}
