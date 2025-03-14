"use client"

import { Button } from "../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Edit, Trash } from 'lucide-react'
import { cn } from "@/lib/utils"
import type { DishListProps } from "../comp-manager/types"
import type { Dish } from "../comp-manager/types"

export function DishList({
  dish,
  onEdit,
  onDelete,
  onToggleWishlist,
  isInWishlist = false,
  onAddToCart,
  isInCart = 0,
  userRole,
}: DishListProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
        <img src={dish.image || "/placeholder.svg"} alt={dish.name} className="h-full w-full object-cover" />
        {isInWishlist && (
          <div className="absolute top-0 right-0 bg-red-500 rounded-bl-md p-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
        )}
      </div>
      <div
        className={cn("flex-1 min-w-0", onToggleWishlist ? "cursor-pointer" : "")}
        onClick={() => onToggleWishlist && onToggleWishlist(dish.id)}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{dish.name}</h3>
          <span className="font-medium text-primary">${dish.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">{dish.description}</p>
        <span className="text-xs font-medium text-muted-foreground">{dish.category}</span>
      </div>
      <div className="flex items-center gap-2">
        {onAddToCart && (
          <Button
            variant="default"
            size="sm"
            className="bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart && onAddToCart(dish.id)
            }}
          >
            {isInCart ? "Add Another" : "Add to Cart"}
          </Button>
        )}
        {onEdit && onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
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
        )}
      </div>
    </div>
  )
}
