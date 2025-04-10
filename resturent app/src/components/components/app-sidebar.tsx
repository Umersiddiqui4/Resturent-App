"use client"

import React from "react"

import { useEffect, useState } from "react"
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
  ChevronDown,
  Plus,
  Utensils,
  Sandwich,
  IceCream,
  Wine,
  Apple,
  Soup,
  Drumstick,
  Croissant,
  Egg,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar"
import { Button } from "./ui/button"
import { useAppContext } from "../../context/AppContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { getCategoriesFromFirestore, useRestaurants } from "../api/useRestaurants"
import ListSkeleton from "../comp-manager/list_skeleton"
import { createCategory } from "../api/categoriesUpload"

// Define all available icons
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
// Icon mapping for automatic selection
const iconKeywords = {
  pizza: Pizza,
  pasta: UtensilsCrossed,
  spaghetti: UtensilsCrossed,
  noodle: UtensilsCrossed,
  salad: Salad,
  vegetable: Salad,
  vegan: Salad,
  fish: Fish,
  seafood: Fish,
  shrimp: Fish,
  burger: Beef,
  beef: Beef,
  steak: Beef,
  meat: Beef,
  cake: Cake,
  dessert: Cake,
  sweet: Cake,
  pastry: Cake,
  coffee: Coffee,
  drink: Coffee,
  beverage: Coffee,
  juice: Coffee,
  sandwich: Sandwich,
  ice: IceCream,
  gelato: IceCream,
  wine: Wine,
  alcohol: Wine,
  fruit: Apple,
  soup: Soup,
  chicken: Drumstick,
  poultry: Drumstick,
  breakfast: Egg,
  brunch: Egg,
  bread: Croissant,
  bakery: Croissant,
  croissant: Croissant,
}

const categories = [
  { name: "All Items", icon: Home },
  // { name: "Pizza", icon: Pizza },
  // { name: "Pasta", icon: UtensilsCrossed },
  // { name: "Salad", icon: Salad },
  // { name: "Seafood", icon: Fish },
  // { name: "Burgers", icon: Beef },
  // { name: "Dessert", icon: Cake },
  // { name: "Drinks", icon: Coffee },
  // { name: "Other", icon: ListFilter },
]

type StoredCategory = {
  id?: string;
  name: string;
  icon: keyof typeof iconOptions;
  iconKey: keyof typeof iconOptions;
  category_id: string;
}

type Category = {
  id?: string;              // Unique identifier for the category
  name: string;             // Category ka naam
  icon: keyof typeof iconOptions;  // Category ka icon key
  category_id: string;      // Category ka restaurant id
};

