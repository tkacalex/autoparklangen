export type InventoryVehicle = {
  id: string
  title: string
  priceGross?: string
  priceNet?: string
  firstRegistration?: string
  mileage?: string
  power?: string
  fuel?: string
  category?: string
  imageUrl?: string
  detailUrl: string
}

const DETAIL_BASE_URL = 'https://suchen.mobile.de/fahrzeuge/details.html'

const stripTags = (value: string) =>
  decodeHtml(value.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()

const decodeHtml = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')

const unique = <T>(values: T[]) => Array.from(new Set(values))

export function parseMobileInventoryHtml(html: string): InventoryVehicle[] {
  if (/Zugriff verweigert|Access denied/i.test(html)) {
    return []
  }

  const cardMatches = html.matchAll(/<a\b[^>]*href=["']([^"']*details\.html\?id=(\d+)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)

  return unique(
    Array.from(cardMatches).map((match) => {
      const id = match[2]
      const body = match[3]
      const text = stripTags(body)
      const imageUrl = body.match(/<img\b[^>]*src=["']([^"']+)["']/i)?.[1]
      const title = stripTags(body.match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i)?.[1] ?? body.match(/alt=["']([^"']+)["']/i)?.[1] ?? '')
      const money = unique(text.match(/\d{1,3}(?:\.\d{3})*\s*€/g) ?? [])
      const firstRegistration = text.match(/\b(?:0[1-9]|1[0-2])\/20\d{2}\b/)?.[0]
      const mileage = text.match(/\d{1,3}(?:\.\d{3})*\s*km/i)?.[0]
      const power = text.match(/\d{2,3}\s*kW\s*\(\d{2,3}\s*PS\)/i)?.[0]
      const fuel = text.match(/\b(Diesel|Benzin|Elektro|Hybrid|Autogas|Erdgas)\b/i)?.[0]
      const category = text.match(/\b(Kastenwagen(?: hoch \+ lang)?|Transporter|Kombi|Kleinbus|Koffer|Kühlkastenwagen|Pick-up|Lkw)\b/i)?.[0]

      return {
        id,
        title,
        priceGross: money[0],
        priceNet: money.find((price) => text.includes(`${price} (Netto)`))
          ? `${money.find((price) => text.includes(`${price} (Netto)`))} (Netto)`
          : undefined,
        firstRegistration,
        mileage,
        power,
        fuel,
        category,
        imageUrl: imageUrl ? decodeHtml(imageUrl) : undefined,
        detailUrl: `${DETAIL_BASE_URL}?id=${id}`,
      }
    }),
  ).filter((vehicle) => vehicle.id && vehicle.title)
}
