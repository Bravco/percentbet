<template>
    <UDashboardPanel id="app">
        <template #header>
            <UDashboardNavbar title="Prediction Markets">
                <template #leading>
                    <UDashboardSidebarCollapse/>
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <div class="flex flex-col gap-4 sm:gap-6 w-full lg:max-w-2xl mx-auto">
                <UForm @submit="onSubmit" class="space-y-2">
                    <UFormField
                        label="Polymarket Url"
                        description="Paste the Polymarket's prediction market url."
                        :error="error ? 'Failed to fetch Polymarket data' : false">
                        <UInput v-model="url" placeholder="https://polymarket.com/event/..." class="w-full"/>
                    </UFormField>
                    <UButton
                        type="submit"
                        :label="loading ? 'Analyzing' : 'Analyze'"
                        :icon="loading ? 'i-eos-icons-loading' : ''"
                        class="cursor-pointer"
                        :disabled="loading"
                    />
                    <UProgress
                        v-if="loading"
                        v-model="loadingProgress"
                        size="sm"
                        class="w-full"
                    />
                </UForm>
                <USeparator/>
                <UEmpty
                    v-if="predictionMarkets.length === 0"
                    icon="i-lucide-file-x"
                    title="No analysis found"
                    description="It looks like you have no past analysis. Generate one to get started."
                    :actions="[{ icon: 'i-lucide-search', label: 'Explore Prediction Markets',  color: 'neutral', to: 'https://polymarket.com', target: '_blank' }]"
                />
                <AppPredictionMarket
                    v-else
                    v-for="(predictionMarket, index) in predictionMarkets"
                    :key="index"
                    :prediction-market="predictionMarket"
                    @update:selected="predictionMarket.selected = $event"
                />
            </div>
        </template>
    </UDashboardPanel>
</template>

<script lang="ts" setup>
    definePageMeta({ layout: "dashboard" });

    const predictionMarkets = ref<PredictionMarket[]>([]);
    const url = ref<string>("https://polymarket.com/event/fed-decision-in-january");
    const error = ref<boolean>(false); 
    const loading = ref<boolean>(false);
    const loadingProgress = ref<number>(0);
    let progressInterval: NodeJS.Timeout | null = null;

    const slug = computed<string | undefined>(() => url.value.split("/event/")[1]?.split("?")[0]);

    async function onSubmit() {
        if (!slug.value) return;
    
        error.value = false;
        loading.value = true;
        loadingProgress.value = 0;

        progressInterval = setInterval(() => {
            if (loadingProgress.value < 90) {
                loadingProgress.value += Math.random()*8;
            }
        }, 400);

        try {
            const polymarketData = await $fetch<PolymarketApiResponse>(`/api/polymarket?slug=${slug.value}`);
            const market: PredictionMarket = {
                title: polymarketData.title,
                image: polymarketData.image,
                endDate: new Date(polymarketData.endDate),
                volume: polymarketData.volume,
                closed: polymarketData.closed,
                markets: polymarketData.markets.filter(m => !m.closed).map((m, i) => ({
                    index: i,
                    title: m.groupItemTitle,
                    volume: m.volume,
                    chance: JSON.parse(m.outcomePrices)[0]
                })),
                selected: true
            };
            const analysis = await $fetch<MarketAnalysis>("/api/openai", {
                method: "POST",
                body: {
                    title: market.title,
                    description: polymarketData.description,
                    volume: market.volume,
                    endDate: market.endDate.toISOString(),
                    markets: market.markets
                }
            });
            market.analysis = analysis;
            predictionMarkets.value.forEach(pm => pm.selected = false);
            predictionMarkets.value.unshift(market);
        } catch(e) {
            error.value = true;
        } finally {
            if (progressInterval) clearInterval(progressInterval);
            loading.value = false;
        }
    }
</script>