export function AppSidebar() {
  const { activeCategory, setActiveCategory } = useAppContext()
  const { activeUser } = useAppContext()
  const { owners } = useAppContext()
  const { activeRestaurant, setActiveRestaurant } = useAppContext()
  const [customCategories, setCustomCategories] = useState<Array<{ name?: string; icon?: any }>>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof iconOptions>("Other")
  const [dialogOpen, setDialogOpen] = useState(false)
  const allCategories = [...categories, ...customCategories]

  const fetchCategories = async () => {
    const restaurantId: any = activeRestaurant?.uid;

    if (!restaurantId) return;

    try {
      const categories: any = await getCategoriesFromFirestore(restaurantId);
      const loadedCategories: Category[] = categories.map((cat: any) => ({
        id: cat.id || "",
        name: cat.name || "Unnamed Category",
        icon: cat.iconKey || "Other", // 👈 use iconKey for UI rendering
        iconKey: cat.iconKey || "Other",
        category_id: cat.category_id || restaurantId,
      }));
      setCustomCategories(loadedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };


  useEffect(() => {
    fetchCategories();
  }, [activeUser, owners, activeRestaurant]);

  useEffect(() => {
    if (newCategoryName) {
      const lowerCaseName = newCategoryName.toLowerCase()

      const exactMatch = Object.keys(iconOptions).find((key) => key.toLowerCase() === lowerCaseName) as
        | keyof typeof iconOptions
        | undefined

      if (exactMatch) {
        setSelectedIcon(exactMatch)
        return
      }
      for (const [keyword, icon] of Object.entries(iconKeywords)) {
        if (lowerCaseName.includes(keyword)) {
          const iconKey = Object.entries(iconOptions).find(([_, value]) => value === icon)?.[0] as
            | keyof typeof iconOptions
            | undefined

          if (iconKey) {
            setSelectedIcon(iconKey)
            return
          }
        }
      }
      setSelectedIcon("Other")
    }
  }, [newCategoryName])

  const { loading, error } = useRestaurants()

  if (loading) {
    return (
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex h-14 items-center px-4">
            <UtensilsCrossed className="mr-2 h-6 w-6" />
            <ListSkeleton />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu Categories</SidebarGroupLabel>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={category.name === activeCategory}
                    onClick={() => setActiveCategory("")}
                  >
                    <a href="#" className={cn("flex items-center")}>
                      <category.icon className="mr-2 h-4 w-4" />
                      <span>{category.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          {/* Special Offers Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Special Offers</SidebarGroupLabel>
            <div className="px-3 py-2">
              <div className="rounded-md bg-primary/10 p-3 text-sm">
                <h4 className="font-medium text-primary">Today's Special</h4>
                <p className="mt-1 text-xs text-muted-foreground">Get 20% off on all seafood dishes today!</p>
                <Button size="sm" variant="outline" className="mt-2 w-full text-xs">
                  View Offer
                </Button>
              </div>
            </div>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
  }

  if (error) return <p>Error: {error}</p>

  const handleRestaurantChange = (restaurant: any) => {
    setActiveRestaurant(restaurant)
    localStorage.setItem("activeRestaurant", JSON.stringify(restaurant))
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const restaurantId: any = activeRestaurant?.uid;

      const newCategory = {
        name: newCategoryName.trim(),
        icon: iconOptions[selectedIcon],  // icon component for UI
        iconKey: selectedIcon,            // icon name (string) for Firestore
        category_id: restaurantId,
      };

      const updatedCategories = [newCategory];
      setCustomCategories(updatedCategories);

      const categoriesToStore: StoredCategory[] = updatedCategories.map((cat) => ({
        name: cat.name || "",
        icon: cat.iconKey as keyof typeof iconOptions,    // For display (not required)
        iconKey: cat.iconKey as keyof typeof iconOptions, // 👈 Required for Firestore
        category_id: cat.category_id || restaurantId,
      }));

      createCategory(restaurantId, categoriesToStore); // Firestore mein bhejna

      setNewCategoryName("");
      setSelectedIcon("Other");
      setDialogOpen(false);
      fetchCategories(); // Refetch after add
    }
  };


  const handleCloseDialog = () => {
    setDialogOpen(false)
    setNewCategoryName("")
    setSelectedIcon("Other")
  }

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }
  console.log(allCategories, "allCategories");

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex h-14 items-center px-4">
          <UtensilsCrossed className="mr-2 h-6 w-6" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center font-bold hover:text-primary focus:outline-none">
                <span>
                  {activeRestaurant?.name
                    ? activeRestaurant.name.charAt(0).toUpperCase() + activeRestaurant.name.slice(1)
                    : "No Restaurant Selected"}
                </span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            {activeRestaurant && activeRestaurant.uid !== activeUser?.uid && (
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem className="text-sm font-medium text-muted-foreground" disabled>
                  Select Restaurant
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {owners?.length ? (
                  owners.map((restaurant) => (
                    <DropdownMenuItem
                      key={restaurant.name}
                      className={cn(
                        "cursor-pointer",
                        String(activeRestaurant.name) === restaurant.name && "font-medium text-primary",
                      )}
                      onClick={() => handleRestaurantChange(restaurant)}
                    >
                      {String(restaurant?.name || "")
                        .charAt(0)
                        .toUpperCase() + String(restaurant?.name || "").slice(1)}{" "}
                      Restaurant
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No restaurants available</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between pr-3">
            <SidebarGroupLabel>Menu Categories</SidebarGroupLabel>
            {activeUser?.uid === activeRestaurant?.uid && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-md"
                title="Add Category"
                onClick={handleOpenDialog}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
          <SidebarMenu>
            {allCategories.map((category: any) => {
              const iconKey = category.icon as keyof typeof iconOptions;
              const IconComponent = iconOptions[iconKey] || iconOptions["Other"];

              return (
                <SidebarMenuItem key={category.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={category.name === activeCategory}
                    onClick={() =>
                      setActiveCategory(category.name === "All Items" ? null : category.name)
                    }
                  >
                    <a href="#" className={cn("flex items-center")}>
                      <IconComponent className="mr-2 h-4 w-4" />
                      <span>{category.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>


        </SidebarGroup>
        {/* Special Offers Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Special Offers</SidebarGroupLabel>
          <div className="px-3 py-2">
            <div className="rounded-md bg-primary/10 p-3 text-sm">
              <h4 className="font-medium text-primary">Today's Special</h4>
              <p className="mt-1 text-xs text-muted-foreground">Get 20% off on all seafood dishes today!</p>
              <Button size="sm" variant="outline" className="mt-2 w-full text-xs">
                View Offer
              </Button>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />

      {/* MUI Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} aria-labelledby="add-category-dialog-title">
        <DialogTitle id="add-category-dialog-title">Add New Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a new menu category for your restaurant. The icon will be automatically selected based on the
            category name.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel id="icon-select-label">Icon</InputLabel>
            <Select
              labelId="icon-select-label"
              id="icon-select"
              value={selectedIcon}
              label="Icon"
              onChange={(e) => setSelectedIcon(e.target.value as keyof typeof iconOptions)}
            >
              {Object.entries(iconOptions).map(([key]) => (
                <MenuItem key={key} value={key} sx={{ display: "flex", alignItems: "center" }}>
                  {React.createElement(iconOptions[key as keyof typeof iconOptions], {
                    style: { marginRight: "8px", width: "20px", height: "20px" },
                  })}
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleAddCategory} variant="default">
            Add Category
          </Button>
        </DialogActions>
      </Dialog>
    </Sidebar>
  )
}

