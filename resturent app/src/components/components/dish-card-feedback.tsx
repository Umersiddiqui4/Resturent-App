"use client"
import { Card, CardContent, CardHeader } from "./ui/card"
import { cn } from "@/lib/utils"
export function DishCard({
  dish,
}: any) {
  console.log(dish, "dishcard");

  return (
    <Card className="overflow-hidden mb-4">
      <CardHeader className="p-0">
        <div className="relative lg:h-96 h-80 w-full">
          <img
            src={dish.imageUrl || "/placeholder.svg"}
            alt={dish.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent
        className={cn("p-4 relative cursor-pointer")}
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">
            {dish.name.charAt(0).toUpperCase() + dish.name.slice(1)}
          </h3>
          <span className="font-medium text-primary">${dish.price.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

