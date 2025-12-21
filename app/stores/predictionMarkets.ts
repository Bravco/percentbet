import { collection, doc, getDocs, addDoc, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore";


export const usePredictionMarkets = defineStore("predictionMarkets", () => {
    const firestore = useFirestore();
    const user = useCurrentUser();
    const toast = useToast();

    const predictionMarkets = ref<PredictionMarket[]>([]);
    const fetchingMarkets = ref<boolean>(false);

    const predictionMarketsRef = computed(() => {
        if (!user.value?.uid) return null;
        return collection(firestore, "users", user.value.uid, "predictionMarkets");
    });

    const normalizePolymarketMarkets = (markets: PolymarketApiMarket[]) => {
        if (!markets.length) return [];

        if (markets.length === 1) {
            const market = markets[0];
            if (!market) return [];

            const outcomes: string[] = JSON.parse(market.outcomes);
            const outcomePrices: number[] = JSON.parse(market.outcomePrices).map(Number);

            return outcomes.map((title, index) => ({
                index,
                title,
                chance: outcomePrices[index] ?? 0
            }));
        }

        return markets.map((market, index) => {
            const outcomePrices: number[] = JSON.parse(market.outcomePrices).map(Number);
            return {
                index,
                title: market.groupItemTitle,
                volume: market.volume,
                chance: outcomePrices[0] ?? 0
            }
        });
    };

    const fetchMarkets = async () => {
        if (!predictionMarketsRef.value) return;
        fetchingMarkets.value = true;
        try {
            const q = query(predictionMarketsRef.value, orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const storedMarkets = snapshot.docs.map(doc => doc.data());

            predictionMarkets.value = [];
            for (const m of storedMarkets) {
                try {
                    const polymarketData = await $fetch<PolymarketApiResponse>(`/api/polymarket?slug=${m.slug}`);
                    const market: PredictionMarket = {
                        createdAt: m.createdAt.toDate(),
                        slug: m.slug,
                        title: polymarketData.title,
                        image: polymarketData.image,
                        endDate: new Date(polymarketData.endDate),
                        volume: polymarketData.volume,
                        closed: polymarketData.closed,
                        markets: normalizePolymarketMarkets(polymarketData.markets.filter(pm => !pm.closed)),
                        selected: false,
                        analysis: m.analysis
                    };
                    predictionMarkets.value.push(market);
                } catch (e) {
                    console.error(e);
                    toast.add({ title: `Failed to fetch Polymarket data for ${m.slug}`, color: "warning" });
                }
            }
        } catch {
            toast.add({ title: "Failed to load past analysis.", color: "error" });
        } finally {
            fetchingMarkets.value = false;
        }
    };

    const addMarket = async (slug: string) => {
        if (!slug) return;

        try {
            const polymarketData = await $fetch<PolymarketApiResponse>(`/api/polymarket?slug=${slug}`);
            const market: PredictionMarket = {
                createdAt: new Date(),
                slug: slug,
                title: polymarketData.title,
                image: polymarketData.image,
                endDate: new Date(polymarketData.endDate),
                volume: polymarketData.volume,
                closed: polymarketData.closed,
                markets: normalizePolymarketMarkets(polymarketData.markets.filter(m => !m.closed)),
                selected: true
            };

            let doAnalysis = true;
            market.markets.forEach(m => {
                if (m.chance >= 0.98) {
                    doAnalysis = false;
                    market.analysis = {
                        index: m.index,
                        confidence: 95
                    };
                }
            });

            if (doAnalysis) {
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
            }

            saveMarket(market);
            predictionMarkets.value.forEach(pm => pm.selected = false);
            predictionMarkets.value.unshift(market);
        } catch (error) {
            throw error;
        }
    };

    const saveMarket = async (market: PredictionMarket) => {
        if (!predictionMarketsRef.value) return;

        try {
            await addDoc(predictionMarketsRef.value, {
                createdAt: serverTimestamp(),
                slug: market.slug,
                analysis: market.analysis
            });
        } catch {
            toast.add({ title: "Failed to save analysis.", color: "error" });
        }
    };

    const deleteMarket = async (slug: string) => {
        predictionMarkets.value = predictionMarkets.value.filter(m => m.slug !== slug);

        if (!predictionMarketsRef.value) return;

        try {
            const snapshot = await getDocs(predictionMarketsRef.value);
            const docToDelete = snapshot.docs.find(doc => doc.data().slug === slug);
            if (!docToDelete) throw new Error("Document not found");
            await deleteDoc(doc(firestore, "users", user.value!.uid, "predictionMarkets", docToDelete.id));
        } catch (error) {
            console.error(error);
        }
    };

    return {
        predictionMarkets,
        fetchingMarkets,
        fetchMarkets,
        addMarket,
        deleteMarket
    };
});