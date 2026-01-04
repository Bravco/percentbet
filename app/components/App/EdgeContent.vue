<template>
    <div v-if="predictionMarket.analysis && bestMarket" class="grid sm:grid-cols-3 grid-cols-1 items-center gap-4">
        <AppValueCard
            v-if="isBinary"
            label="Bet"
            :value="bestMarket.title"
            icon="i-lucide-bot"
            color="primary"
        />
        <AppValueCard
            v-else
            :label="bestMarket.difference < 0 ? 'No' : 'Yes'"
            :value="bestMarket.title"
            icon="i-lucide-bot"
            :color="bestMarket.difference < 0 ? 'error' : 'success'"
        />
        <AppValueCard
            label="Edge"
            :value="formatEdge(bestMarket.difference)"
            icon="i-lucide-dollar-sign"
            color="success"
        />
        <AppValueCard
            label="Confidence Score"
            :value="`${predictionMarket.analysis.predictionConfidence ?? 0}%`"
            icon="i-lucide-smile"
            color="tertiary"
        />
    </div>
    <div class="grid sm:grid-cols-3 grid-cols-2 items-center gap-2 py-2 uppercase text-xs text-muted">
        <span>Outcome</span>
        <span class="sm:justify-self-center justify-self-end">% Chance</span>
        <span class="sm:justify-self-end sm:block hidden">% Prediction</span>
    </div>
    <div v-for="market in combinedMarketData" :key="market.id">
        <USeparator/>
        <div class="grid grid-cols-3 items-center gap-2 py-2">
            <div>
                <h2
                    class="text-lg font-medium"
                    :class="{ 'text-primary': market.id == bestMarket?.id }"
                >{{ market.title }}</h2>
                <span
                    v-if="market.volume"
                    class="text-sm"
                    :class="market.id == bestMarket?.id ? 'text-primary/80' : 'text-muted'"
                >{{ formatVolume(market.volume) }}</span>
            </div>
            <span
                class="justify-self-center text-xl font-medium"
                :class="{ 'text-primary': market.id == bestMarket?.id }"
            >{{ formatChance(market.chance) }}</span>
            <div class="justify-self-end">
                <span
                    class="text-xl font-medium"
                    :class="{ 'text-primary': market.id == bestMarket?.id }"
                >{{ market.predictionChance }}%</span>
                <UIcon
                    :name="market.difference < 0 ? 'i-lucide-move-down' : 'i-lucide-move-up'"
                    class="size-3.5"
                    :class="market.difference < 0 ? 'text-error' : 'text-success'"
                />
                <span
                    class="text-sm"
                    :class="market.difference < 0 ? 'text-error' : 'text-success'"
                >{{ formatDifference(market.difference) }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps<{
        predictionMarket: PredictionMarket,
        combinedMarketData: any[],
        bestMarket: any
    }>();

    const isBinary = computed(() => props.combinedMarketData.length === 2);
</script>