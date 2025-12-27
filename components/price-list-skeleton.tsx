export function PriceListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 rounded-xl border border-border bg-card animate-pulse"
        >
          {/* Rank skeleton */}
          <div className="hidden sm:block w-8 h-8 rounded-full bg-muted" />

          {/* Logo skeleton */}
          <div className="w-12 h-12 rounded-lg bg-muted" />

          {/* Image skeleton */}
          <div className="w-16 h-16 rounded-lg bg-muted" />

          {/* Content skeleton */}
          <div className="flex-grow space-y-2">
            <div className="h-5 w-24 bg-muted rounded" />
            <div className="h-4 w-48 bg-muted rounded" />
          </div>

          {/* Price skeleton */}
          <div className="space-y-1 text-right">
            <div className="h-7 w-28 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded ml-auto" />
          </div>

          {/* Button skeleton */}
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-muted rounded-lg" />
            <div className="h-10 w-24 bg-muted rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}
