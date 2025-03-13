export interface Dish {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
}

export interface DishCardProps {
  dish: Dish
  onEdit: () => void
  onDelete: () => void
  onToggleWishlist?: (dishId: number) => void
  isInWishlist?: boolean
  onAddToCart?: (dishId: number) => void
  isInCart?: number
}

export interface DishListProps extends DishCardProps {}

