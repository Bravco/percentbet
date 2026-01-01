<template>
    <div>
        <UPageCard
            title="Subscription Plan"
            description="Your current plan will be displayed here."
            variant="naked"
            orientation="horizontal"
            class="mb-4"
        >
            <UButton
                @click="openBillingPortal"
                :loading="billingLoading"
                :disabled="billingLoading || !isPremium"
                label="Manage subscription"
                color="neutral"
                class="w-fit lg:ms-auto cursor-pointer"
            />
        </UPageCard>
        <UPricingPlan v-bind="isPremium ? premiumPlan : freePlan" variant="subtle"/>
    </div>
    <UPricingPlan
        v-if="!isPremium"
        v-bind="premiumPlan"
        :button="{
            onClick: checkout,
            loading: checkoutLoading,
            disabled: checkoutLoading,
            label: 'Upgrade to Premium',
            icon: 'i-lucide-star',
            class: 'cursor-pointer'
        }"
        variant="subtle"
    />
</template>

<script lang="ts" setup>
    import type { PricingPlanProps } from "@nuxt/ui";

    const auth = useFirebaseAuth();
    const { isPremium } = useUserData();
    const { checkout, loading: checkoutLoading } = useStripeCheckout();

    const billingLoading = ref<boolean>(false);

    const freePlan = computed<PricingPlanProps>(() => ({
        title: "Free",
        description: "Limited version to try out the software.",
        price: "$0",
    }));

    const premiumPlan = computed<PricingPlanProps>(() => ({
        title: "Premium",
        description: "Full-access to all the features.",
        class: "ring-primary bg-primary/10",
        badge: "Advanced",
        price: "$29.99",
        billingCycle: "/month",
        billingPeriod: "billed monthly"
    }));

    const openBillingPortal = async () => {
        billingLoading.value = true;
        try {
            const token = await auth?.currentUser?.getIdToken();
            if (!token) throw new Error("User not authenticated");

            const { url } = await $fetch("/api/stripe/portal", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (url) window.location.assign(url);
        } finally {
            billingLoading.value = false;
        }
    };
</script>