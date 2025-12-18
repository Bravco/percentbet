<template>
    <UDashboardPanel id="app">
        <template #header>
            <UDashboardNavbar title="App">
                <template #leading>
                    <UDashboardSidebarCollapse/>
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
                <UForm @submit="submit" class="space-y-2">
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
                </UForm>
                <USeparator/>
                <UEmpty
                    v-if="predictionMarkets.length === 0"
                    icon="i-lucide-bar-chart-big"
                    title="No analysis found"
                    description="It looks like you have no past analysis. Generate one to get started."
                    :actions="[{ icon: 'i-lucide-search', label: 'Explore Prediction Markets',  color: 'neutral', to: 'https://polymarket.com', target: '_blank' }]"
                />
                <UCollapsible v-else v-for="predictionMarket in predictionMarkets" v-model:open="predictionMarket.selected" class="flex flex-col gap-4">
                    <div class="w-full flex items-center justify-between gap-4 cursor-pointer">
                        <div class="w-full flex sm:flex-row flex-col sm:items-center items-start gap-4">
                            <img
                                :src="predictionMarket.image"
                                alt="prediction market image"
                                class="w-16 aspect-square object-cover object-center rounded-md"
                            >
                            <div class="flex flex-col gap-2">
                                <h1 class="text-xl font-medium">{{ predictionMarket.title }}</h1>
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
                        <UIcon :name="`i-lucide-chevron-${predictionMarket.selected ? 'up' : 'down'}`" class="ml-auto size-5 text-muted"/>
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
            </div>
        </template>
    </UDashboardPanel>
</template>

<script lang="ts" setup>
    definePageMeta({ layout: "dashboard" });

    const url = ref<string>("https://polymarket.com/event/fed-decision-in-january");
    const error = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const predictionMarkets = ref<PredictionMarket[]>([]);

    const slug = computed<string | undefined>(() => url.value.split("/event/")[1]?.split("?")[0]);

    async function submit() {
        if (!slug.value) return;
    
        error.value = false;
        loading.value = true;

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
            predictionMarkets.value.push(market);
        } catch(e) {
            error.value = true;
        } finally {
            loading.value = false;
        }
    }

    const formatVolume = (volume: number) => {
        return `${Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(volume)}  Vol.`;
    }

    const formatEdge = (chance: number) => {
        return `+${100 - Math.round(chance*100)}%`;
    };
</script>