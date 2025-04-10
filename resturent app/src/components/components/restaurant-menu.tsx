"use client"

import { DialogTrigger } from "../components/ui/dialog"
import { DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { collection, addDoc, serverTimestamp, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"
import type React from "react"
import { useState, useEffect } from "react"
import { PlusCircle, Grid, List, Filter, SlidersHorizontal, GripVertical, ChefHat, Search } from "lucide-react"
import {
  Home,
  UtensilsCrossed,
  Coffee,
  Pizza,
  Salad,
  Fish,
  Beef,
  Cake,
  ListFilter,
  Utensils,
  Sandwich,
  IceCream,
  Wine,
  Apple,
  Soup,
  Drumstick,
  Croissant,
  Egg,
  ShoppingCart,
} from "lucide-react"

import "../../index.css"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import { AppSidebar } from "./app-sidebar"
import { DishCard } from "./dish-card"
import { SidebarInset, SidebarProvider } from "./ui/sidebar"
import { TopNavbar } from "../comp-manager/top-navbar"
import type { Dish } from "../comp-manager/types"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { useAppContext } from "../../context/AppContext"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import { getCategoriesFromFirestore } from "../api/useRestaurants"
import fetchCategoriesAndItems from "../api/categoreis&item"
import { uploadItemsToCategory } from "../api/categoriesUpload"
import { CelebrationDialog } from "./ui/celebration"

// Sample dish data
const initialDishes: Dish[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    category: "Pizza",
    image: "https://img.taste.com.au/Anr9L8A_/taste/2018/08/hawaiian-pizza-pasta-bake_1908x1320-140399-1.jpg",
    displayOrder: 1,
    restaurent: "",
    createdAt: "2022-07-15T10:30:00.000Z",
  },
  {
    id: 2,
    name: "Spaghetti Carbonara",
    description: "Pasta with eggs, cheese, pancetta, and black pepper",
    price: 14.99,
    category: "Pasta",
    image: "https://s.lightorangebean.com/media/20240914160809/Spicy-Penne-Pasta_-done.png",
    displayOrder: 2,
    restaurent: "",
    createdAt: "2022-07-15T10:30:00.000Z",
  },
  {
    id: 3,
    name: "Caesar Salad",
    description: "Romaine lettuce, croutons, parmesan cheese, and Caesar dressing",
    price: 9.99,
    category: "Salad",
    image:
      "https://images.immediate.co.uk/production/volatile/sites/30/2014/05/Epic-summer-salad-hub-2646e6e.jpg?resize=768,574",
    displayOrder: 3,
    restaurent: "",
    createdAt: "2022-07-15T10:30:00.000Z",
  },
]

const iconOptions = {
  Home,
  Pizza,
  Pasta: UtensilsCrossed,
  Salad,
  Seafood: Fish,
  Burgers: Beef,
  Dessert: Cake,
  Drinks: Coffee,
  Other: ListFilter,
  Utensils,
  Sandwich,
  IceCream,
  Wine,
  Apple,
  Soup,
  Chicken: Drumstick,
  Breakfast: Egg,
  Bakery: Croissant,
}

export function RestaurantMenu() {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [setSubCategories] = useState<any>([])
  const [newDish, setNewDish] = useState<any>({
    name: "",
    description: "",
    price: 0,
    category: "",
    subCategory: "", // ✅ Sub-category add karni hogi
    image: "https://kzmg31jtwsx06gw4knkz.lite.vusercontent.net/placeholder.svg",
    createdAt: "",
  })

  const [editingDish, setEditingDish] = useState<any | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [cart, setCart] = useState<Record<string, { dish: any; quantity: number }>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"name" | "price-asc" | "price-desc" | "custom">("custom")
  const [showVegetarian, setShowVegetarian] = useState(false)
  const [userRole, setUserRole] = useState<"owner" | "user" | undefined>("user")
  const navigate = useNavigate()
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [bool, setBool] = useState(false)
  const [categories, setCategories] = useState<any>("")
  const [dishRatings] = useState<Record<number, { rating: number; comment: string }>>({})
  const [showCelebration, setShowCelebration] = useState(false)

  const { activeUser, setActiveUser } = useAppContext()
  const { activeCategory, setActiveCategory } = useAppContext()
  const { activeRestaurant, setActiveRestaurant } = useAppContext()
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0)



  


  const fetchSubCategories = async () => {
    if (!activeRestaurant?.uid || !newDish.category?.id) return

    const restaurantId = activeRestaurant.uid
    const categoryId = newDish.category.id

    const subCategoriesRef = collection(db, "restaurants", restaurantId, "categories", categoryId, "subCategories")
    const subCategoriesSnapshot = await getDocs(subCategoriesRef)

    const subCategoryList: any = subCategoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    setSubCategories(subCategoryList)
  }

  const toggleUserRole = () => {
    setUserRole((prev) => {
      if (prev === "owner") return "user"
      if (prev === "user") return "owner"
    })
  }

  useEffect(() => {
    if (sortOrder === "custom") {
      setDishes((prev) => [...prev].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)))
    }
  }, [sortOrder])

  // Filter and sort dishes
  const filteredDishes = dishes

    .filter((dish) => {
      // Ensure items exist
      if (!dish.items || dish.items.length === 0) {
        return false
      }

      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()

        // Check if **ANY** item inside `dish.items` matches the search
        const itemMatch = dish.items.some(
          (item: any) =>
            item.name.toLowerCase().includes(searchLower) ||
            (item.description && item.description.toLowerCase().includes(searchLower)),
        )

        if (!itemMatch) {
          return false
        }
      }

      // Category filter
      if (selectedCategory && selectedCategory.name !== "All Items") {
        if (dish.name !== selectedCategory) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortOrder === "price-asc") {
        return a.items[0].price - b.items[0].price // Sorting by first item's price
      } else if (sortOrder === "price-desc") {
        return b.items[0].price - a.items[0].price
      } else {
        // Custom order (by displayOrder), handle undefined with a default value
        const aDisplayOrder = a.displayOrder ?? Number.MAX_SAFE_INTEGER // Use a large value for undefined
        const bDisplayOrder = b.displayOrder ?? Number.MAX_SAFE_INTEGER // Use a large value for undefined
        return aDisplayOrder - bDisplayOrder
      }
    })

  const loadData = async () => {
    if (!activeRestaurant?.uid) {
      console.error("No active restaurant or UID available.")
      return
    }
    const data = await fetchCategoriesAndItems(activeRestaurant.uid)
    const categoriesWithItems: any = data.filter((category) => category.items.length > 0)
    setDishes(categoriesWithItems)
  }

  // Modify the handleAddDish function to save the image to localStorage
  const handleAddDish = async () => {
    if (!newDish.name.trim() || !newDish.price || !selectedCategory || !newDish.description.trim()) {

      alert("Please fill all required fields including sub-category!")
      return
    }

    if (!activeRestaurant?.uid) {
      alert("No active restaurant selected!")
      return
    }
    try {
      const restaurantId = activeRestaurant.uid

      const maxOrderNumber = dishes.reduce((max, category) => {
        const categoryMax = category.items.reduce(
          (itemMax: any, item: any) => Math.max(itemMax, item.displayOrder || 0),
          0,
        )
        return Math.max(max, categoryMax)
      }, 0)

      const newOrderNumber = maxOrderNumber + 1

      const newCategory: any = {
        category_id: selectedCategoryId, // Ensure this is set correctly
        name: newDish.category.name,
        items: [
          {
            id: `${Date.now()}`, // Generate a unique ID
            name: newDish.name,
            description: newDish.description,
            price: newDish.price,
            imageUrl: newDish.image || "",
            displayOrder: newOrderNumber,
            createdAt: serverTimestamp(),
          },
        ],
      }
      // Pass the category to the upload function
      await uploadItemsToCategory(restaurantId, [newCategory])
      loadData()
      setSelectedCategory(null)
      setIsAddDialogOpen(false)

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error message: ", error.message)
        console.error("Error stack: ", error.stack)
      } else {
        console.error("An unknown error occurred")
      }
    }
  }

  const handleEditDish = async () => {
    const categoryId = editingDish?.categoryId // Ensure category_id is correct
    const itemId = editingDish?.id // Ensure item id is correct

    const itemsRef = collection(db, `restaurants/${activeRestaurant?.uid}/categories/${categoryId}/items`)

    try {
      const itemsSnapshot = await getDocs(itemsRef)

      // Ensure itemsSnapshot contains documents
      if (itemsSnapshot.empty) {
        console.error("No items found in the category.")
        return
      }

      let found = false

      // Loop through each document and check for a match
      for (const docSnap of itemsSnapshot.docs) {
        const data = docSnap.data()

        // Ensure the correct comparison of IDs
        if (data.id === itemId) {
          const itemRef = doc(db, docSnap.ref.path)

          // Update item
          await updateDoc(itemRef, {
            name: editingDish?.name,
            description: editingDish?.description,
            price: editingDish?.price,
            imageUrl: editingDish?.imageUrl,
          })

          console.log(`Dish "${editingDish?.name}" updated successfully!`)
          found = true
          loadData()
          setIsEditDialogOpen(false)
          break // Break the loop once the item is found and updated
        }
      }

      if (!found) {
        console.warn("Dish not found with the given ID inside items collection.")
      }
    } catch (error) {
      console.error("Error while updating dish:", error)
    }
  }

  const handleDeleteDish = async (itemId: string, categoryId: string) => {

    const itemsPath = `restaurants/${activeRestaurant?.uid}/categories/${categoryId}/items`

    try {
      const snapshot = await getDocs(collection(db, itemsPath))

      let found = false

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data()

        if (data.id === itemId) {
          const itemRef = doc(db, `${itemsPath}/${docSnap.id}`)
          await deleteDoc(itemRef)
          console.log(`✅ Dish item with ID ${itemId} deleted successfully.`)
          found = true
          break
        }
      }

      if (!found) {
        console.warn(`⚠️ Dish item with ID ${itemId} not found in category ${categoryId}`)
      }

      loadData() // Refresh your UI or data
    } catch (error) {
      console.error("🔥 Error deleting dish item:", error)
    }
  }

  const openEditDialog = (dish: Dish) => {
    setEditingDish(dish)
    setIsEditDialogOpen(true)
  }

  // Remove toggleWishlist function
  const addToCart = (dish: any) => {
    setCart((prev) => {
      const dishId = dish.id.toString()
      return {
        ...prev,
        [dishId]: {
          dish,
          quantity: prev[dishId] ? prev[dishId].quantity + 1 : 1,
        },
      }
    })
  }

  const removeFromCart = (dishId: string) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[dishId] && newCart[dishId].quantity > 1) {
        newCart[dishId] = {
          ...newCart[dishId],
          quantity: newCart[dishId].quantity - 1,
        }
      } else {
        delete newCart[dishId]
      }
      return newCart
    })
  }

  const fetchAllDishes = async () => {
    try {
      const dishesRef = collection(db, "dishes") // 👈 Firestore "dishes" collection ka reference
      const querySnapshot = await getDocs(dishesRef)

      // 🔥 Filter only dishes that match the active restaurant
      const filteredDishes: any = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((dish: any) => dish.restaurent === activeRestaurant) // 👈 Filter by active restaurant

      setDishes(filteredDishes) // 👈 Sirf matching dishes state mein save karein
    } catch (error) {
      console.error("Error fetching dishes:", error)
    }
  }

  const fetchCategories = async () => {
    const restaurantId: any = activeRestaurant?.uid

    if (!restaurantId) return

    try {
      const categories: any = await getCategoriesFromFirestore(restaurantId)
      const loadedCategories = categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        icon: iconOptions[cat.iconKey as keyof typeof iconOptions] || iconOptions["Other"],
      }))
      setCategories(loadedCategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchAllDishes()
    setCart({})
    setActiveCategory("")
    fetchSubCategories()
  }, [activeRestaurant])


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    handleCategorySelectForSideBaR()
  }, [activeCategory])

  const handleCategorySelect = (category: any | null) => {
    setSelectedCategoryId(category.id)
    setSelectedCategory(category.id)
    setActiveCategory(category.name)
  }
  const handleCategorySelectForSideBaR = () => {
    setSelectedCategory(activeCategory)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setSortOrder("custom")
    setShowVegetarian(false)
  }
  // Handle drag end event
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return // Dropped outside the list

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex === destinationIndex) return

    // Create a deep copy of the filtered dishes to avoid direct state mutation
    const reorderedCategories = JSON.parse(JSON.stringify(filteredDishes))

    if (reorderedCategories.length > 0 && reorderedCategories[0].items) {
      const firstCategory = reorderedCategories[0]
      const [removedItem] = firstCategory.items.splice(sourceIndex, 1)
      firstCategory.items.splice(destinationIndex, 0, removedItem)

      // Update display order for all items
      firstCategory.items.forEach((item: any, index: any) => {
        item.displayOrder = index + 1
      })

      setDishes((prevDishes) => {
        return prevDishes.map((category) => {
          if (category.id === firstCategory.id) {
            return firstCategory
          }
          return category
        })
      })
    }
  }

  const openDishDetail = (dish: Dish) => {
    setSelectedDish(dish)
    setRating(dishRatings[dish.id]?.rating || null)
    setComment(dishRatings[dish.id]?.comment || "")
    setIsDetailModalOpen(true)
  }

  useEffect(() => {
    localStorage.setItem("feedbackId", selectedDish?.id)
  }, [selectedDish])

  const saveRatingAndComment = async () => {
    if (selectedDish && rating) {
      try {
        const feedbackRef = collection(db, "dishFeedback", selectedDish.id, "comments")

        const newFeedback = {
          rating,
          comment,
          user: activeUser || "anonymous",
          createdAt: serverTimestamp(),
          dishId: selectedDish, // 👍 better than saving the whole object
        }

        await addDoc(feedbackRef, newFeedback)
        console.log("Feedback saved successfully!")
        setIsDetailModalOpen(false)
        setComment("")
        setRating(0)
      } catch (error) {
        console.error("Error saving feedback:", error)
      }
    }
  }

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `images/${fileName}`
    const { error } = await supabase.storage.from("restaurant-images").upload(filePath, file)
    if (error) {
      console.error("Error uploading image:", error)
      return null
    }
    const { data: publicUrlData } = supabase.storage.from("restaurant-images").getPublicUrl(filePath)
    return publicUrlData.publicUrl
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setBool(true)
        const imageUrl = await uploadImageToSupabase(file)
        if (imageUrl) {
          setNewDish({ ...newDish, image: imageUrl })
          setEditingDish({ ...editingDish, imageUrl })
          console.log(imageUrl, "url")
          setBool(false)
        }
      } catch (error) {
        console.error("Error saving image:", error)
      }
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [activeUser, activeRestaurant])

  useEffect(() => {
    if (activeRestaurant) {
      loadData()
    }
  }, [activeRestaurant])

  useEffect(() => {
    const storedOwners = JSON.parse(localStorage.getItem("activeUser") || "{}");
    const storedRest = JSON.parse(localStorage.getItem("activeRestaurant") || "{}");
    setActiveUser(storedOwners);
    setActiveRestaurant(storedRest);
    if (storedOwners && storedOwners.role) {
      setUserRole(storedOwners.role);
    }
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNavbar onSearch={handleSearch} searchQuery={searchQuery} />
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 border-b bg-background">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                {/* Logo and Restaurant Name */}
                <div className="flex items-center">
                  <ChefHat className="h-6 w-6 mr-2 text-primary" />
                  <h1 className="text-xl font-semibold">{activeRestaurant?.name || "Restaurant Menu"}</h1>

                  {/* Developer Mode Toggle */}
                  <div className="flex items-center ml-4">
                    <Badge variant={userRole === "owner" ? "destructive" : "default"}>
                      {userRole === "owner" ? "Owner" : "User"}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={toggleUserRole} className="ml-2 text-xs">
                      Switch Role
                    </Button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex relative w-full max-w-sm mx-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search menu items..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>

                {/* Filter and Sort Controls */}
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <div className="px-2 py-1.5">
                        <Label htmlFor="category-filter" className="text-xs">
                          Category
                        </Label>
                        <Select
                          value={selectedCategory || ""}
                          onValueChange={(value) => handleCategorySelect(value || null)}
                        >
                          <SelectTrigger id="category-filter" className="mt-1 h-8">
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All Items">All Items</SelectItem>
                            {Array.isArray(categories) &&
                              categories.length > 0 &&
                              categories.map((category: any) => (
                                <SelectItem key={category.id} value={category}>
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={clearFilters}>Clear Filters</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <SlidersHorizontal className="h-4 w-4" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {userRole === "owner" && (
                        <DropdownMenuCheckboxItem
                          checked={sortOrder === "custom"}
                          onCheckedChange={() => setSortOrder("custom")}
                        >
                          Custom Order
                        </DropdownMenuCheckboxItem>
                      )}
                      <DropdownMenuCheckboxItem
                        checked={sortOrder === "name"}
                        onCheckedChange={() => setSortOrder("name")}
                      >
                        Name (A-Z)
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={sortOrder === "price-asc"}
                        onCheckedChange={() => setSortOrder("price-asc")}
                      >
                        Price (Low to High)
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={sortOrder === "price-desc"}
                        onCheckedChange={() => setSortOrder("price-desc")}
                      >
                        Price (High to Low)
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    aria-label={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}
                  >
                    {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                  </Button>

                  {/* User Actions */}
                  {userRole !== "owner" && (
                    <Button variant="ghost" size="icon" className="relative" >
                      <ShoppingCart className="h-5 w-5" />
                      {Object.keys(cart).length > 0 && (
                        <Badge
                          variant="outline"
                          className="absolute -top-2 -right-2 h-5 w-5 bg-red-900 flex items-center justify-center p-0 text-xs"
                        >
                          {Object.values(cart).reduce((sum, item) => sum + item.quantity, 0)}
                        </Badge>
                      )}
                    </Button>
                  )}

                  {/* Add Dish Button (Owner Only) */}
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      {userRole === "owner" ? (
                        <Button size="sm" className="h-8">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Dish
                        </Button>
                      ) : null}
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
                            <Select
                              value={activeCategory || ""}
                              onValueChange={(value) => handleCategorySelect(value || null)}
                            >
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.isArray(categories) &&
                                  categories.length > 0 &&
                                  categories.map((category: any) => (
                                    <SelectItem key={category.id} value={category}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="image">Image</Label>
                          <Input type="file" id="image" accept="image/*" onChange={handleImageChange} />
                          {newDish.image && (
                            <img
                              src={newDish.image || "/placeholder.svg"}
                              alt="Preview"
                              className="mt-2 h-20 w-20 rounded-md object-cover"
                            />
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddDish} disabled={bool}>
                          Add Dish
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Mobile Search - Only visible on small screens */}
              <div className="md:hidden pb-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search menu items..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            {/* Active filters display */}
            {(searchQuery || selectedCategory || showVegetarian) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchQuery}
                    <button className="ml-1 rounded-full hover:bg-muted" onClick={() => setSearchQuery("")}>
                      ✕
                    </button>
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {activeCategory}
                    <button className="ml-1 rounded-full hover:bg-muted" onClick={() => setSelectedCategory(null)}>
                      ✕
                    </button>
                  </Badge>
                )}
                {/* {showVegetarian && (
                  // <Badge variant="secondary" className="flex items-center gap-1">
                  //   Vegetarian Only
                  //   <button className="ml-1 rounded-full hover:bg-muted" onClick={() => setShowVegetarian(false)}>
                  //     ✕
                  //   </button>
// </Badge>
// </Badge>
                  // </Badge>
                )} */}
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            )}

            {/* Results count */}
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredDishes.length} of {dishes.length} dishes
              {userRole === "owner" && sortOrder === "custom" && (
                <span className="ml-2 text-primary">(Drag items to reorder)</span>
              )}
            </div>

            {filteredDishes.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="text-lg font-medium">No dishes found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              userRole === "owner" && sortOrder === "custom" ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="dishes" direction="horizontal">
                    {(provided) => (
                      <div
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {filteredDishes.map((dish: any, index: number) =>
                          dish.items.map((item: any) => (
                            <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`${snapshot.isDragging ? "opacity-70" : ""}`}
                                >
                                  <div className="relative">
                                    {/* Drag Handle */}
                                    <div
                                      {...provided.dragHandleProps}
                                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 bg-background rounded-full p-1 shadow cursor-move opacity-0 hover:opacity-100 transition-opacity"
                                    >
                                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </div>

                                    {/* Dish Card */}
                                    <DishCard
                                      key={`${item.dishId}-${index}`}
                                      dish={item} // send individual item
                                      onEdit={
                                        userRole === "owner"
                                          ? () => openEditDialog({ ...item, categoryId: dish.id })
                                          : undefined
                                      }
                                      onDelete={
                                        userRole === "owner" ? () => handleDeleteDish(item.id, dish.id) : undefined
                                      }
                                      onAddToCart={userRole !== "owner" ? addToCart : undefined}
                                      isInCart={userRole !== "owner" ? cart[item.id] || 0 : 0}
                                      userRole={userRole}
                                      category={dish.name}
                                      onClick={() => openDishDetail(item)}
                                    />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          )),
                        )}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                  {filteredDishes.map((dish) =>
                    dish.items.map((item: any, index: any) => {
                      return (
                        <DishCard
                          key={`${item.dishId}-${index}`}
                          dish={item} // send individual item
                          onEdit={
                            userRole === "owner" ? () => openEditDialog({ ...item, categoryId: dish.id }) : undefined
                          }
                          onDelete={userRole === "owner" ? () => handleDeleteDish(item.id, dish.id) : undefined}
                          onAddToCart={userRole !== "owner" ? addToCart : undefined}
                          isInCart={userRole !== "owner" ? cart[item.id] || 0 : 0}
                          userRole={userRole}
                          category={dish.name}
                          onClick={() => openDishDetail(item)}
                        />
                      )
                    }),
                  )}
                </div>
              )
            ) : userRole === "owner" && sortOrder === "custom" ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="dishes">
                  {(provided) => (
                    <div className="space-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                      {filteredDishes.map((dish, index) =>
                        dish.items.map((item: any) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`${snapshot.isDragging ? "opacity-70 bg-accent rounded-lg" : ""}`}
                              >
                                <div className="relative flex flex-col sm:flex-row overflow-hidden border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                  {/* Drag handle */}
                                  <div
                                    {...provided.dragHandleProps}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 cursor-move bg-background/80 rounded-full"
                                  >
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  </div>

                                  {/* Image container with left padding for drag handle */}
                                  <div className="sm:w-48 h-48 sm:h-auto relative pl-10 sm:pl-0">
                                    <img
                                      src={item.imageUrl || "/placeholder.svg"}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                    {dish.name && (
                                      <div className="absolute top-2 left-12 sm:left-2">
                                        <Badge className="bg-black/70 text-white hover:bg-black/70">{dish.name}</Badge>
                                      </div>
                                    )}
                                  </div>

                                  {/* Content container */}
                                  <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                      <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                        <div className="text-lg font-bold">${item.price?.toFixed(2)}</div>
                                      </div>
                                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                        {item.description}
                                      </p>
                                    </div>

                                    {/* Actions container */}
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => openEditDialog({ ...item, categoryId: dish.id })}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => handleDeleteDish(item.id, dish.id)}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                      <Button variant="ghost" size="sm" onClick={() => openDishDetail(item)}>
                                        View Details
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )),
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="space-y-4">
                {filteredDishes.map((dish) =>
                  dish.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row overflow-hidden border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Image container - fixed width on larger screens */}
                      <div className="sm:w-48 h-48 sm:h-auto relative">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {dish.name && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-black/70 text-white hover:bg-black/70">{dish.name}</Badge>
                          </div>
                        )}
                      </div>

                      {/* Content container - takes remaining width */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <div className="text-lg font-bold">${item.price?.toFixed(2)}</div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                        </div>

                        {/* Actions container */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t">
                          {userRole === "owner" ? (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog({ ...item, categoryId: dish.id })}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteDish(item.id, dish.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              {cart[item.id] ? (
                                <div className="flex items-center border rounded-md">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-none"
                                    onClick={() => removeFromCart(item.id.toString())}
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
                                  </Button>
                                  <span className="w-8 text-center">{cart[item.id].quantity}</span>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => addToCart(item)}>
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
                                  </Button>
                                </div>
                              ) : (
                                <Button size="sm" onClick={() => addToCart(item)}>
                                  Add to Cart
                                </Button>
                              )}
                            </div>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => openDishDetail(item)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  )),
                )}
              </div>
            )}
          </main>
        </div>
      </SidebarInset>

      {/* Cart Display */}
      {Object.keys(cart).length > 0 && userRole !== "owner" && (
        <div className="fixed bottom-4 right-4 z-30">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="relative">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -left-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Your Cart</DialogTitle>
                  {totalItems > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {totalItems}
                    </Badge>
                  )}
                </div>
                <DialogDescription>
                  You have {totalItems} {totalItems === 1 ? "item" : "items"} in your cart.
                </DialogDescription>
              </DialogHeader>
              {/* Cart items list */}
              <div className="max-h-[60vh] overflow-y-auto">
                {Object.entries(cart).map(([dishId, { dish, quantity }]) => (
                  <div key={dishId} className="flex items-center justify-between border-b py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md">
                        <img src={dish.imageUrl || "/placeholder.svg"} alt={dish.name} className="h-full w-full object-cover" />
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
                          onClick={() => removeFromCart(dishId)}
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
                        <span className="w-8 text-center">{quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => addToCart(dish)}>
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
                    {Object.values(cart)
                      .reduce((total, { dish, quantity }) => total + dish.price * quantity, 0)
                      .toFixed(2)}
                  </div>
                  <Button onClick={() => {
                    setShowCelebration(true);
                    setCart({});
                  }}>
                    Checkout
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

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
                  onChange={(e) =>
                    setEditingDish({
                      ...editingDish,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingDish.description}
                  onChange={(e) =>
                    setEditingDish({
                      ...editingDish,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={editingDish.price}
                  onChange={(e) =>
                    setEditingDish({
                      ...editingDish,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-image">Image</Label>
                <Input
                  type="file"
                  id="edit-image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {editingDish.imageUrl && (
                  <img
                    src={editingDish.imageUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="mt-2 h-20 w-20 rounded-md object-cover"
                  />
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditDish}
              disabled={!editingDish?.imageUrl} // Disable the button if image is not selected
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CelebrationDialog showCelebration={showCelebration} setShowCelebration={setShowCelebration} />

      {/* Add the detail modal at the end of the component, just before the final closing tag */}
      {/* Dish Detail Modal */}

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedDish && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDish.name}</DialogTitle>
                <DialogDescription>
                  {selectedDish?.name} - ${selectedDish?.price?.toFixed(2)}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="relative h-48 w-full overflow-hidden rounded-md">
                  <img
                    src={selectedDish?.imageUrl || "/placeholder.svg"}
                    alt={selectedDish?.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <p className="text-sm text-muted-foreground">{selectedDish?.description}</p>

                <div className="border-t pt-4">
                  <h4 className="mb-2 font-medium">Rate this dish</h4>
                  <RadioGroup
                    value={rating?.toString() || ""}
                    onValueChange={(value) => setRating(Number.parseInt(value))}
                    className="flex space-x-4 mb-4"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                        <Label htmlFor={`rating-${value}`} className="text-sm">
                          {value} {value === 1 ? "Star" : "Stars"}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="grid gap-2">
                    <Label htmlFor="comment">Comments</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your thoughts about this dish..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="mb-3 sm:mb-0" onClick={saveRatingAndComment} disabled={!rating}>
                  Save Rating
                </Button>
                <Button
                  className="mb-3 sm:mb-0"
                  onClick={() => {
                    navigate("/customer")
                  }}
                >
                  Feedbacks
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}


