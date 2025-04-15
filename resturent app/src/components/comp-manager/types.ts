export interface Dish {
  id?: any
  name: any
  description: string
  price: number
  category?: string
  image: string
  displayOrder?: number;
  restaurent?: string | undefined
  createdAt?: string;
  selectedDish?: any
  restaurantId?: string
  imageUrl?: string
  items?: any
}


export interface DishCardProps {
  dish:string
  onEdit?: () => void
  onDelete?: () => void
  onAddToCart?: (dishId: number) => void
  isInCart?: any
  userRole?: "owner" | "user" | "guest"
  onClick?: () => void
  category?: string
}

export interface DishListProps extends Omit<DishCardProps, "dish"> {
  dish: Dish
}

export interface User {
  role: string;
  name: string;
  restaurantName?: string | undefined;
  uid: string;
  email: string; 
  id?: string;
  avatar?: string;
  createdAt?: any;
}
export interface Restaurent {
  createdAt: object
  email: string
  name: string
  owner_Id: string
  uid: string
}