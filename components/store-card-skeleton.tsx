import { Card, CardContent } from "@/components/ui/card"

export function StoreCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Store Header Skeleton */}
        <div className="h-14 bg-muted animate-pulse" />

        {/* Product Image Skeleton */}
        <div className="aspect-square bg-muted/50 animate-pulse" />

        {/* Product Info Skeleton */}
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
          </div>

          <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />

          <div className="h-10 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
