export const useStripeCheckout = () => {
    const auth = useFirebaseAuth();

    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);
    
    const checkout = async () => {
        loading.value = true;
        error.value = false;
        try {
            const token = await auth?.currentUser?.getIdToken();
            if (!token) throw new Error("User not authenticated");

            const { url } = await $fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (url) window.location.assign(url);
            else error.value = true;
        } catch {
            error.value = true;
        } finally {
            loading.value = false;
        }
    };

    return { checkout, loading, error };
};