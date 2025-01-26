import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import axios from 'axios';
import { SearchResult, ImageResult } from '@/types/search';

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

interface SearchResponse {
  organic: SearchResult[];
  images?: ImageResult[];
  knowledge?: {};
  relatedSearches?: string[];
}


export interface EnhancedSearchResult {
  textResults: string;
  imageResults: ImageResult[];
  aiSummary: string | null;
  knowledgePanel?: {};
  relatedQueries?: string[];
}

export async function comprehensiveSearch(query: string): Promise<EnhancedSearchResult> {
  try {
    const [webResults, imageResults] = await Promise.all([
      searchWeb(query),
      searchImages(query)
    ]);

    const aiSummary = await generateAISummary(webResults.organic);

    return {
      textResults: formatMarkdownResults(webResults.organic),
      imageResults: imageResults?.images || [],
      aiSummary: aiSummary ? `**Summary**\n\n${aiSummary}` : null,
      knowledgePanel: webResults.knowledge,
      relatedQueries: webResults.relatedSearches
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
      gl: 'us',
      hl: 'en',
      type: 'search'
    });

    return response.data;
  } catch (error) {
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
    throw new Error(getErrorMessage(error));
  }
}

async function generateAISummary(results: any[]): Promise<string | null> {
  try {
    const context = results
        .slice(0, 3)
        .map(r => r.snippet)
        .join('\n\n');

    const response = await geminiApi.post('/models/gemini-pro:generateContent', {
      contents: [{
        parts: [{
          text: `Based on these search results, provide a concise, informative summary that answers the user's query. Context:\n${context}`
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

function formatMarkdownResults(results: SearchResult[]): string {
  return results.map((result) => {
    return `### ${result.title}\n\n[${result.link}](${result.link})\n\n${result.snippet}\n`;
  }).join('\n\n');
}

