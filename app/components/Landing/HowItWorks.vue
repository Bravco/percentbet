<template>
    <UPageSection
        id="how-it-works"
        headline="3 easy steps"
        title="How it works"
        description="Copy. Paste. We analyze — and find prediction market opportunities, for you."
        :ui="{ headline: 'text-secondary' }"
    >
        <UPageGrid>
            <UPageCard
                v-for="(card, index) in cards"
                :key="index"
                v-bind="card"
                :reverse="true"
            >
                <template #leading>
                    <UBadge :label="index+1" variant="soft"/>
                </template>
                <Placeholder class="h-50"/>
            </UPageCard>
        </UPageGrid>
    </UPageSection>
</template>

<script lang="ts" setup>
    const cards = ref([
        {
            title: "Paste prediction market URL",
            description: "Copy and paste the prediction market URL you want to analyze."
        },
        {
            title: "Analyze the market",
            description: "Press the analyze button and see if you have an edge in the selected prediction market."
        },
        {
            title: "Execute calculated trade",
            description: "If there is an opportunity, take a calculated trade and let the profits pile up."
        }
    ]);
</script>