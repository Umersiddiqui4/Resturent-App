"use client"

import { useState } from "react"
import { Home, UtensilsCrossed, Coffee, Pizza, Salad, Fish, Beef, Cake, ChevronDown ,ListFilter} from "lucide-react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu-nav"
import { useAppContext } from "@/context/appContext"

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
  const {activeCategory, setActiveCategory} = useAppContext()
  const { activeUser, setActiveUser } = useAppContext();
  
  

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex h-14 items-center px-4">
          <UtensilsCrossed className="mr-2 h-6 w-6" />
          <span className="font-bold">
          {activeUser && activeUser.restaurantName
    ? activeUser.restaurantName.charAt(0).toUpperCase() + activeUser.restaurantName.slice(1) + " Restaurant"
    : "No Restaurant Available"}
</span>


          {/* Add a dropdown menu to test our fix */}
         
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

