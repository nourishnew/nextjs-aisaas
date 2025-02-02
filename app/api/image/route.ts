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
		const { prompt, amount = 1, resolution = "1024x1024" } = body;

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		if (!apikey) {
			return new NextResponse("Missing OpenAI API Key", { status: 500 });
		}

		if (!prompt) {
			return new NextResponse("Prompt is required ", { status: 400 });
		}
		if (!amount) {
			return new NextResponse("amount is required ", { status: 400 });
		}
		if (!resolution) {
			return new NextResponse("resolution is required ", { status: 400 });
		}

		const response = await openai.images.generate({
			model: "dall-e-3",
			prompt: prompt,
			n: 1,
			size: resolution,
		});

		console.log("response tada");
		return NextResponse.json(response.data);
	} catch (err) {
		return new NextResponse("Internal Server Error");
	}
}
