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
                <span v-if="selectedMarket" class="sm:ml-auto text-xl font-medium text-success">
                    {{ formatProfit(selectedMarket.chance) }}
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
            <div v-if="predictionMarket.analysis && selectedMarket" class="grid sm:grid-cols-3 grid-cols-1 items-center gap-4">
                <AppValueCard
                    label="Bet"
                    :value="selectedMarket.title"
                    icon="i-lucide-bot"
                    color="primary"
                />
                <AppValueCard
                    label="Profit"
                    :value="formatProfit(selectedMarket.chance)"
                    icon="i-lucide-dollar-sign"
                    color="success"
                />
                <AppValueCard
                    label="Confidence Score"
                    :value="`${predictionMarket.analysis.confidence ?? 0}%`"
                    icon="i-lucide-smile"
                    color="tertiary"
                />
            </div>
            <div class="grid sm:grid-cols-3 grid-cols-2 items-center gap-2 py-2 uppercase text-xs text-muted">
                <span>Outcome</span>
                <span class="sm:justify-self-center justify-self-end">% Chance</span>
                <span class="sm:justify-self-end sm:block hidden">Prices</span>
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
    </UCollapsible>
</template>

<script lang="ts" setup>
    const { deleteMarket } = usePredictionMarkets();

    const props = defineProps<{
        predictionMarket: PredictionMarket
    }>();

    const emit = defineEmits<{
        (e: "update:selected", value: boolean): void
    }>();

    const open = ref<boolean>(false);

    const selectedMarket = computed(() => {
        const index = props.predictionMarket.analysis?.marketId;
        if (index === undefined) return null;
        return props.predictionMarket.markets
            .find(m => m.id === props.predictionMarket.analysis?.marketId) ?? null;
    });

    const predictionMarketUrl = computed(() => `https://polymarket.com/event/${props.predictionMarket.slug}`);

    function confirmDelete() {
        deleteMarket(props.predictionMarket.slug);
        open.value = false;
    }
</script>