export default defineEventHandler(async (event) => {
    const authHeader = getHeader(event, "authorization");
    if (!authHeader) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const userRef = adminFirestore.collection("users").doc(uid);
    const userSnap = await userRef.get();

    let stripeCustomerId = userSnap.data()?.stripeCustomerId;
    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: decoded.email,
            metadata: { uid }
        });
        stripeCustomerId = customer.id;
        await userRef.set({ stripeCustomerId }, { merge: true });
    }

    const origin = getHeader(event, "origin");
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: stripeCustomerId,
        line_items: [
            { price: process.env.STRIPE_PRICE_ID, quantity: 1 }
        ],
        allow_promotion_codes: true,
        success_url: `${origin}/app`,
        cancel_url: `${origin}/settings/billing`,
    });

    return { url: session.url };
});