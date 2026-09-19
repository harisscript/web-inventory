export interface Restaurant {
  id: string
  slug: string
  name: string
  cuisine: string
  description: string
  address: string
  city: string
  phone: string
  ownerName: string
  accentColor: string
  emoji: string
}

export type RestaurantAccessSummary = Pick<
  Restaurant,
  'id' | 'slug' | 'name' | 'cuisine' | 'city' | 'accentColor' | 'emoji'
>
