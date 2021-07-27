export interface Recommendation {
    name: string;
    youtubeLink: string;
}

export interface RecommendationScore extends Recommendation {
    score: number;
}
