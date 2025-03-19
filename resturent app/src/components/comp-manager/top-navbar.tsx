import { useEffect, useState } from "react"
import { Bell, Moon, Search, Settings, Sun, User, X } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu-nav"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { useTheme } from "./theme-provider"
import { useAppContext } from "@/context/appContext"
import { useNavigate } from "react-router-dom"



interface TopNavbarProps {
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void
  searchQuery?: string
}
interface User {
  name?: string;
}

export function TopNavbar({ onSearch, searchQuery = "" }: TopNavbarProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileName, setProfileName] = useState("");

const { activeUser, setActiveUser } = useAppContext();

useEffect(() => {
  if (activeUser?.name) {
    const nameParts = activeUser.name.split(" "); // نام کو space پر توڑیں
    const initials =
      nameParts.length > 1
        ? nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase()
        : nameParts[0].charAt(0).toUpperCase();
    
    setProfileName(initials);
  }
}, [activeUser]);



function logOut() {
  localStorage.removeItem("activeRestaurant"); // User data remove کریں
  localStorage.removeItem("activeUser"); // User data remove کریں
  setActiveUser(null); // Context سے بھی user ہٹا دیں
  navigate("/signin")
}

  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        {searchOpen ? (
          <div className="flex items-center">
            <Input
              className="h-9 w-[200px] md:w-[300px]"
              placeholder="Search menu items..."
              autoFocus
              value={searchQuery}
              onChange={onSearch}
            />
            <Button
              variant="ghost"
              size="icon"
              className="ml-1"
              onClick={() => {
                if (onSearch) {
                  const event = { target: { value: "" } } as React.ChangeEvent<HTMLInputElement>
                  onSearch(event)
                }
                setSearchOpen(false)
              }}
            >
              <span className="sr-only">Clear search</span>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(true)}>
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>{profileName ? profileName : "?" }</AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logOut}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

