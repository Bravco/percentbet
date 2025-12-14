<template>
    <UContainer class="flex flex-col gap-8 py-8">
        <UForm @submit="submit" class="mx-auto space-y-2">
            <UFormField
                label="Polymarket Url"
                description="Paste the Polymarket's prediction market url."
                :error="error ? 'Failed to fetch Polymarket data' : false">
                <UInput v-model="url" placeholder="https://polymarket.com/event/..." class="w-full"/>
            </UFormField>
            <UButton
                type="submit"
                :label="loading ? '' : 'Analyze'"
                :icon="loading ? 'i-eos-icons-loading' : ''"
                class="cursor-pointer"
                :disabled="loading"
            />
        </UForm>
        <USeparator/>
        <UCollapsible v-for="data in markets" v-model:open="data.open" class="flex flex-col gap-4">
            <div class="w-full flex items-center justify-between gap-4 cursor-pointer">
                <div class="w-full flex sm:flex-row flex-col sm:items-center items-start gap-4">
                    <NuxtImg
                        :src="data.image"
                        alt="prediction market image"
                        class="w-16 aspect-square object-cover object-center rounded-md"
                    />
                    <div class="flex flex-col gap-2">
                        <h1 class="text-xl font-medium">{{ data.title }}</h1>
                        <div class="flex flex-wrap items-center gap-2">
                            <UBadge
                                :label="data.closed ? 'Closed' : 'Active'"
                                :color="data.closed ? 'error' : 'success'"
                                variant="soft"
                            />
                            <span class="text-sm text-muted">{{ Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(data.volume) }} Vol.</span>
                            <div class="flex items-center gap-1 text-muted">
                                <UIcon name="i-lucide-clock"/>
                                <span class="text-sm">{{ data.endDate.toDateString() }}</span>
                            </div>
                        </div>
                    </div>
                    <span class="sm:ml-auto text-xl font-medium text-success">+79%</span>
                </div>
                <UIcon :name="`i-lucide-chevron-${data.open ? 'up' : 'down'}`" class="ml-auto size-5 text-muted"/>
            </div>
            <template #content>
                <div class="grid sm:grid-cols-3 grid-cols-1 items-center gap-4">
                    <AppValueCard label="Bet" value="25 bps decrease" icon="i-lucide-bot" color="primary"/>
                    <AppValueCard label="Edge" value="+79%" icon="i-lucide-dollar-sign" color="success"/>
                    <AppValueCard label="Confidence Score" value="80%" icon="i-lucide-smile" color="secondary"/>
                </div>
                <div class="flex justify-between items-center gap-2 py-2 uppercase text-xs text-muted">
                    <span>Outcome</span>
                    <span class="text-center">% Chance</span>
                </div>
                <div v-for="(market, index) in data.markets" :key="index">
                    <USeparator/>
                    <div class="flex justify-between items-center gap-2 py-2">
                        <div>
                            <h2 class="text-lg font-medium" :class="{ 'text-primary': index == 1 }">{{ market.title }}</h2>
                            <span class="text-sm" :class="index == 1 ? 'text-primary/80' : 'text-muted'">{{ Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(market.volume) }} Vol.</span>
                        </div>
                        <span class="text-xl font-medium" :class="{ 'text-primary': index == 1 }">{{ Number(market.outcomePrices[0]*100).toFixed(0) }}%</span>
                    </div>
                </div>
            </template>
        </UCollapsible>
    </UContainer>
</template>

<script lang="ts" setup>
    interface PolymarketApiResponse {
        title: string;
        image: string;
        endDate: string;
        volume: number;
        markets: {
            closed: boolean,
            groupItemTitle: string;
            volume: number;
            outcomePrices: string;
        }[];
    }

    const url = ref<string>("https://polymarket.com/event/fed-decision-in-january");
    const error = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const markets = ref<any[]>([]);

    const slug = computed<string | undefined>(() => url.value.split("/event/")[1]?.split("?")[0]);

    async function submit() {
        if (!slug.value) return;
    
        error.value = false;
        loading.value = true;

        try {
            const data = await $fetch<PolymarketApiResponse>(`/api/polymarket?slug=${slug.value}`);
            markets.value.push({
                title: data.title,
                image: data.image,
                endDate: new Date(data.endDate),
                volume: data.volume,
                markets: data.markets.filter(m => !m.closed).map(m => ({
                    title: m.groupItemTitle,
                    volume: m.volume,
                    outcomePrices: JSON.parse(m.outcomePrices)
                })),
                open: false
            });
        } catch(e) {
            error.value = true;
        } finally {
            loading.value = false;
        }
    }
</script>