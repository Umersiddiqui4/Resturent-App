"use client"

import { DropdownMenuTrigger } from "../components/ui/dropdown-menu"

import type React from "react"
import { useState, useEffect } from "react"
import { PlusCircle, Grid, List, Filter, SlidersHorizontal, GripVertical } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
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
import { DishList } from "./dish-list"
import { SidebarInset, SidebarProvider } from "./ui/sidebar"
import { TopNavbar } from "../comp-manager/top-navbar"
import type { Dish } from "../comp-manager/types"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { useAppContext } from "../../context/AppContext"
import { useNavigate } from "react-router-dom"

// Sample dish data
const initialDishes: Dish[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    category: "Pizza",
    image: "https://img.taste.com.au/Anr9L8A_/taste/2018/08/hawaiian-pizza-pasta-bake_1908x1320-140399-1.jpg",
    displayOrder: 1,
    restaurent: ""
  },
  {
    id: 2,
    name: "Spaghetti Carbonara",
    description: "Pasta with eggs, cheese, pancetta, and black pepper",
    price: 14.99,
    category: "Pasta",
    image: "https://s.lightorangebean.com/media/20240914160809/Spicy-Penne-Pasta_-done.png",
    displayOrder: 2,
    restaurent: ""
  },
  {
    id: 3,
    name: "Caesar Salad",
    description: "Romaine lettuce, croutons, parmesan cheese, and Caesar dressing",
    price: 9.99,
    category: "Salad",
    image: "https://images.immediate.co.uk/production/volatile/sites/30/2014/05/Epic-summer-salad-hub-2646e6e.jpg?resize=768,574",
    displayOrder: 3,
    restaurent: ""
  },


]

