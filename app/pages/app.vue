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
            <div class="content-start grid grid-cols-1 md:grid-cols-[minmax(0,42rem)_1fr] gap-4 sm:gap-6">
                <div class="flex flex-col gap-4 sm:gap-6">
                    <UForm @submit="onSubmit" class="space-y-2">
                        <UFormField
                            label="Polymarket Url"
                            description="Paste the Polymarket's prediction market url."
                            :error="error ? 'Failed to fetch Polymarket data' : false">
                            <UInput v-model="url" placeholder="https://polymarket.com/event/..." class="w-full"/>
                        </UFormField>
                        <UButton
                            type="submit"
                            label="Analyze"
                            :disabled="loading"
                            :loading="loading"
                            class="cursor-pointer"
                        />
                        <UProgress
                            v-if="loading"
                            v-model="loadingProgress"
                            size="sm"
                            class="w-full"
                        />
                    </UForm>
                    <USeparator/>
                    <div v-if="fetchingMarkets" class="flex flex-col gap-4 sm:gap-6">
                        <div v-for="_ in 4" class="flex items-center gap-4">
                            <USkeleton class="h-16 w-16 rounded-md"/>
                            <div class="w-full grid gap-2">
                                <USkeleton class="h-6 max-w-full"/>
                                <USkeleton class="h-6 max-w-full"/>
                            </div>
                        </div>
                    </div>
                    <UEmpty
                        v-else-if="predictionMarkets.length === 0"
                        icon="i-lucide-file-x"
                        title="No analysis found"
                        description="It looks like you have no past analysis. Generate one to get started."
                        :actions="[{ icon: 'i-lucide-search', label: 'Explore Polymarket',  color: 'neutral', to: 'https://polymarket.com', target: '_blank' }]"
                    />
                    <AppPredictionMarket
                        v-else
                        v-for="(predictionMarket, index) in predictionMarkets"
                        :key="index"
                        :prediction-market="predictionMarket"
                        @update:selected="predictionMarket.selected = $event"
                    />
                </div>
                <AppFeatured @analyze="analyzeMarket" :loading="loading" class="-order-1 md:order-1"/>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script lang="ts" setup>
    definePageMeta({ layout: "dashboard" });
    
    const store = usePredictionMarkets();
    const { predictionMarkets, fetchingMarkets } = storeToRefs(store);
    const { fetchMarkets, addMarket } = store;

    const url = ref<string>("https://polymarket.com/event/fed-decision-in-january");
    const error = ref<boolean>(false); 
    const loading = ref<boolean>(false);
    const loadingProgress = ref<number>(0);
    let progressInterval: NodeJS.Timeout | null = null;

    const slug = computed<string | undefined>(() => url.value.split("/event/")[1]?.split("?")[0]);

    function analyzeMarket(slug: string) {
        error.value = false;
        loading.value = true;
        loadingProgress.value = 0;

        progressInterval = setInterval(() => {
            if (loadingProgress.value < 90) {
                loadingProgress.value += Math.random()*8;
            }
        }, 400);

        addMarket(slug)
            .catch(() => {
                error.value = true;
            })
            .finally(() => {
                if (progressInterval) clearInterval(progressInterval);
                loading.value = false;
            });
    }

    function onSubmit() {
        if (!slug.value) return;
        analyzeMarket(slug.value);
    }

    onMounted(() => {
        if (predictionMarkets.value.length === 0) fetchMarkets();
    });
</script>