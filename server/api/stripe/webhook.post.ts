import { useServerStripe } from "#stripe/server";

export default defineEventHandler(async (event) => {
    const sig = getHeader(event, "stripe-signature");
    const body = await readRawBody(event);
    
    const stripe = useServerStripe(event);
    const stripeEvent = stripe.webhooks.constructEvent(
        body!,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (
        stripeEvent.type === "customer.subscription.created" ||
        stripeEvent.type === "customer.subscription.updated"
    ) {
        const sub = stripeEvent.data.object;
        const userSnap = await adminFirestore
            .collection("users")
            .where("stripeCustomerId", "==", sub.customer)
            .limit(1)
            .get();
        
            if (!userSnap.empty) {
                await userSnap.docs[0].ref.set({
                    subscription: {
                        id: sub.id,
                        status: sub.status,
                        priceId: sub.items.data[0].price.id,
                        currentPeriodStart: new Date(sub.items.data[0].current_period_start * 1000),
                        currentPeriodEnd: new Date(sub.items.data[0].current_period_end * 1000)
                    },
                    entitlements: (sub.status === "active" || sub.status === "trialing")
                        ? ["premium"]
                        : []
                }, { merge: true });
            }
    }

    if (stripeEvent.type === "customer.subscription.deleted") {
        const sub = stripeEvent.data.object;
        const userSnap = await adminFirestore
            .collection("users")
            .where("stripeCustomerId", "==", sub.customer)
            .limit(1)
            .get();
        
        if (!userSnap.empty) {
            await userSnap.docs[0].ref.set({
                subscription: { status: "canceled" },
                entitlements: []
            }, { merge: true });
        }
    }

    return { received: true };
});