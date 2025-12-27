"use client"

import { ExternalLink, Crown, TrendingDown, Share2, Check, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { PriceResult } from "@/lib/actions"
import { useState } from "react"

interface PriceListItemProps extends PriceResult {
  isBestValue?: boolean
  rank: number
}

const storeColors: Record<string, { bg: string; border: string; badge: string }> = {
  Amazon: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700" },
  Flipkart: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
  Shopsy: { bg: "bg-fuchsia-50", border: "border-fuchsia-200", badge: "bg-fuchsia-100 text-fuchsia-700" },
  Meesho: { bg: "bg-rose-50", border: "border-rose-200", badge: "bg-rose-100 text-rose-700" },
}

export function PriceListItem({
  store,
  storeLogo,
  productImage,
  productTitle,
  price,
  originalPrice,
  discount,
  isPriceDrop,
  isAvailable,
  productUrl,
  isBestValue,
  rank,
}: PriceListItemProps) {
  const [copied, setCopied] = useState(false)
  const colors = storeColors[store] || {
    bg: "bg-gray-50",
    border: "border-gray-200",
    badge: "bg-gray-100 text-gray-700",
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div
      className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 rounded-xl border ${colors.border} ${colors.bg} transition-all duration-200 hover:shadow-md ${isBestValue ? "ring-2 ring-green-500 ring-offset-2" : ""}`}
    >
      {/* Best Value Badge */}
      {isBestValue && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
          <Crown className="w-3 h-3" />
          Best Price
        </div>
      )}

      {/* Rank */}
      <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-foreground/5 text-foreground/60 text-sm font-semibold">
        {rank}
      </div>

      {/* Store Logo */}
      <div className="w-12 h-12 rounded-lg bg-white border border-border p-2 flex-shrink-0">
        <img src={storeLogo || "/placeholder.svg"} alt={store} className="w-full h-full object-contain" />
      </div>

      {/* Product Image */}
      <div className="w-16 h-16 rounded-lg bg-white border border-border p-2 flex-shrink-0">
        {isAvailable && productImage ? (
          <img src={productImage || "/placeholder.svg"} alt={productTitle} className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Search className="w-6 h-6 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-grow min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-semibold">{store}</span>
          {isAvailable && isPriceDrop && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              <TrendingDown className="w-3 h-3 mr-1" />
              Price Drop
            </Badge>
          )}
          {!isAvailable && (
            <Badge variant="secondary" className="text-xs">
              Check Price
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {isAvailable ? productTitle : `Search on ${store}`}
        </p>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        {isAvailable ? (
          <>
            <div className="text-2xl font-bold text-green-600">₹{price.toLocaleString("en-IN")}</div>
            {originalPrice && (
              <div className="flex items-center gap-2 justify-end text-sm">
                <span className="text-muted-foreground line-through">₹{originalPrice.toLocaleString("en-IN")}</span>
                {discount && <span className="text-primary font-medium">{discount}% off</span>}
              </div>
            )}
          </>
        ) : (
          <span className="text-sm text-muted-foreground">Not indexed</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="h-10 w-10 rounded-lg hover:bg-foreground/5"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
        </Button>
        <Button className="rounded-lg font-medium" onClick={() => window.open(productUrl, "_blank")}>
          {isAvailable ? "Visit" : "Search"}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
