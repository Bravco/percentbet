<template>
    <UPageSection
        id="pricing"
        headline="$$$"
        title="Pricing Plans"
        :ui="{ headline: 'text-secondary' }"
    >
        <template #body>
            <div class="flex flex-col items-center gap-8">
                <USwitch
                    v-model="billedAnnualy"
                    label="Billed Annualy"
                    description="Save -20%"
                    size="lg"
                />
                <UPricingPlans class="w-full">
                    <UPricingPlan
                        v-for="(plan, index) in plans"
                        :key="index"
                        v-bind="plan"
                        variant="subtle"
                    />
                </UPricingPlans>
            </div>
        </template>
    </UPageSection>
</template>

<script lang="ts" setup>
    import type { PricingPlanProps } from "@nuxt/ui";

    const billedAnnualy = ref<boolean>(true);

    const plans = computed<PricingPlanProps[]>(() => [
        {
            title: "Free",
            description: "Limited version to try out the software.",
            price: "0$",
            features: [
                {
                    icon: "i-lucide-circle-minus",
                    title: "Less Accurate"
                },
                {
                    icon: "i-lucide-circle-minus",
                    title: "Max 1 Analysis per day"
                }
            ],
            button: {
                label: "Get started",
                color: "neutral",
                to: { path: "/", hash: "#waitlist" }
            },
            ui: { featureIcon: "text-secondary" }
        },
        {
            title: "Premium",
            description: "Full-access to all the features.",
            badge: "Advanced",
            discount: billedAnnualy.value ? "" : undefined, // 39.99$
            price: "??.??$", // 49.99$
            billingCycle: "/month",
            billingPeriod: `billed ${billedAnnualy.value ? "annualy" : 'monthly'}`,
            features: [
                "Advanced AI Model",
                "Unlimited Usage",
                "Confidence Score",
                "Tracking Prediction Markets"
            ],
            button: {
                label: "Upgrade now",
                to: { path: "/", hash: "#waitlist" }
            },
            highlight: true
        }
    ]);
</script>