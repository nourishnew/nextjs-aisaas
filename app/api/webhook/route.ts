import Stripe from "stripe";
import { headers } from "next/headers";

import prismadb from "@/lib/prismadb";

import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse("Webhook error", { status: 401 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 401 });
    }
    try {
      await prismadb.userSubscription.create({
        data: {
          userId: session?.metadata?.userId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
    } catch (err) {
      return new NextResponse("DB error", { status: 402 });

      console.log(err);
    }
  }

  if (event.type == "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    try {
      await prismadb.userSubscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
    } catch (err) {
      return new NextResponse("DB error", { status: 402 });
      console.log(err);
    }
  }

  return new NextResponse(null, { status: 200 });
}
