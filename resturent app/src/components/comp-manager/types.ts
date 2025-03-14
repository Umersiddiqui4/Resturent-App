export interface Dish {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  displayOrder: number
}

export interface DishCardProps {
  dish: Dish
  onEdit?: () => void
  onDelete?: () => void
  onToggleWishlist?: (dishId: number) => void
  isInWishlist?: boolean
  onAddToCart?: (dishId: number) => void
  isInCart?: number
  userRole?: "owner" | "user" | "guest"
}

export interface DishListProps extends Omit<DishCardProps, "dish"> {
  dish: Dish
}

