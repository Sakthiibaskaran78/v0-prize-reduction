"use server"

export interface PriceResult {
  store: string
  storeLogo: string
  productImage: string
  productTitle: string
  price: number
  productUrl: string
  storeColor: string
  originalPrice?: number
  discount?: number
  isPriceDrop?: boolean
  isAvailable: boolean
}

const STORE_CONFIGS = {
  Amazon: {
    logo: "https://img.logo.dev/amazon.in?token=pk_demo",
    color: "#FF9900",
    domain: "amazon.in",
    keywords: ["amazon.in", "amazon.com", "amazon"],
    searchUrl: (q: string) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
  },
  Flipkart: {
    logo: "https://img.logo.dev/flipkart.com?token=pk_demo",
    color: "#2874F0",
    domain: "flipkart.com",
    keywords: ["flipkart.com", "flipkart"],
    searchUrl: (q: string) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
  },
  Shopsy: {
    logo: "https://img.logo.dev/shopsy.in?token=pk_demo",
    color: "#E84D8A",
    domain: "shopsy.in",
    keywords: ["shopsy.in", "shopsy"],
    searchUrl: (q: string) => `https://www.shopsy.in/search?q=${encodeURIComponent(q)}`,
  },
  Meesho: {
    logo: "https://img.logo.dev/meesho.com?token=pk_demo",
    color: "#9C1A8C",
    domain: "meesho.com",
    keywords: ["meesho.com", "meesho"],
    searchUrl: (q: string) => `https://www.meesho.com/search?q=${encodeURIComponent(q)}`,
  },
}

export async function searchPrices(query: string): Promise<PriceResult[]> {
  const apiKey = process.env.RAPIDAPI_KEY

  if (!apiKey) {
    throw new Error("API key not configured. Please add RAPIDAPI_KEY to your environment variables.")
  }

  try {
    const response = await fetch(
      `https://real-time-product-search.p.rapidapi.com/search-v2?q=${encodeURIComponent(query)}&country=in&language=en&limit=50&sort_by=BEST_MATCH`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "real-time-product-search.p.rapidapi.com",
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] API Error:", response.status, errorText)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    const products = data.data?.products || []

    console.log("[v0] API returned", products.length, "products")

    const results: PriceResult[] = []

    for (const [storeName, config] of Object.entries(STORE_CONFIGS)) {
      // Find a product matching this store
      const storeProduct = products.find((p: any) => {
        const link = (p.product_link || p.offer?.offer_page_url || "").toLowerCase()
        const title = (p.product_title || "").toLowerCase()
        return config.keywords.some((keyword) => link.includes(keyword) || title.includes(keyword))
      })

      if (storeProduct) {
        const { price, originalPrice } = extractPrice(storeProduct)
        const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

        console.log("[v0]", storeName, "found with price:", price)

        results.push({
          store: storeName,
          storeLogo: config.logo,
          productImage:
            storeProduct.product_photos?.[0] || storeProduct.product_photo || "/diverse-products-still-life.png",
          productTitle: storeProduct.product_title || query,
          price: price,
          originalPrice: originalPrice > 0 ? originalPrice : undefined,
          discount: discount > 0 ? discount : undefined,
          isPriceDrop: false,
          isAvailable: price > 0,
          productUrl: storeProduct.product_link || storeProduct.offer?.offer_page_url || config.searchUrl(query),
          storeColor: config.color,
        })
      } else {
        results.push({
          store: storeName,
          storeLogo: config.logo,
          productImage: "",
          productTitle: query,
          price: 0,
          productUrl: config.searchUrl(query),
          storeColor: config.color,
          isPriceDrop: false,
          isAvailable: false,
        })
      }
    }

    if (results.every((r) => !r.isAvailable) && products.length > 0) {
      console.log("[v0] No store matches found, using top API results")

      // Take up to 4 best results from the API
      const topProducts = products.slice(0, 4)
      const genericResults: PriceResult[] = []

      for (const product of topProducts) {
        const { price, originalPrice } = extractPrice(product)
        if (price > 0) {
          const link = (product.product_link || "").toLowerCase()
          let storeName = "Online Store"
          let storeConfig = STORE_CONFIGS.Amazon // Default

          // Try to identify the store
          for (const [name, config] of Object.entries(STORE_CONFIGS)) {
            if (config.keywords.some((k) => link.includes(k))) {
              storeName = name
              storeConfig = config
              break
            }
          }

          // Extract store from URL if not matched
          if (storeName === "Online Store") {
            try {
              const url = new URL(product.product_link)
              storeName = url.hostname.replace("www.", "").split(".")[0]
              storeName = storeName.charAt(0).toUpperCase() + storeName.slice(1)
            } catch {}
          }

          genericResults.push({
            store: storeName,
            storeLogo: storeConfig.logo,
            productImage: product.product_photos?.[0] || product.product_photo || "/diverse-products-still-life.png",
            productTitle: product.product_title || query,
            price: price,
            originalPrice: originalPrice > 0 ? originalPrice : undefined,
            discount: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined,
            isPriceDrop: false,
            isAvailable: true,
            productUrl: product.product_link || product.offer?.offer_page_url || "#",
            storeColor: storeConfig.color,
          })
        }
      }

      if (genericResults.length > 0) {
        return genericResults.sort((a, b) => a.price - b.price)
      }
    }

    // Calculate average price for price drop detection
    const validPrices = results.filter((r) => r.price > 0).map((r) => r.price)
    const averagePrice = validPrices.length > 0 ? validPrices.reduce((a, b) => a + b, 0) / validPrices.length : 0

    // Mark price drops
    results.forEach((result) => {
      if (result.price > 0 && result.price < averagePrice * 0.9) {
        result.isPriceDrop = true
      }
    })

    // Sort by price (lowest first), unavailable items at the end
    return results.sort((a, b) => {
      if (!a.isAvailable) return 1
      if (!b.isAvailable) return -1
      return a.price - b.price
    })
  } catch (error) {
    console.error("[v0] Error in searchPrices:", error)
    throw error
  }
}

function extractPrice(product: any): { price: number; originalPrice: number } {
  let price = 0
  let originalPrice = 0

  const priceFields = [
    product.offer?.price,
    product.price?.extracted_value,
    product.price?.value,
    product.typical_price_range?.[0],
    product.product_price,
    product.product_attributes?.price,
  ]

  for (const field of priceFields) {
    if (field && price === 0) {
      const priceStr = String(field).replace(/[₹$,\s]/g, "")
      const parsed = Number.parseFloat(priceStr)
      if (!isNaN(parsed) && parsed > 0) {
        price = Math.round(parsed)
      }
    }
  }

  const originalFields = [
    product.offer?.original_price,
    product.typical_price_range?.[1],
    product.product_attributes?.original_price,
  ]

  for (const field of originalFields) {
    if (field && originalPrice === 0) {
      const priceStr = String(field).replace(/[₹$,\s]/g, "")
      const parsed = Number.parseFloat(priceStr)
      if (!isNaN(parsed) && parsed > price) {
        originalPrice = Math.round(parsed)
      }
    }
  }

  return { price, originalPrice }
}
