"use client"

import { ShoppingCart } from "lucide-react"
import { Badge } from "./badge"
import { Button } from "./button"
import { Dialog, DialogTrigger } from "./dialog"

interface CartButtonProps {
  cart: Record<string, { quantity: number }>
}

export function CartButton({ cart = {} }: CartButtonProps) {
  const itemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="relative">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -left-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
    </Dialog>
  )
}
