'use server'

import axios from 'axios';
import { SearchResult, ImageResult, AnswerBox, EnhancedSearchResult, SearchResponse, QueryAnalysis } from '@/types/search';

const serpApi = axios.create({
    baseURL: 'https://google.serper.dev',
    timeout: 10000,
    headers: {
        'X-API-KEY': process.env.NEXT_PUBLIC_SERP_API_KEY || '',
        'Content-Type': 'application/json',
    },
});

const geminiApi = axios.create({
    baseURL: 'https://generativelanguage.googleapis.com/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

geminiApi.interceptors.request.use((config) => {
    config.params = {
        ...config.params,
        key: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
    };
    return config;
});

export async function analyzeQueryWithGemini(query: string): Promise<QueryAnalysis> {
    try {
        const response = await geminiApi.post('/models/gemini-pro:generateContent', {
            contents: [{
                parts: [{
                    text: `Analyze if this query is looking for a specific website/domain or is a general search.
                    Examples of website searches:
                    - "facebook.com"
                    - "amazon.com login"
                    - "strettch.com"
                    - "visit example.com"
                    
                    Original query: "${query}"
                    
                    Return a JSON object with exactly this format:
                    {
                        "searchType": "website" or "general",
                        "searchQuery": "the query to use"
                    }
                    
                    For website searches, preserve the exact domain/URL. For general searches, use the original query.`
                }]
            }],
            generationConfig: {
                temperature: 0.1,
                topK: 1,
                topP: 0.1,
                maxOutputTokens: 100,
            }
        });

        const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const analysisResult = JSON.parse(resultText);
        return {
            searchType: analysisResult.searchType,
            searchQuery: analysisResult.searchQuery || query
        };
    } catch (error) {
        console.error('Query analysis error:', error);
        return {
            searchType: 'general',
            searchQuery: query
        };
    }
}

export async function comprehensiveSearch(query: string): Promise<EnhancedSearchResult> {
    try {
        const analysis = await analyzeQueryWithGemini(query);

        const [webResults, imageResults] = await Promise.all([
            searchWeb(analysis.searchQuery),
            searchImages(analysis.searchQuery)
        ]);

        const aiSummary = webResults.organic?.length > 0
            ? await generateAISummary(query, analysis.searchType, webResults.organic, webResults.answerBox, webResults.relatedSearches, webResults.peopleAlsoAsk)
            : null;

        return {
            textResults: webResults.organic,
            imageResults: imageResults?.images || [],
            aiSummary,
            knowledgePanel: webResults.knowledge,
            relatedQueries: webResults.relatedSearches,
            searchType: analysis.searchType
        };
    } catch (error) {
        console.error('Comprehensive search error:', error);
        throw new Error(getErrorMessage(error));
    }
}

async function searchWeb(query: string): Promise<SearchResponse> {
    try {
        const response = await serpApi.post('/search', {
            q: query,
            num: 8,
            gl: 'rw',
            hl: 'en',
            type: 'search'
        });
        return response.data;
    } catch (error) {
        console.error('Web search error:', error);
        throw new Error(getErrorMessage(error));
    }
}

async function searchImages(query: string): Promise<SearchResponse> {
    try {
        const response = await serpApi.post('/images', {
            q: query,
            num: 8
        });
        return response.data;
    } catch (error) {
        console.error('Image search error:', error);
        throw new Error(getErrorMessage(error));
    }
}

async function generateAISummary(
    query: string,
    searchType: 'website' | 'general',
    results: SearchResult[],
    answerBox?: AnswerBox,
    relatedSearches?: string[],
    peopleAlsoAsk?: { question: string; snippet: string; title: string; link: string }[]
): Promise<string | null> {
    if (!results || results.length === 0) {
        console.warn('No results provided for AI summary generation.');
        return null;
    }

    try {
        const context = results
            .slice(0, 3)
            .map(r => r.snippet)
            .join('\n\n');

        const answerText = answerBox?.answer ? `Answer Box: ${answerBox.answer}\n\n` : '';
        const relatedSearchesText = relatedSearches?.length ? `Related Searches: ${relatedSearches.join(', ')}\n\n` : '';
        const peopleAlsoAskText = peopleAlsoAsk?.length
            ? `People Also Ask:\n${peopleAlsoAsk.map(p => `${p.question} - ${p.snippet}`).join('\n')}\n\n`
            : '';

        const promptTemplate = searchType === 'website'
            ? `This is a search for the website: "${query}"

Based on the search results and provided context, provide:

1. Key information about this website/platform
2. A clear description of what this website offers or its purpose

Context:
${answerText}${context}${relatedSearchesText}${peopleAlsoAskText}

Format the response with simple "Website Info" and "Description" headers for clean React rendering.`
            : `Based on these search results for "${query}", provide:

1. Key insights about the topic
2. A clear, comprehensive description that captures the main points

Context:
${answerText}${context}${relatedSearchesText}${peopleAlsoAskText}

Format the response with simple "Insights" and "Description" headers for clean React rendering.`;

        const response = await geminiApi.post('/models/gemini-pro:generateContent', {
            contents: [{
                parts: [{
                    text: promptTemplate
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 200,
            }
        });

        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (error) {
        console.error('AI summary generation error:', error);
        return null;
    }
}

function getErrorMessage(error: any): string {
    if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') return 'Request timed out';
        if (error.response?.status === 401) return 'Invalid API key';
        if (error.response?.status === 429) return 'Rate limit exceeded';
        return error.message;
    }
    return 'An unexpected error occurred';
}
