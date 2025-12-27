"use client"

import type React from "react"
import { useState } from "react"
import { Search, Loader2, TrendingDown, TrendingUp, ArrowRight, LayoutList, LayoutGrid, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PriceListItem } from "@/components/price-list-item"
import { PriceListSkeleton } from "@/components/price-list-skeleton"
import { StoreCard } from "@/components/store-card"
import { searchPrices, type PriceResult } from "@/lib/actions"

type SortOption = "price-low" | "price-high"
type ViewMode = "list" | "grid"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<PriceResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("price-low")
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setResults(null)
    setError(null)

    try {
      const productName = extractProductName(searchQuery)
      const prices = await searchPrices(productName)
      setResults(prices)
    } catch (error) {
      console.error("Error fetching prices:", error)
      setError("Failed to fetch prices. Please check your API key configuration.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const sortedResults = results
    ? [...results]
        .filter((r) => r.price > 0)
        .sort((a, b) => {
          if (sortBy === "price-low") return a.price - b.price
          if (sortBy === "price-high") return b.price - a.price
          return 0
        })
    : null

  const lowestPrice = sortedResults && sortedResults.length > 0 ? sortedResults[0].price : 0
  const availableCount = sortedResults?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50/50 to-cyan-50 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Large bubbles */}
        <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-emerald-200/40 to-teal-300/30 blur-xl animate-bubble" />
        <div className="absolute top-40 right-[15%] w-96 h-96 rounded-full bg-gradient-to-br from-cyan-200/40 to-blue-300/30 blur-xl animate-bubble-slow" />
        <div
          className="absolute bottom-32 left-[20%] w-80 h-80 rounded-full bg-gradient-to-br from-teal-200/40 to-emerald-300/30 blur-xl animate-bubble"
          style={{ animationDelay: "2s" }}
        />

        {/* Medium bubbles */}
        <div className="absolute top-[30%] left-[5%] w-40 h-40 rounded-full bg-gradient-to-br from-emerald-300/50 to-teal-400/40 blur-lg animate-bubble-fast" />
        <div
          className="absolute top-[20%] right-[8%] w-32 h-32 rounded-full bg-gradient-to-br from-cyan-300/50 to-emerald-400/40 blur-lg animate-bubble"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-[40%] right-[25%] w-48 h-48 rounded-full bg-gradient-to-br from-teal-300/50 to-cyan-400/40 blur-lg animate-bubble-slow"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute bottom-20 right-[10%] w-36 h-36 rounded-full bg-gradient-to-br from-emerald-300/50 to-cyan-400/40 blur-lg animate-bubble-fast"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Small bubbles */}
        <div
          className="absolute top-[15%] left-[30%] w-20 h-20 rounded-full bg-gradient-to-br from-teal-400/60 to-emerald-500/50 blur-md animate-bubble-fast"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-[50%] left-[8%] w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/60 to-teal-500/50 blur-md animate-bubble"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="absolute top-[60%] right-[5%] w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400/60 to-cyan-500/50 blur-md animate-bubble-slow"
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className="absolute bottom-[25%] left-[40%] w-14 h-14 rounded-full bg-gradient-to-br from-teal-400/60 to-blue-500/50 blur-md animate-bubble-fast"
          style={{ animationDelay: "3.5s" }}
        />
        <div
          className="absolute top-[75%] left-[60%] w-18 h-18 rounded-full bg-gradient-to-br from-cyan-400/60 to-emerald-500/50 blur-md animate-bubble"
          style={{ animationDelay: "1.2s" }}
        />

        {/* Tiny accent bubbles */}
        <div
          className="absolute top-[10%] right-[40%] w-8 h-8 rounded-full bg-emerald-400/70 blur-sm animate-bubble-fast"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="absolute top-[35%] right-[30%] w-10 h-10 rounded-full bg-cyan-400/70 blur-sm animate-bubble"
          style={{ animationDelay: "2.8s" }}
        />
        <div
          className="absolute bottom-[15%] left-[50%] w-12 h-12 rounded-full bg-teal-400/70 blur-sm animate-bubble-slow"
          style={{ animationDelay: "1.8s" }}
        />
        <div
          className="absolute top-[45%] left-[45%] w-6 h-6 rounded-full bg-emerald-500/70 blur-sm animate-bubble-fast"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 via-transparent to-cyan-100/40" />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 border border-emerald-200 animate-fade-up">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Smart Price Comparison</span>
            </div>

            {/* Main heading */}
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              Find the best price
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                in seconds
              </span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Compare prices across Amazon, Flipkart, Shopsy & Meesho instantly
            </p>

            {/* Search box */}
            <div className="max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-emerald-500/10 border border-emerald-100">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Paste product link or search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12 h-14 text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isLoading || !searchQuery.trim()}
                  className="h-14 px-8 rounded-xl font-semibold text-base bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02]"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      Compare Prices
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-fade-in">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {(isLoading || results) && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <PriceListSkeleton />
            ) : sortedResults && sortedResults.length > 0 ? (
              <div className="animate-fade-up">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Price Comparison</h2>
                    <p className="text-muted-foreground">
                      Found {availableCount} result{availableCount !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-emerald-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={`rounded-md px-3 ${viewMode === "list" ? "bg-white shadow-sm text-emerald-600" : ""}`}
                      >
                        <LayoutList className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={`rounded-md px-3 ${viewMode === "grid" ? "bg-white shadow-sm text-emerald-600" : ""}`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Sort Dropdown */}
                    <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                      <SelectTrigger className="w-44 bg-white/60 backdrop-blur-sm border-emerald-100 rounded-lg">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg">
                        <SelectItem value="price-low">
                          <span className="flex items-center gap-2">
                            <TrendingDown className="w-4 h-4 text-emerald-600" />
                            Low to High
                          </span>
                        </SelectItem>
                        <SelectItem value="price-high">
                          <span className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-cyan-600" />
                            High to Low
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {viewMode === "list" ? (
                  <div className="space-y-3">
                    {sortedResults.map((result, index) => (
                      <div key={result.store} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <PriceListItem {...result} isBestValue={result.price === lowestPrice} rank={index + 1} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedResults.map((result, index) => (
                      <div key={result.store} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <StoreCard {...result} isBestValue={result.price === lowestPrice} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-fade-up">
                <div className="text-center py-8 mb-6">
                  <p className="text-lg text-muted-foreground mb-2">No exact matches found</p>
                  <p className="text-sm text-muted-foreground">Search directly on these stores:</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results?.map((result, index) => (
                    <a
                      key={result.store}
                      href={result.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 p-2 flex items-center justify-center">
                        <img
                          src={result.storeLogo || "/placeholder.svg"}
                          alt={result.store}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{result.store}</p>
                        <p className="text-sm text-muted-foreground">Click to search</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* How it works - only show when no results */}
      {!results && !isLoading && (
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
              <p className="text-muted-foreground text-lg">Three simple steps to save money</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Search",
                  desc: "Enter a product name or paste a link",
                  icon: Search,
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  step: "2",
                  title: "Compare",
                  desc: "We scan 4 major Indian stores instantly",
                  icon: Sparkles,
                  color: "from-teal-500 to-cyan-500",
                },
                {
                  step: "3",
                  title: "Save",
                  desc: "Find the best price and buy smart",
                  icon: TrendingDown,
                  color: "from-cyan-500 to-blue-500",
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className="text-center animate-fade-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} text-white mb-6 shadow-lg`}
                  >
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-emerald-100 mt-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                SmartPrice India
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Your smart shopping companion</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function extractProductName(query: string): string {
  try {
    if (query.includes("amazon.") || query.includes("flipkart.")) {
      const url = new URL(query.startsWith("http") ? query : `https://${query}`)
      const pathname = url.pathname

      if (pathname.includes("/dp/")) {
        const parts = pathname.split("/")
        const productPart = parts.find(
          (part) => part.length > 0 && !part.includes("dp") && part !== "gp" && part !== "product",
        )
        if (productPart) {
          return decodeURIComponent(productPart).replace(/-/g, " ")
        }
      }

      if (pathname.includes("/p/")) {
        const parts = pathname.split("/")
        const productPart = parts[1]
        if (productPart) {
          return decodeURIComponent(productPart).replace(/-/g, " ")
        }
      }
    }
  } catch (e) {
    // If URL parsing fails, treat it as a regular search query
  }

  return query
}
