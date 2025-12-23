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
                        Analyzed {{ predictionMarket.createdAt.toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short'
                        }) }}
                    </span>
                    <UButton
                        @click.stop="copyToClipboard"
                        variant="link"
                        color="neutral"
                        :ui="{ base: 'p-0 cursor-pointer', }"
                    >
                        <h1 class="text-start text-xl font-medium">
                            {{ predictionMarket.title }}
                            <UIcon name="i-lucide-copy"/>
                        </h1>
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
                <span v-if="selectedMarket" class="sm:ml-auto text-xl font-medium text-success">
                    {{ formatEdge(selectedMarket.chance) }}
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
            <div v-if="selectedMarket" class="grid sm:grid-cols-3 grid-cols-1 items-center gap-4">
                <AppValueCard
                    label="Bet"
                    :value="selectedMarket.title"
                    icon="i-lucide-bot"
                    color="primary"
                />
                <AppValueCard
                    label="Edge"
                    :value="formatEdge(selectedMarket.chance)"
                    icon="i-lucide-dollar-sign"
                    color="success"
                />
                <AppValueCard
                    label="Confidence Score"
                    :value="`${predictionMarket.analysis?.confidence ?? 0}%`"
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
                            v-if="market.volume"
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

    const selectedMarket = computed(() => {
        const index = props.predictionMarket.analysis?.index;
        if (index == null) return null;
        return props.predictionMarket.markets[index] ?? null;
    });

    const formatVolume = (volume: number) => 
        Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(volume) + " Vol.";

    const formatEdge = (chance: number) => `+${100 - Math.round(chance*100)}%`;

    function copyToClipboard() {
        navigator.clipboard.writeText(`https://polymarket.com/event/${props.predictionMarket.slug}`);
        toast.add({ title: "Prediction market url copied to clipboard.", color: "info" });
    }

    function confirmDelete() {
        deleteMarket(props.predictionMarket.slug);
        open.value = false;
    }
</script>