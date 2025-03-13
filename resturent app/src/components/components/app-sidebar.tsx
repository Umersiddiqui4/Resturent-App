import { Home, UtensilsCrossed, Coffee, Pizza, Salad, Fish, Beef, Cake } from "lucide-react"
import { cn } from "../../lib/utils"
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

const categories = [
  { name: "All Items", icon: Home },
  { name: "Pizza", icon: Pizza },
  { name: "Pasta", icon: UtensilsCrossed },
  { name: "Salad", icon: Salad },
  { name: "Seafood", icon: Fish },
  { name: "Burgers", icon: Beef },
  { name: "Dessert", icon: Cake },
  { name: "Drinks", icon: Coffee },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex h-14 items-center px-4">
          <UtensilsCrossed className="mr-2 h-6 w-6" />
          <span className="font-bold">Gourmet Restaurant</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Categories</SidebarGroupLabel>
          <SidebarMenu>
            {categories.map((category, index) => (
              <SidebarMenuItem key={category.name}>
                <SidebarMenuButton asChild isActive={index === 0}>
                  <a href="#" className={cn("flex items-center")}>
                    <category.icon className="mr-2 h-4 w-4" />
                    <span>{category.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

