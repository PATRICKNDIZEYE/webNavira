export interface SearchResult {
    title: string;
    link: string;
    snippet: string;
    position: number;
    sitelinks?: { title: string; link: string }[];
    date?: string;
}

export interface ImageResult {
    url: string;
    title: string;
    imageUrl:string;
    link:string;
    thumbnailUrl:string;
    source: string;
}

export interface AnswerBox {
    title: string;
    answer: string;
}

export interface QueryAnalysis {
    searchType: 'website' | 'general';
    searchQuery: string;
}

export interface SearchResponse {
    answerBox?: AnswerBox;
    organic: SearchResult[];
    images?: ImageResult[];
    knowledge?: {};
    relatedSearches?: string[];
    peopleAlsoAsk?: { question: string; snippet: string; title: string; link: string }[];
}

export interface EnhancedSearchResult {
    textResults: SearchResult[];
    imageResults: ImageResult[];
    aiSummary: string | null;
    knowledgePanel?: {};
    relatedQueries?: string[];
    searchType: 'website' | 'general';
}
