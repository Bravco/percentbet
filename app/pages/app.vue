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

    function onSubmit() {
        if (!slug.value) return;
    
        error.value = false;
        loading.value = true;
        loadingProgress.value = 0;

        progressInterval = setInterval(() => {
            if (loadingProgress.value < 90) {
                loadingProgress.value += Math.random()*8;
            }
        }, 400);

        addMarket(slug.value)
            .catch(() => {
                error.value = true;
            })
            .finally(() => {
                if (progressInterval) clearInterval(progressInterval);
                loading.value = false;
            });
    }

    onMounted(() => {
        if (predictionMarkets.value.length === 0) fetchMarkets();
    });
</script>