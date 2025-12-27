"use client"

import { ExternalLink, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PriceResult } from "@/lib/actions"

interface StoreCardProps extends PriceResult {
  isBestValue?: boolean
}

const storeColors: Record<string, { bg: string; border: string }> = {
  Amazon: { bg: "bg-amber-50", border: "border-amber-200" },
  Flipkart: { bg: "bg-blue-50", border: "border-blue-200" },
  Shopsy: { bg: "bg-fuchsia-50", border: "border-fuchsia-200" },
  Meesho: { bg: "bg-rose-50", border: "border-rose-200" },
}

export function StoreCard({
  store,
  storeLogo,
  productImage,
  productTitle,
  price,
  productUrl,
  isBestValue,
}: StoreCardProps) {
  const isAvailable = price > 0
  const colors = storeColors[store] || { bg: "bg-gray-50", border: "border-gray-200" }

  return (
    <div
      className={`relative rounded-xl border ${colors.border} ${colors.bg} overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${isBestValue ? "ring-2 ring-green-500 ring-offset-2" : ""}`}
    >
      {/* Best Value Badge */}
      {isBestValue && isAvailable && (
        <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
          <Crown className="w-3 h-3" />
          Best
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg border border-border p-1.5">
            <img src={storeLogo || "/placeholder.svg"} alt={store} className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold">{store}</span>
        </div>
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-white flex items-center justify-center p-6">
        <img
          src={productImage || "/placeholder.svg"}
          alt={productTitle}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-4 bg-card border-t border-border/50">
        <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">{productTitle}</h3>

        {/* Price */}
        <div>
          {isAvailable ? (
            <span className="text-2xl font-bold text-green-600">₹{price.toLocaleString("en-IN")}</span>
          ) : (
            <span className="text-sm text-muted-foreground">Price not indexed</span>
          )}
        </div>

        <Button className="w-full rounded-lg font-medium" onClick={() => window.open(productUrl, "_blank")}>
          {isAvailable ? "Visit Store" : "Search"}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
