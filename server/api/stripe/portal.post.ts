import { useServerStripe } from "#stripe/server";

export default defineEventHandler(async (event) => {
    const stripe = useServerStripe(event);
    const token = getHeader(event, 'authorization')?.replace("Bearer ", "");
    const decoded = await adminAuth.verifyIdToken(token!);
    const userSnap = await adminFirestore
        .collection("users")
        .doc(decoded.uid)
        .get();
    const stripeCustomerId = userSnap.data()?.stripeCustomerId;

    const origin = getHeader(event, "origin");
    const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${origin}/settings/billing`
    });

    return { url: session.url };
});