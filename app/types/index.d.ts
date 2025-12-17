interface PolymarketApiResponse {
    title: string;
    description: string,
    image: string;
    endDate: string;
    volume: number;
    closed: boolean,
    markets: {
        closed: boolean,
        groupItemTitle: string;
        volume: number;
        outcomePrices: string;
    }[];
}

interface MarketAnalysis {
    index: number,
    confidence: number
}

interface PredictionMarket {
    title: string,
    image: string,
    endDate: Date,
    volume: number,
    closed: boolean,
    markets: {
        index: number,
        title: string,
        volume: number,
        chance: number
    }[],
    selected: boolean,
    analysis?: MarketAnalysis
}