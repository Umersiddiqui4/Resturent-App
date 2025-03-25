"use client"

import { useEffect, useState } from "react"
import { Home, UtensilsCrossed, Coffee, Pizza, Salad, Fish, Beef, Cake, ListFilter, ChevronDown } from "lucide-react"
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
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
import { User } from "../comp-manager/types"

const categories = [
  { name: "All Items", icon: Home },
  { name: "Pizza", icon: Pizza },
  { name: "Pasta", icon: UtensilsCrossed },
  { name: "Salad", icon: Salad },
  { name: "Seafood", icon: Fish },
  { name: "Burgers", icon: Beef },
  { name: "Dessert", icon: Cake },
  { name: "Drinks", icon: Coffee },
  { name: "Other", icon: ListFilter },
]

export function AppSidebar() {
  const { activeCategory, setActiveCategory } = useAppContext()
  const { activeUser } = useAppContext()
  const { owners } = useAppContext()
  const {activeRestaurant, setActiveRestaurant} = useAppContext()
  const [restaurants, setRestaurants] = useState<User[]>()

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const restaurantsCollection = collection(db, "restaurants"); // 🔥 "restaurants" collection ka reference
        const snapshot = await getDocs(restaurantsCollection);
  
        const restaurantList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
  
        setRestaurants(restaurantList); // State update karega
  
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
  
    fetchRestaurants();
  }, []); // 🔥 Empty dependency array taake sirf ek baar chale

  
  useEffect(() => {
    const storedRestaurant = localStorage.getItem("activeRestaurant")
    if (storedRestaurant) {
      setActiveRestaurant(JSON.parse(storedRestaurant))
    }
    setRestaurants(owners)
  }, [activeUser])

  // useEffect(() => {
  //   if (activeRestaurant === "" && activeUser?.restaurantName) {
  //     setActiveRestaurant(activeUser.restaurantName);
  //   }
  // }, [activeUser]);

  const handleRestaurantChange = (restaurant: any) => {
    setActiveRestaurant(restaurant)
    localStorage.setItem("activeRestaurant", JSON.stringify(restaurant))
  }
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex h-14 items-center px-4">
          <UtensilsCrossed className="mr-2 h-6 w-6" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center font-bold hover:text-primary focus:outline-none">
                <span>
                  {activeRestaurant 
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
                {restaurants?.length ? (
                  restaurants.map((restaurant) => (
                    <DropdownMenuItem
                      key={restaurant.name}
                      className={cn(
                        "cursor-pointer",
                        (String(activeRestaurant.name)) === restaurant.name &&
                        "font-medium text-primary",
                      )}
                      onClick={() => handleRestaurantChange(restaurant)}
                    >
                      {(String(restaurant?.name || "").charAt(0).toUpperCase() + String(restaurant?.name || "").slice(1))} Restaurant
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
          <SidebarGroupLabel>Menu Categories</SidebarGroupLabel>
          <SidebarMenu>
            {categories.map((category) => (
              <SidebarMenuItem key={category.name}>
                <SidebarMenuButton
                  asChild
                  isActive={category.name === activeCategory}
                  onClick={() => setActiveCategory(category.name)}
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

