interface PolymarketApiMarket {
    active: boolean;
    closed: boolean;
    groupItemTitle: string;
    volume: number;
    outcomes: string;
    outcomePrices: string;
}

interface PolymarketApiResponse {
    title: string;
    description: string;
    image: string;
    endDate: string;
    volume: number;
    closed: boolean;
    markets: PolymarketApiMarket[];
}

interface MarketAnalysis {
    index: number;
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
        index: number;
        title: string;
        volume?: number | undefined;
        chance: number; // 0-1
    }[];
    selected: boolean;
    analysis?: MarketAnalysis;
}