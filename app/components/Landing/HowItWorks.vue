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
                variant="subtle"
            >
                <template #leading>
                    <UBadge :label="index+1" variant="soft"/>
                </template>
                <NuxtImg v-if="card.imageUrl" :src="card.imageUrl" :alt="`how-it-works-${index+1}`" class="h-50 w-full object-cover object-center bg-default rounded-md"/>
                <Placeholder v-else class="h-50"/>
            </UPageCard>
        </UPageGrid>
    </UPageSection>
</template>

<script lang="ts" setup>
    const cards = ref([
        {
            title: "Paste prediction market URL",
            description: "Copy and paste the prediction market URL you want to analyze.",
            imageUrl: "/images/how-it-works-1.webp"
        },
        {
            title: "Analyze the market",
            description: "Press the analyze button and see if you have an edge in the selected prediction market.",
            imageUrl: "/images/how-it-works-2.webp"
        },
        {
            title: "Execute calculated trade",
            description: "If there is an opportunity, take a calculated trade and let the profits pile up.",
            imageUrl: "/images/how-it-works-3.webp"
        }
    ]);
</script>