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
                    <span class="text-xs text-muted -mb-1">
                        Generated {{ predictionMarket.createdAt.toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short'
                        }) }}
                    </span>
                    <UButton
                        @click.stop="copyToClipboard"
                        trailing-icon="i-lucide-copy"
                        variant="link"
                        color="neutral"
                        :ui="{ base: 'p-0 cursor-pointer', }"
                    >
                        <h1 class="text-xl font-medium">{{ predictionMarket.title }}</h1>
                    </UButton>
                    <div class="flex flex-wrap items-center gap-2">
                        <UBadge
                            :label="predictionMarket.closed ? 'Closed' : 'Active'"
                            :color="predictionMarket.closed ? 'error' : 'success'"
                            variant="soft"
                        />
                        <span class="text-sm text-muted">{{ formatVolume(predictionMarket.volume) }}</span>
                        <div class="flex items-center gap-1 text-muted">
                            <UIcon name="i-lucide-clock"/>
                            <span class="text-sm">{{ predictionMarket.endDate.toDateString() }}</span>
                        </div>
                    </div>
                </div>
                <span v-if="predictionMarket.analysis" class="sm:ml-auto text-xl font-medium text-success">
                    {{ formatEdge(predictionMarket.markets[predictionMarket.analysis.index]?.chance ?? 0) }}
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
            <div v-if="predictionMarket.analysis" class="grid sm:grid-cols-3 grid-cols-1 items-center gap-4">
                <AppValueCard
                    label="Bet"
                    :value="predictionMarket.markets[predictionMarket.analysis.index]?.title ?? ''"
                    icon="i-lucide-bot"
                    color="primary"
                />
                <AppValueCard
                    label="Edge"
                    :value="formatEdge(predictionMarket.markets[predictionMarket.analysis.index]?.chance ?? 0)"
                    icon="i-lucide-dollar-sign"
                    color="success"
                />
                <AppValueCard
                    label="Confidence Score"
                    :value="`${Math.round(predictionMarket.analysis.confidence)}%`"
                    icon="i-lucide-smile"
                    color="secondary"
                />
            </div>
            <div class="flex justify-between items-center gap-2 py-2 uppercase text-xs text-muted">
                <span>Outcome</span>
                <span class="text-center">% Chance</span>
            </div>
            <div v-for="market in predictionMarket.markets" :key="market.index">
                <USeparator/>
                <div class="flex justify-between items-center gap-2 py-2">
                    <div>
                        <h2
                            class="text-lg font-medium"
                            :class="{ 'text-primary': market.index == predictionMarket.analysis?.index }"
                        >{{ market.title }}</h2>
                        <span
                            class="text-sm"
                            :class="market.index == predictionMarket.analysis?.index ? 'text-primary/80' : 'text-muted'"
                        >{{ formatVolume(market.volume) }}</span>
                    </div>
                    <span
                        class="text-xl font-medium"
                        :class="{ 'text-primary': market.index == predictionMarket.analysis?.index }"
                    >{{ Math.round(market.chance*100) }}%</span>
                </div>
            </div>
        </template>
    </UCollapsible>
</template>

<script lang="ts" setup>
    const toast = useToast();
    const { deleteMarket } = usePredictionMarkets();

    const props = defineProps<{
        predictionMarket: PredictionMarket
    }>();

    const emit = defineEmits<{
        (e: "update:selected", value: boolean): void
    }>();

    const open = ref<boolean>(false);

    const formatVolume = (volume: number) => {
        return `${Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(volume)}  Vol.`;
    }

    const formatEdge = (chance: number) => {
        return `+${100 - Math.round(chance*100)}%`;
    };

    function copyToClipboard() {
        navigator.clipboard.writeText(`https://polymarket.com/event/${props.predictionMarket.slug}`);
        toast.add({ title: "Prediction market url copied to clipboard.", color: "info" });
    }

    function confirmDelete() {
        deleteMarket(props.predictionMarket.slug);
        open.value = false;
    }
</script>