'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, Brain, ChevronRight, ExternalLink ,Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from 'next/image'
import Link from "next/link"
import { comprehensiveSearch } from '@/lib/api'
import { EnhancedSearchResult} from '@/types/search'
import ContactFormDialog from "@/components/Contact"
import { Alert, AlertDescription } from '@/components/ui/alert'
interface SearchSummaryProps {
    summary: string;
}

const SearchSummary: React.FC<SearchSummaryProps> = ({ summary }) => {
    const sections = summary.split('**').filter(Boolean)

    return (
        <div className="space-y-4">
            {sections.map((section, index) => {
                const isHeading = index % 2 === 0

                if (isHeading) {
                    return (
                        <div key={index} className="border-l-4 border-blue-400 pl-4">
                            <h3 className="text-lg font-semibold text-blue-200">
                                {section.replace(/:/g, '')}
                            </h3>
                        </div>
                    )
                }

                return (
                    <p key={index} className="text-gray-300 leading-relaxed pl-6">
                        {section.trim().replace(/\*/g, '')}
                    </p>
                )
            })}
        </div>
    )
}

export default function SearchInterface() {
    const [query, setQuery] = useState<string>('')
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<'summary' | 'web' | 'images'>('summary')
    const [searchResults, setSearchResults] = useState<EnhancedSearchResult | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setIsSearching(true)
        try {
            const results = await comprehensiveSearch(query)
            setSearchResults(results)
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setIsSearching(false)
        }
    }

    const NoticeBanner = () => {
        const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {
            // Check if user has seen the banner before
            const hasSeenBanner = localStorage.getItem('hasSeeNewBanner1');

            if (!hasSeenBanner) {
                // Show banner for first-time visitors
                setIsVisible(true);

                // Set flag in localStorage
                localStorage.setItem('hasSeenNewBanner1', 'true');

                // Hide banner after 20 seconds
                const timer = setTimeout(() => {
                    setIsVisible(false);
                }, 20000);

                return () => clearTimeout(timer);
            }
        }, []);

        return (
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Alert variant="destructive" className="w-3/2 flex justify-center bg-amber-50/10 border-amber-200/20 mb-6 mx-4">
                            <Info className="h-4 w-4 text-amber-400" />
                            <div className="flex flex-col">
                            <AlertDescription className="text-amber-200">
                               Thanks for 2k+ Weekly Searches Please share it Let it hit more audience  
                            </AlertDescription>
                            <AlertDescription className=" text-sm w-3/2 m-5 md:w-full relative px-5 py-5 font-bold bg-amber-50 text-blue-500 rounded flex justify-center items-center content-center">
                                Now updated 🚀 answering real time questions like "What time is it now in kigali " and many others keep asking for features using that contact us
                            </AlertDescription>
                            </div>
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };


    const renderWelcomeState = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 max-w-2xl mx-auto mt-8 sm:mt-12 md:mt-20 px-4"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card className="bg-blue-900/20 border border-blue-500/20 p-4 sm:p-6 backdrop-blur-sm">
                    <div className="space-y-3">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                            <Sparkles className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-blue-200 font-medium">Lightning Fast</h3>
                        <p className="text-gray-400 text-sm">Results in milliseconds with our advanced algorithms</p>
                    </div>
                </Card>
                <Card className="bg-blue-900/20 border border-blue-500/20 p-4 sm:p-6 backdrop-blur-sm">
                    <div className="space-y-3">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                            <ExternalLink className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-blue-200 font-medium">Global Reach</h3>
                        <p className="text-gray-400 text-sm">Access information from across the globe instantly</p>
                    </div>
                </Card>
                <Card className="bg-blue-900/20 border border-blue-500/20 p-4 sm:p-6 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                    <div className="space-y-3">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                            <Brain className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-blue-200 font-medium">Smart Search</h3>
                        <p className="text-gray-400 text-sm">AI-powered results that understand your intent</p>
                    </div>
                </Card>
            </div>
        </motion.div>
    )

    const renderSummaryTab = () => (
        <div className="flex flex-col lg:flex-row gap-4 px-4">
            <div className="w-full lg:w-1/3 space-y-4">
                {searchResults?.imageResults.slice(0, 2).map((image, index) => (
                    <Card key={index} className="bg-blue-900/20 border border-blue-500/20 overflow-hidden backdrop-blur-sm">
                        <div className="p-4">
                            <Link href={image.link} target="_blank" rel="noopener noreferrer">
                            <div className="aspect-video relative rounded-lg overflow-hidden mb-2">
                                <Image
                                    src={image.thumbnailUrl}
                                    alt={image.title}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            </Link>
                            <h3 className="text-sm font-medium text-blue-300">{image.title}</h3>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="w-full lg:w-2/3">
                {searchResults?.aiSummary && (
                    <Card className="bg-blue-900/20 border border-blue-500/20 overflow-hidden backdrop-blur-sm h-full">
                        <div className="p-4 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <Avatar className="h-8 w-8 bg-blue-600">
                                    <Brain className="h-5 w-5" />
                                </Avatar>
                                <div className="font-medium text-blue-100">AI Analysis</div>
                            </div>
                            <SearchSummary summary={searchResults.aiSummary} />
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )

    const renderWebTab = () => (
        <div className="space-y-4 px-4">
            {searchResults?.textResults.map((result, index) => (
                <Card
                    key={index}
                    className="bg-blue-900/20 border border-blue-500/20 overflow-hidden backdrop-blur-sm hover:bg-blue-900/30 transition-colors"
                >
                    <div className="p-4 flex gap-4">
                        <div className="flex-1 min-w-0">
                            <Link
                                href={result.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <h2 className="text-lg font-medium text-blue-300 mb-2 flex items-center gap-2 truncate group-hover:text-blue-200">
                                    {result.title}
                                    <ExternalLink className="h-4 w-4 text-blue-400 shrink-0" />
                                </h2>
                                <p className="text-gray-300 text-sm line-clamp-2">{result.snippet}</p>
                            </Link>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )

    const renderImagesTab = () => (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
            {searchResults?.imageResults.map((image, index) => (
                <Card key={index} className="bg-blue-900/20 border border-blue-500/20 overflow-hidden backdrop-blur-sm">
                    <a href={image.link} target="_blank" rel="noopener noreferrer" className="block p-2 group">
                        <div className="aspect-square relative rounded-lg overflow-hidden mb-2">
                            <Image
                                src={image.thumbnailUrl}
                                alt={image.title}
                                layout="fill"
                                objectFit="cover"
                                className="group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h3 className="text-xs font-medium text-blue-300 truncate group-hover:text-blue-200">
                            {image.title}
                        </h3>
                    </a>
                </Card>
            ))}
        </div>
    )

    return (
        <div className="min-h-screen flex flex-col relative">
            <div className="absolute top-10 right-4 z-10">
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto pb-32">
                {NoticeBanner()}
                {searchResults && (
                    <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a0118] to-transparent pb-4">
                        <div className="flex gap-2 overflow-x-auto px-4 py-4">
                            {['summary', 'web', 'images'].map((tab) => (
                                <Button
                                    key={tab}
                                    variant={activeTab === tab ? "default" : "ghost"}
                                    onClick={() => setActiveTab(tab as 'summary' | 'web' | 'images')}
                                    className={`${
                                        activeTab === tab
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'hover:bg-blue-900/50'
                                    } font-medium capitalize whitespace-nowrap`}
                                >
                                    {tab}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {isSearching ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="px-4"
                        >
                            <Skeleton className="h-32 w-full bg-blue-800/50 rounded-lg mb-4" />
                            <Skeleton className="h-24 w-full bg-blue-800/50 rounded-lg mb-4" />
                            <Skeleton className="h-24 w-full bg-blue-800/50 rounded-lg" />
                        </motion.div>
                    ) : searchResults ? (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {activeTab === 'summary' && renderSummaryTab()}
                            {activeTab === 'web' && renderWebTab()}
                            {activeTab === 'images' && renderImagesTab()}
                        </motion.div>
                    ) : (
                        renderWelcomeState()
                    )}
                </AnimatePresence>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a0118] to-transparent pt-24">
                <div className="max-w-2xl mx-auto px-4">
                    <form onSubmit={handleSearch} className="relative">
                        <Input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter your search query..."
                            className="w-full bg-blue-900/20 border-blue-500/20 backdrop-blur-sm text-white placeholder:text-blue-300 pl-12 pr-12 py-4 sm:py-6 text-base sm:text-lg rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSearching}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
                        >
                            {isSearching ? (
                                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                            ) : (
                                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
