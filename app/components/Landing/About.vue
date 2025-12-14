<template>
    <UPageSection
        id="about"
        title="What %bet is?"
        description="%bet is an AI-powered tool that finds mispriced prediction markets and shows you your percentage edge."
        icon="i-lucide-chart-spline"
        :features="features"
        orientation="horizontal"
        :ui="{ leadingIcon: 'text-secondary' }"
    >
        <NuxtImg class="h-full object-contain object-center" src="/images/about.svg" alt="track"/>
    </UPageSection>
</template>

<script lang="ts" setup>
    const features = ref([
        {
            title: "Finds percentual edge",
            icon: "i-lucide-percent"
        },
        {
            title: "Generates confidence score",
            icon: "i-lucide-smile"
        },
        {
            title: "Supports Polymarket",
            icon: "i-lucide-check"
        }
    ]);
</script>