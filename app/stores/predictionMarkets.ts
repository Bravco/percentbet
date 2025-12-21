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
                        markets: polymarketData.markets.filter(pm => !pm.closed).map((pm, i) => ({
                            index: i,
                            title: pm.groupItemTitle,
                            volume: pm.volume,
                            chance: JSON.parse(pm.outcomePrices)[0]
                        })),
                        selected: false,
                        analysis: m.analysis
                    };
                    predictionMarkets.value.push(market);
                } catch {
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