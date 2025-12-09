<template>
    <UPageSection
        id="faq"
        headline="FAQ"
        title="Frequently Asked Questions"
        :ui="{ headline: 'text-secondary' }"
    >
        <UAccordion
            :items="items"
            :ui="{
                leadingIcon: 'text-muted',
                label: 'text-lg text-muted',
                body: 'text-base'
            }"
        />
    </UPageSection>
</template>

<script lang="ts" setup>
    const items = ref([
        {
            icon: "i-lucide-circle-question-mark",
            label: "Is it free to try?",
            content: "Yes! We offer a free version of the software with all the major features, but you have limited usage."
        },
        {
            icon: "i-lucide-circle-question-mark",
            label: "Why should I use %bet?",
            content: "With %bet there is reasoning behind every trade you take, not just gambling your way towards generational wealth."
        },
        {
            icon: "i-lucide-circle-question-mark",
            label: "Will I have 100% win rate?",
            content: "100% win rate is impossible and not even the best traders have it. We are just increasing the odds of winning."
        },
        {
            icon: "i-lucide-circle-question-mark",
            label: "Does it work on all prediction markets?",
            content: "Sadly, we do not offer price predictions for any financial assets."
        }
    ]);
</script>