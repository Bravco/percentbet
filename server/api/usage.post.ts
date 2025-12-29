import { FieldValue } from "firebase-admin/firestore";

export default defineEventHandler(async (event) => {
    const authHeader = getHeader(event, "authorization");
    if (!authHeader) {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const usageRef = adminFirestore.doc(`users/${uid}/usage/${today}`);

    const userDoc = await adminFirestore.doc(`users/${uid}`).get();
    const userData = userDoc.data();
    const isPremium = Array.isArray(userData?.entitlements) && userData.entitlements.includes("premium");
    const limit = isPremium ? 100 : 1;

    await adminFirestore.runTransaction(async (tx) => {
        const snap = await tx.get(usageRef);

        if (!snap.exists) {
            tx.set(usageRef, {
                count: 1,
                limit,
                date: today,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp()
            });
            return;
        }

        const data = snap.data();
        if (!data) throw new Error("Unexpected: data missing");

        if (data.count >= data.limit) {
            throw createError({
                statusCode: 429,
                statusMessage: "Daily usage limit reached"
            });
        }

        tx.update(usageRef, {
            count: FieldValue.increment(1),
            updatedAt: FieldValue.serverTimestamp()
        });
    });

    return { success: true };
});