import { doc, getDoc } from "firebase/firestore";

export const useUserData = () => {
    const firestore = useFirestore();
    const user = useCurrentUser();

    const { data, pending, refresh } = useAsyncData(
        "userData",
        async () => {
            if (!user.value) return null;
            const ref = doc(firestore, "users", user.value.uid);
            const snap = await getDoc(ref);
            return snap.data();
        },
        {
            watch: [user],
            immediate: true,
            server: false
        }
    );

    const isPremium = computed(() =>
        Array.isArray(data.value?.entitlements) && data.value.entitlements.includes("premium")
    );

    return { data, pending, refresh, isPremium };
};