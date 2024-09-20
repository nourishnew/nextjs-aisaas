import { checkApiLimit, increaseApiLimit } from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY_TOKEN,
});

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("No prompt provided", { status: 400 });
    }

    const input = {
      prompt_b: prompt,
    };
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expire", { status: 403 });
    }
    const output = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      { input }
    );
    if (!isPro) {
      await increaseApiLimit();
    }

    console.log("response tada");
    console.log(output);
    return NextResponse.json(output);
  } catch (err) {}
}
