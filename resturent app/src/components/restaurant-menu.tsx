"use client"

import { useState } from "react"
import { PlusCircle, Grid, List } from "lucide-react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Textarea } from "./components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog"
import { AppSidebar } from "./comp-manager/app-sidebar"
import { DishCard } from "./comp-manager/dish-card"
import { DishList } from "./comp-manager/dish-list"
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar"
import { TopNavbar } from "./comp-manager/top-navbar"
import type { Dish } from "./comp-manager/types"

// Sample dish data
const initialDishes: Dish[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    category: "Pizza",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Spaghetti Carbonara",
    description: "Pasta with eggs, cheese, pancetta, and black pepper",
    price: 14.99,
    category: "Pasta",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Caesar Salad",
    description: "Romaine lettuce, croutons, parmesan cheese, and Caesar dressing",
    price: 9.99,
    category: "Salad",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Grilled Salmon",
    description: "Fresh salmon fillet with lemon butter sauce and seasonal vegetables",
    price: 18.99,
    category: "Seafood",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    name: "Beef Burger",
    description: "Angus beef patty with lettuce, tomato, cheese, and special sauce",
    price: 13.99,
    category: "Burgers",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 6,
    name: "Chocolate Cake",
    description: "Rich chocolate cake with ganache frosting",
    price: 7.99,
    category: "Dessert",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export function RestaurantMenu() {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [newDish, setNewDish] = useState<Omit<Dish, "id">>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "/placeholder.svg?height=200&width=200",
  })
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [cart, setCart] = useState<Record<number, number>>({})

  const handleAddDish = () => {
    const newId = dishes.length > 0 ? Math.max(...dishes.map((dish) => dish.id)) + 1 : 1
    setDishes([...dishes, { ...newDish, id: newId }])
    setNewDish({
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "/placeholder.svg?height=200&width=200",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditDish = () => {
    if (editingDish) {
      setDishes(dishes.map((dish) => (dish.id === editingDish.id ? editingDish : dish)))
      setIsEditDialogOpen(false)
      setEditingDish(null)
    }
  }

  const handleDeleteDish = (id: number) => {
    setDishes(dishes.filter((dish) => dish.id !== id))
  }

  const openEditDialog = (dish: Dish) => {
    setEditingDish(dish)
    setIsEditDialogOpen(true)
  }

  const toggleWishlist = (dishId: number) => {
    if (wishlist.includes(dishId)) {
      setWishlist(wishlist.filter((id) => id !== dishId))
    } else {
      setWishlist([...wishlist, dishId])
    }
  }

  const addToCart = (dishId: number) => {
    setCart((prev) => ({
      ...prev,
      [dishId]: (prev[dishId] || 0) + 1,
    }))
  }

  const removeFromCart = (dishId: number) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[dishId] > 1) {
        newCart[dishId] -= 1
      } else {
        delete newCart[dishId]
      }
      return newCart
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNavbar />
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <h1 className="text-xl font-semibold">Restaurant Menu</h1>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                aria-label={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Dish
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Dish</DialogTitle>
                    <DialogDescription>Fill in the details to add a new dish to the menu.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newDish.name}
                        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newDish.description}
                        onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newDish.price}
                          onChange={(e) => setNewDish({ ...newDish, price: Number.parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={newDish.category}
                          onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddDish}>Add Dish</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </header>
          <main className="flex-1 p-6">
            {viewMode === "grid" ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {dishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onEdit={() => openEditDialog(dish)}
                    onDelete={() => handleDeleteDish(dish.id)}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={wishlist.includes(dish.id)}
                    onAddToCart={addToCart}
                    isInCart={cart[dish.id] || 0}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dishes.map((dish) => (
                  <DishList
                    key={dish.id}
                    dish={dish}
                    onEdit={() => openEditDialog(dish)}
                    onDelete={() => handleDeleteDish(dish.id)}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={wishlist.includes(dish.id)}
                    onAddToCart={addToCart}
                    isInCart={cart[dish.id] || 0}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </SidebarInset>

      {/* Cart Display */}
      {Object.keys(cart).length > 0 && (
        <div className="fixed bottom-4 right-4 z-30">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                Cart
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                  {Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your Cart</DialogTitle>
                <DialogDescription>
                  You have {Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)} item
                  {Object.values(cart).reduce((sum, quantity) => sum + quantity, 0) !== 1 ? "s" : ""} in your cart.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto">
                {dishes
                  .filter((dish) => cart[dish.id])
                  .map((dish) => (
                    <div key={dish.id} className="flex items-center justify-between border-b py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <img
                            src={dish.image || "/placeholder.svg"}
                            alt={dish.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{dish.name}</h3>
                          <p className="text-sm text-muted-foreground">${dish.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => removeFromCart(dish.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M5 12h14" />
                            </svg>
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center">{cart[dish.id]}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => addToCart(dish.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M5 12h14" />
                              <path d="M12 5v14" />
                            </svg>
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <DialogFooter>
                <div className="flex w-full items-center justify-between">
                  <div className="text-lg font-semibold">
                    Total: $
                    {dishes
                      .filter((dish) => cart[dish.id])
                      .reduce((total, dish) => total + dish.price * cart[dish.id], 0)
                      .toFixed(2)}
                  </div>
                  <Button>Checkout</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Edit Dish Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Dish</DialogTitle>
            <DialogDescription>Update the details of this dish.</DialogDescription>
          </DialogHeader>
          {editingDish && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingDish.description}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={editingDish.price}
                    onChange={(e) => setEditingDish({ ...editingDish, price: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={editingDish.category}
                    onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDish}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

