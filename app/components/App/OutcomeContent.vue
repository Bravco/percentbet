<template>
    <div v-if="predictionMarket.analysis && selectedMarket" class="grid sm:grid-cols-3 grid-cols-1 items-center gap-4">
        <AppValueCard
            label="Bet"
            :value="selectedMarket.title"
            icon="i-lucide-bot"
            color="primary"
        />
        <AppValueCard
            label="ROI"
            :value="formatROI(selectedMarket.chance)"
            icon="i-lucide-dollar-sign"
            color="success"
        />
        <AppValueCard
            label="Confidence Score"
            :value="`${predictionMarket.analysis.outcomeConfidence ?? 0}%`"
            icon="i-lucide-smile"
            color="tertiary"
        />
    </div>
    <div class="grid sm:grid-cols-3 grid-cols-2 items-center gap-2 py-2 uppercase text-xs text-muted">
        <span>Outcome</span>
        <span class="sm:justify-self-center justify-self-end">% Chance</span>
        <span class="sm:justify-self-end sm:block hidden">Price</span>
    </div>
    <div v-for="market in predictionMarket.markets" :key="market.id">
        <USeparator/>
        <div class="grid sm:grid-cols-3 grid-cols-2 items-center gap-2 py-2">
            <div>
                <h2
                    class="text-lg font-medium"
                    :class="{ 'text-primary': market.id == selectedMarket?.id }"
                >{{ market.title }}</h2>
                <span
                    v-if="market.volume"
                    class="text-sm"
                    :class="market.id == selectedMarket?.id ? 'text-primary/80' : 'text-muted'"
                >{{ formatVolume(market.volume) }}</span>
            </div>
            <span
                class="sm:justify-self-center justify-self-end text-xl font-medium"
                :class="{ 'text-primary': market.id == selectedMarket?.id }"
            >{{ formatChance(market.chance) }}</span>
            <div class="w-full sm:justify-self-end sm:col-span-1 col-span-2 flex items-center gap-2">
                <UBadge
                    :label="formatYesPrice(market.chance)"
                    variant="soft"
                    color="success"
                    size="lg"
                    class="w-full justify-center"
                />
                <UBadge
                    :label="formatNoPrice(market.chance)"
                    variant="soft"
                    color="error"
                    size="lg"
                    class="w-full justify-center"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps<{
        predictionMarket: PredictionMarket,
        selectedMarket: any
    }>();
</script>