export function RestaurantMenu() {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [newDish, setNewDish] = useState<Omit<Dish, "id" | "displayOrder" | "restaurent">>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "https://kzmg31jtwsx06gw4knkz.lite.vusercontent.net/placeholder.svg",
  })
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [cart, setCart] = useState<Record<number, number>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortOrder, setSortOrder] = useState<"name" | "price-asc" | "price-desc" | "custom">("custom")
  const [showVegetarian, setShowVegetarian] = useState(false)
  const [userRole, setUserRole] = useState<"owner" | "user" | "guest">("user")
  const [isDragging, setIsDragging] = useState(false)
  const [activeRestaurant, setActiveRestaurant] = useState("")
  const navigate = useNavigate();
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [dishRatings, setDishRatings] = useState<Record<number, { rating: number; comment: string }>>({})


  const { activeUser, setActiveUser } = useAppContext();
  const { activeCategory, setActiveCategory } = useAppContext();

  const getUserRole = (activeUser: { restaurantName?: string }) => {
    return activeUser?.restaurantName ? "owner" : "user";
  };


  useEffect(() => {
    const storedOwners = JSON.parse(localStorage.getItem("activeUser") || "{}");
    setActiveUser(storedOwners);
    setUserRole(getUserRole(storedOwners)); 
  }, []);
  useEffect(() => {
    const storedDishes = JSON.parse(localStorage.getItem("dishes") || "[]");
    const storedrestaurant = JSON.parse(localStorage.getItem("activeRestaurant") || "{}");
    setDishes(storedDishes);
    setActiveRestaurant(storedrestaurant);
    handleCategorySelectForSideBaR();
  }, [activeCategory]);


  const toggleUserRole = () => {
    setUserRole((prev) => {
      if (prev === "owner") return "user"
      if (prev === "user") return "guest"
      return "owner"
    })
  }


  // Sort dishes by display order when in custom sort mode
  useEffect(() => {
    if (sortOrder === "custom") {
      setDishes((prev) => [...prev].sort((a, b) => a.displayOrder - b.displayOrder))
    }
  }, [sortOrder])

  // Filter and sort dishes
  const filteredDishes = dishes
    .filter((dish) => {
      // Restaurant filter
      if (
        (activeUser?.restaurantName ?? activeRestaurant) !== dish.restaurent
      ) {
        return false;
      }
      

      // Search query filter
      if (
        searchQuery &&
        !dish.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !dish.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (selectedCategory && selectedCategory !== "All Items" && dish.category !== selectedCategory) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "price-asc") {
        return a.price - b.price;
      } else if (sortOrder === "price-desc") {
        return b.price - a.price;
      } else {
        // Custom order (by displayOrder)
        return a.displayOrder - b.displayOrder;
      }
    });


  // Modify the handleAddDish function to save the image to localStorage
  const handleAddDish = () => {
    const newId = dishes.length > 0 ? Math.max(...dishes.map((dish) => dish.id)) + 1 : 1;
    const maxDisplayOrder = dishes.length > 0 ? Math.max(...dishes.map((dish) => dish.displayOrder)) : 0;

    const newDishWithId = {
      ...newDish,
      id: newId,
      displayOrder: maxDisplayOrder + 1,
      restaurent: activeUser?.restaurantName
    };

    // Update dishes state with the new dish
    const updatedDishes = [...dishes, newDishWithId];
    setDishes(updatedDishes);

    // ✅ Save all dishes to localStorage
    localStorage.setItem("dishes", JSON.stringify(updatedDishes));

    // Reset the newDish form
    setNewDish({
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "https://kzmg31jtwsx06gw4knkz.lite.vusercontent.net/placeholder.svg",
    });

    setIsAddDialogOpen(false);
  };

  // Modify the handleEditDish function to save the updated image to localStorage
  const handleEditDish = () => {
    if (editingDish) {
      // اگر نئی امیج بیس64 فارمیٹ میں ہے تو اسے لوکل اسٹوریج میں محفوظ کریں
      if (editingDish.image && editingDish.image.startsWith("data:")) {
        localStorage.setItem(`dish-image-${editingDish.id}`, editingDish.image);
      }

      // نیا ڈش لسٹ اپڈیٹ کریں
      const updatedDishes = dishes.map((dish) =>
        dish.id === editingDish.id ? editingDish : dish
      );

      setDishes(updatedDishes); // اسٹیٹ اپڈیٹ کریں
      localStorage.setItem("dishes", JSON.stringify(updatedDishes)); // لوکل اسٹوریج اپڈیٹ کریں

      // ڈائیلاگ بند کریں اور ایڈٹنگ ڈش کو ری سیٹ کریں
      setIsEditDialogOpen(false);
      setEditingDish(null);
    }
  };

  // Modify the handleDeleteDish function to remove the image from localStorage
  const handleDeleteDish = (id: number) => {
    localStorage.removeItem(`dish-image-${id}`);

    const updatedDishes = dishes.filter((dish) => dish.id !== id);

    setDishes(updatedDishes);

    localStorage.setItem("dishes", JSON.stringify(updatedDishes));
  };


  const openEditDialog = (dish: Dish) => {
    setEditingDish(dish)
    setIsEditDialogOpen(true)
  }

  // Remove toggleWishlist function
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCategorySelectForSideBaR = () => {
    setSelectedCategory(activeCategory)

  }
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)
    setActiveCategory(category)

  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setPriceRange([0, 50])
    setSortOrder("custom")
    setShowVegetarian(false)
  }

  // Update this line to ensure it includes categories from newly added dishes
  const categories = [
    "Pizza",
    "Pasta",
    "Salad",
    "Seafood",
    "Burgers",
    "Dessert",
    "Drinks"
  ];

  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false)

    // Dropped outside the list
    if (!result.destination) {
      return
    }

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex === destinationIndex) {
      return
    }

    const reorderedDishes = [...filteredDishes]

    const [removed] = reorderedDishes.splice(sourceIndex, 1)

    reorderedDishes.splice(destinationIndex, 0, removed)

    const updatedDishes = reorderedDishes.map((dish, index) => ({
      ...dish,
      displayOrder: index + 1,
    }))

    const updatedDishMap = updatedDishes.reduce(
      (map, dish) => {
        map[dish.id] = dish
        return map
      },
      {} as Record<number, Dish>,
    )

    const allDishesUpdated = dishes.map((dish) => (updatedDishMap[dish.id] ? updatedDishMap[dish.id] : dish))

    setDishes(allDishesUpdated)
    setSortOrder("custom")

    localStorage.setItem("dishes", JSON.stringify(allDishesUpdated));

  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const openDishDetail = (dish: Dish) => {
    setSelectedDish(dish)
    setRating(dishRatings[dish.id]?.rating || null)
    setComment(dishRatings[dish.id]?.comment || "")
    setIsDetailModalOpen(true)
  }

  const saveRatingAndComment = () => {
    if (selectedDish && rating) {
      const existingFeedback = JSON.parse(localStorage.getItem("feedback") || "{}");
      const newFeedback = {
        ...existingFeedback,
        [selectedDish.id]: { rating, comment, selectedDish },
      };

      localStorage.setItem("feedback", JSON.stringify(newFeedback));

      setDishRatings(newFeedback);
      setIsDetailModalOpen(false);
    }
  };


  const loadImagesFromLocalStorage = () => {
    setDishes((prevDishes) =>
      prevDishes.map((dish) => {
        const savedImage = localStorage.getItem(`dish-image-${dish.id}`)
        if (savedImage) {
          return { ...dish, image: savedImage }
        }
        return dish
      }),
    )
  }

  useEffect(() => {
    loadImagesFromLocalStorage()
  }, [])

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await saveImageToIndexedDB(file); 
        setNewDish({ ...newDish, image: imageUrl });
      } catch (error) {
        console.error("Error saving image:", error);
      }
    }
  }


  const saveImageToIndexedDB = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("myDatabase", 1);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
        }
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const reader = new FileReader();

        reader.onload = () => {
          const transaction = db.transaction("images", "readwrite"); 
          const store = transaction.objectStore("images");

          const data = { image: reader.result };
          const addRequest = store.add(data);

          addRequest.onsuccess = () => {
            resolve(reader.result as string);
          };

          addRequest.onerror = () => reject(addRequest.error);
        };

        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      };

      request.onerror = () => reject(request.error);
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNavbar onSearch={handleSearch} searchQuery={searchQuery} />
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <h1 className="text-xl font-semibold">Restaurant Menu</h1>
            <div className="flex items-center ml-4">
              <Badge variant={userRole === "owner" ? "destructive" : userRole === "user" ? "default" : "outline"}>
                {userRole === "owner" ? "Owner" : userRole === "user" ? "User" : "Guest"}
              </Badge>
              <Button variant="ghost" size="sm" onClick={toggleUserRole} className="ml-2 text-xs">
                Switch Role
              </Button>
            </div>

            {/* Filter and Sort Controls */}
            <div className="ml-auto flex items-center gap-2">
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
                        <SelectItem value="all" disabled>All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="px-2 py-1.5">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vegetarian"
                        checked={showVegetarian}
                        onCheckedChange={(checked) => setShowVegetarian(checked as boolean)}
                      />
                      <label
                        htmlFor="vegetarian"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Vegetarian Only
                      </label>
                    </div>
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
                  <DropdownMenuCheckboxItem checked={sortOrder === "name"} onCheckedChange={() => setSortOrder("name")}>
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
                          value={newDish.category}
                          onValueChange={(value) => setNewDish({ ...newDish, category: value })}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
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
                    <Button onClick={handleAddDish}>Add Dish</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                    Category: {selectedCategory}
                    <button className="ml-1 rounded-full hover:bg-muted" onClick={() => setSelectedCategory(null)}>
                      ✕
                    </button>
                  </Badge>
                )}
                {showVegetarian && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Vegetarian Only
                    <button className="ml-1 rounded-full hover:bg-muted" onClick={() => setShowVegetarian(false)}>
                      ✕
                    </button>
                  </Badge>
                )}
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
                <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                  <Droppable droppableId="dishes" direction="horizontal">
                    {(provided) => (
                      <div
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {filteredDishes.map((dish, index) => {

                          return (
                            <Draggable key={dish.id.toString()} draggableId={dish.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`${snapshot.isDragging ? "opacity-70" : ""}`}
                                >
                                  <div className="relative">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 bg-background rounded-full p-1 shadow cursor-move opacity-0 hover:opacity-100 transition-opacity"
                                    >
                                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <DishCard
                                      dish={dish}
                                      onEdit={userRole === "owner" ? () => openEditDialog(dish) : undefined}
                                      onDelete={userRole === "owner" ? () => handleDeleteDish(dish.id) : undefined}
                                      onAddToCart={userRole !== "owner" ? addToCart : undefined}
                                      isInCart={userRole !== "owner" ? cart[dish.id] || 0 : 0}
                                      userRole={userRole}
                                      onClick={() => openDishDetail(dish)}
                                    />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredDishes.map((dish) => {
                    return (
                      <DishCard
                        key={dish.id}
                        dish={dish}
                        onEdit={userRole === "owner" ? () => openEditDialog(dish) : undefined}
                        onDelete={userRole === "owner" ? () => handleDeleteDish(dish.id) : undefined}
                        onAddToCart={userRole !== "owner" ? addToCart : undefined}
                        isInCart={userRole !== "owner" ? cart[dish.id] || 0 : 0}
                        userRole={userRole}
                        onClick={() => openDishDetail(dish)}
                      />
                    )
                  })}
                </div>
              )
            ) : userRole === "owner" && sortOrder === "custom" ? (
              <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                <Droppable droppableId="dishes">
                  {(provided) => (
                    <div className="space-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                      {filteredDishes.map((dish, index) => (
                        <Draggable key={dish.id.toString()} draggableId={dish.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`${snapshot.isDragging ? "opacity-70 bg-accent rounded-lg" : ""}`}
                            >
                              <div className="relative">
                                <div
                                  {...provided.dragHandleProps}
                                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 cursor-move"
                                >
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="pl-8">
                                  <DishList
                                    dish={dish}
                                    onEdit={userRole === "owner" ? () => openEditDialog(dish) : undefined}
                                    onDelete={userRole === "owner" ? () => handleDeleteDish(dish.id) : undefined}
                                    onAddToCart={userRole !== "owner" ? addToCart : undefined}
                                    isInCart={userRole !== "owner" ? cart[dish.id] || 0 : 0}
                                    userRole={userRole}
                                    onClick={() => openDishDetail(dish)}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="space-y-4">
                {filteredDishes.map((dish) => (
                  <DishList
                    key={dish.id}
                    dish={dish}
                    onEdit={userRole === "owner" ? () => openEditDialog(dish) : undefined}
                    onDelete={userRole === "owner" ? () => handleDeleteDish(dish.id) : undefined}
                    onAddToCart={userRole !== "owner" ? addToCart : undefined}
                    isInCart={userRole !== "owner" ? cart[dish.id] || 0 : 0}
                    userRole={userRole}
                    onClick={() => openDishDetail(dish)}
                  />
                ))}
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
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
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
                  <Select
                    value={editingDish.category}
                    onValueChange={(value) => setEditingDish({ ...editingDish, category: value })}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Image</Label>
                <Input type="file" id="edit-image" accept="image/*" onChange={handleImageChange} />
                {editingDish.image && (
                  <img
                    src={editingDish.image || "/placeholder.svg"}
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
            <Button onClick={handleEditDish}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add the detail modal at the end of the component, just before the final closing tag */}
      {/* Dish Detail Modal */}

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedDish && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDish.name}</DialogTitle>
                <DialogDescription>
                  {selectedDish.category} - ${selectedDish.price.toFixed(2)}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="relative h-48 w-full overflow-hidden rounded-md">
                  <img
                    src={selectedDish.image || "/placeholder.svg"}
                    alt={selectedDish.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <p className="text-sm text-muted-foreground">{selectedDish.description}</p>

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
                <Button onClick={saveRatingAndComment} disabled={!rating}>
                  Save Rating
                </Button>
                <Button onClick={() => {navigate("/customer")}} disabled={!rating}>
                Feedback
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

