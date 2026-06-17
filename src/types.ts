export type Vehicle = {
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

export type InventoryData = {
  source: string
  sourceLabel: string
  fetchedAt: string
  status: 'partial' | 'complete'
  note: string
  vehicles: Vehicle[]
}
