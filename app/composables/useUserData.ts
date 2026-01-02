import { doc } from "firebase/firestore";

export const useUserData = () => {
    const firestore = useFirestore();
    const user = useCurrentUser();

    const ref = computed(() => {
        if (!user.value) return null;
        return doc(firestore, "users", user.value.uid);
    });

    const data = useDocument(ref);

    const isPremium = computed(() =>
        Array.isArray(data.value?.entitlements) && data.value.entitlements.includes("premium")
    );

    return { data, isPremium };
};