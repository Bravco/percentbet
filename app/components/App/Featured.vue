<template>
    <div class="sticky top-0 flex flex-col gap-2">
        <h2 class="flex items-center gap-1 font-medium">
            <span>Trending</span>
            <UIcon name="i-lucide-trending-up"/>
        </h2>
        <div class="overflow-auto grid grid-flow-col md:grid-flow-row auto-cols-[minmax(250px,1fr)] md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
            <div
                v-if="markets"
                v-for="market in markets"
                :key="market.id"
                class="flex flex-col gap-2 bg-elevated border border-default p-2.5 rounded-md"
            >
                <div class="flex items-center gap-2">
                    <img
                        :src="market.image"
                        alt="prediction market image"
                        class="w-10 aspect-square object-cover object-center rounded-md"
                    >
                    <UButton
                        :to="`https://polymarket.com/event/${market.slug}`"
                        target="_blank"
                        :label="market.title"
                        variant="link"
                        color="neutral"
                        class="p-0 truncate hover:underline"
                    />
                </div>
                <ul>
                    <li
                        v-for="m in normalizePolymarketMarkets(market.markets).slice(0, 2)"
                        :key="m.id"
                        class="flex items-center justify-between"
                    >
                        <span class="text-sm">{{ m.title }}</span>
                        <span class="font-medium">{{ formatChance(m.chance) }}</span>
                    </li>
                </ul>
                <UButton
                    @click="onAnalyze(market.slug)"
                    label="Analyze"
                    :disabled="loading"
                    :loading="loading"
                    color="neutral"
                    size="xs"
                    class="mt-auto w-fit cursor-pointer"
                />
            </div>
            <USkeleton v-else v-for="_ in 20" class="w-full h-[150px]"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps<{
        loading: boolean
    }>();

    const emit = defineEmits<{
        (e: "analyze", slug: string): void
    }>();

    const { normalizePolymarketMarkets } = usePredictionMarkets();
    const { data: markets } = await useFetch<PolymarketApiResponse[], any[]>("/api/featured");

    function onAnalyze(slug: string) {
        if (props.loading) return;
        emit("analyze", slug);
    }
</script>