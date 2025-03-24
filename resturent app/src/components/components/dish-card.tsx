"use client"

import { Edit, Trash } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import type { DishCardProps } from "../comp-manager/types"
import { cn } from "@/lib/utils"
import { useAppContext } from "@/context/AppContext"

export function DishCard({
  dish,
  onEdit,
  onDelete,
  onAddToCart = () => { },
  isInCart = 0,
  onClick,
}: DishCardProps) {
  const { activeUser } = useAppContext();
  const { activeRestaurant } = useAppContext()
  return (
    <Card className="overflow-hidden ">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <img
            src={dish.image || "/placeholder.svg"}
            alt={dish.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {onEdit && onDelete && (
            <div className="absolute right-2 top-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                    <span className="sr-only">Open menu</span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                    >
                      <path
                        d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {onAddToCart && activeUser?.restaurantName !== activeRestaurant && (
            <div className="absolute right-2 bottom-2">
              <Button
                variant="default"
                size="sm"
                className="bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToCart(dish.id)
                }}
              >
                {isInCart ? "Add Another" : "Add to Cart"}
              </Button>
            </div>
          )}

        </div>
      </CardHeader>
      <CardContent
        className={cn("p-4 relative cursor-pointer")}
        onClick={(e) => {
          e.stopPropagation()
          if (onClick) onClick()
        }}
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">
            {dish.name.charAt(0).toUpperCase() + dish.name.slice(1)}
          </h3>
          <span className="font-medium text-primary">${dish.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{dish.description}</p>
      </CardContent>
      <CardFooter className="border-t p-4 pt-2">
        <span className="text-xs font-medium text-muted-foreground">{dish.category}</span>
      </CardFooter>
    </Card>
  )
}

