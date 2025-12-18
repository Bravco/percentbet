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
                label="Manage subscription"
                color="neutral"
                class="w-fit lg:ms-auto"
                to=""
            />
        </UPageCard>
        <UPricingPlan v-bind="plan" variant="subtle"/>
    </div>
</template>

<script lang="ts" setup>
    import type { PricingPlanProps } from "@nuxt/ui";

    const billedAnnualy = ref<boolean>(true);

    const plan = computed<PricingPlanProps>(() => ({
        title: "Premium",
        description: "Full-access to all the features.",
        class: "ring-primary bg-primary/10",
        badge: "Advanced",
        discount: billedAnnualy.value ? "" : undefined, // $39.99
        price: "$??.??", // $49.99
        billingCycle: "/month",
        billingPeriod: `billed ${billedAnnualy.value ? "annualy" : 'monthly'}`
    }));
</script>