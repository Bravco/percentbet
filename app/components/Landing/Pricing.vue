<template>
    <UPageSection
        id="pricing"
        headline="$$$"
        title="Pricing Plans"
        :ui="{ headline: 'text-secondary' }"
    >
        <template #body>
            <div class="flex flex-col items-center gap-8">
                <UBadge
                    label="Waitlisted users have -20% discount"
                    color="success"
                    variant="soft"
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

    const plans = computed<PricingPlanProps[]>(() => [
        {
            title: "Free",
            description: "Limited version to try out the software.",
            price: "$0",
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
                to: "/auth"
            },
            ui: { featureIcon: "text-secondary" }
        },
        {
            title: "Premium",
            description: "Full-access to all the features.",
            class: "ring-primary bg-primary/10",
            badge: "Advanced",
            price: "$29.99",
            discount: "$19.99",
            billingCycle: "/month",
            billingPeriod: "billed monthly",
            features: [
                "Advanced AI Model",
                "50 Analysis per day",
                "Confidence Score",
                "Tracking Prediction Markets"
            ],
            button: {
                label: "Upgrade now",
                to: "/auth"
            }
        }
    ]);
</script>