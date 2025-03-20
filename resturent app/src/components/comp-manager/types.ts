export interface Dish {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  displayOrder: number;
  restaurent: string | undefined

  
}

// Update the DishCardProps interface to remove wishlist props
export interface DishCardProps {
  dish: Dish
  onEdit?: () => void
  onDelete?: () => void
  onAddToCart?: (dishId: number) => void
  isInCart?: number
  userRole?: "owner" | "user" | "guest"
  onClick?: () => void
}

export interface DishListProps extends Omit<DishCardProps, "dish"> {
  dish: Dish
}

