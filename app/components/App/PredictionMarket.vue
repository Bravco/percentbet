<template>
    <UCollapsible
        :open="predictionMarket.selected"
        @update:open="emit('update:selected', $event)"
        class="flex flex-col gap-4"
    >
        <div class="w-full flex items-center justify-between gap-4 cursor-pointer">
            <div class="w-full flex sm:flex-row flex-col sm:items-center items-start gap-4">
                <img
                    :src="predictionMarket.image"
                    alt="prediction market image"
                    class="w-16 aspect-square object-cover object-center rounded-md"
                >
                <div class="flex flex-col">
                    <span class="text-xs text-muted">
                        Analyzed {{ predictionMarket.createdAt.toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short'
                        }) }}
                    </span>
                    <UButton
                        @click.stop
                        :to="predictionMarketUrl"
                        target="_blank"
                        variant="link"
                        color="neutral"
                        :ui="{ base: 'mb-1 p-0 cursor-pointer' }"
                        :label="predictionMarket.title"
                    >
                        <h2 class="text-xl font-medium leading-none">
                            {{ predictionMarket.title }}
                            <UIcon name="i-lucide-arrow-up-right" class="size-4 align-top -ml-1"/>
                        </h2>
                    </UButton>
                    <div class="flex flex-wrap items-center gap-2">
                        <UBadge
                            :label="predictionMarket.closed ? 'Closed' : 'Active'"
                            :color="predictionMarket.closed ? 'error' : 'success'"
                            variant="soft"
                        />
                        <span class="text-sm text-muted">{{ formatVolume(predictionMarket.volume) }}</span>
                        <div v-if="predictionMarket.endDate" class="flex items-center gap-1 text-muted">
                            <UIcon name="i-lucide-clock"/>
                            <span class="text-sm">{{ predictionMarket.endDate.toDateString() }}</span>
                        </div>
                    </div>
                </div>
                <span v-if="analysisMode === 'outcome' && selectedMarket" class="sm:ml-auto text-xl font-medium text-success">
                    {{ formatROI(selectedMarket.chance) }}
                </span>
                <span v-else-if="analysisMode === 'edge' && bestMarket" class="sm:ml-auto text-xl font-medium text-success">
                    {{ formatEdge(bestMarket.difference) }}
                </span>
            </div>
            <div class="flex items-center">
                <UIcon :name="`i-lucide-chevron-${predictionMarket.selected ? 'up' : 'down'}`" class="ml-auto size-5 text-muted"/>
                <UModal
                    v-model:open="open"
                    title="Delete Confirmation"
                    :description="`Are you sure you want to delete ${predictionMarket.title}`"
                >
                    <UButton @click.stop icon="i-lucide-trash-2" size="sm" color="error" variant="ghost" class="cursor-pointer"/>
                    <template #body>
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <UButton @click="confirmDelete" label="Delete Forever" color="error" class="cursor-pointer"/>
                            <UButton @click="open = false" label="Cancel" color="neutral" class="cursor-pointer"/>
                        </div>
                    </template>
                </UModal>
            </div>
        </div>
        <template #content>
            <AppOutcomeContent
                v-if="analysisMode === 'outcome'"
                :prediction-market="predictionMarket"
                :selected-market="selectedMarket"
            />
            <AppEdgeContent
                v-else-if="analysisMode === 'edge'"
                :prediction-market="predictionMarket"
                :combined-market-data="combinedMarketData"
                :best-market="bestMarket"
            />
        </template>
    </UCollapsible>
</template>

<script lang="ts" setup>
    const props = defineProps<{
        predictionMarket: PredictionMarket
    }>();

    const emit = defineEmits<{
        (e: "update:selected", value: boolean): void
    }>();

    const { deleteMarket } = usePredictionMarkets();

    const analysisMode = useState("analysisMode");
    const open = ref<boolean>(false);

    const selectedMarket = computed(() => {
        const index = props.predictionMarket.analysis?.outcomeMarketId;
        if (index === undefined) return null;
        return props.predictionMarket.markets
            .find(m => m.id === props.predictionMarket.analysis?.outcomeMarketId) ?? null;
    });

    const combinedMarketData = computed(() => {
        return props.predictionMarket.markets.map(market => {
            const prediction = props.predictionMarket.analysis?.predictions.find(p => p.marketId === market.id);
            const predictionChance = prediction?.chance ?? 0;
            const difference = predictionChance - Math.round(market.chance*100);
            return {
                ...market,
                predictionChance,
                difference
            };
        });
    });

    const bestMarket = computed(() => combinedMarketData.value.reduce((prev, curr) => 
        Math.abs(curr.difference) > Math.abs(prev.difference) ? curr : prev
    ));

    const predictionMarketUrl = computed(() => `https://polymarket.com/event/${props.predictionMarket.slug}`);

    function confirmDelete() {
        deleteMarket(props.predictionMarket.slug);
        open.value = false;
    }
</script>