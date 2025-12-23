interface PolymarketApiMarket {
    id: string;
    active: boolean;
    closed: boolean;
    groupItemTitle: string;
    volume: number;
    outcomes: string;
    outcomePrices: string;
}

interface PolymarketApiResponse {
    id: string;
    slug: string;
    title: string;
    description: string;
    image: string;
    endDate: string;
    volume: number;
    closed: boolean;
    markets: PolymarketApiMarket[];
}

interface MarketAnalysis {
    marketId: string;
    confidence: number; // 0-100
}

interface PredictionMarket {
    createdAt: Date;
    slug: string;
    title: string;
    image: string;
    endDate: Date;
    volume: number;
    closed: boolean;
    markets: {
        id: string;
        title: string;
        volume?: number | undefined;
        chance: number; // 0-1
    }[];
    selected: boolean;
    analysis?: MarketAnalysis;
}