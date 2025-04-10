"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "./components/ui/button"
import { Card, CardContent } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { ThemeToggle } from "./components/ui/Theme-toggle"
import { Eye, EyeOff } from "lucide-react"
import MuiSnackbar from "./components/ui/MuiSnackbar"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { User } from "../components/comp-manager/types"

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}

export default function SignIn({ className, ...props }: React.ComponentProps<"div">) {
  const { activeUser, setActiveUser } = useAppContext();
  const { setActiveRestaurant } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" })

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 🔹 Step 1: Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Step 2: Firestore se user ka data fetch karein
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        setSnackbar({ open: true, message: "User data not found!", severity: "error" });
        return;
      }
      const userData = userDoc.data() as User; // ✅ Type assertion for TypeScript
      setActiveUser(userData);
      // 🔹 Step 4: Save to LocalStorage for session persistence
      localStorage.setItem("activeUser", JSON.stringify(userData));
      // 🔹 Step 5: Show success message & navigate
      setSnackbar({ open: true, message: "Login Successful! Welcome back.", severity: "success" });
      if (userData.role === "owner") {
        const userDocRef = doc(db, "restaurants", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          setSnackbar({ open: true, message: "User data not found!", severity: "error" });
          return;
        }
        const userData: any = userDoc.data() as User;
        setActiveRestaurant(userData);
        localStorage.setItem("activeRestaurant", JSON.stringify(userData));

        navigate("/dashboard");
      } else {
        navigate("/restaurent-selection");
      }

    } catch (error: any) {
      setSnackbar({ open: true, message: "Login failed: " + error.message, severity: "error" });
    }
  };

  useEffect(() => {
    if (activeUser) {
      if (activeUser?.role === "owner") {
        localStorage.setItem("activeRestaurant", JSON.stringify(activeUser.restaurantName));

        navigate("/dashboard")
      } else if (activeUser?.role === "user") {
        localStorage.setItem("activeRestaurant", JSON.stringify(activeUser));
        navigate("/restaurent-selection")
      }
    } else {
      navigate("/")

    }
  }, [activeUser])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("activeUser");
      const storedOwners = raw && raw !== "undefined" ? JSON.parse(raw) : {};
      setActiveUser(storedOwners);
    } catch (err) {
      console.error("Failed to parse activeUser from localStorage:", err);
      setActiveUser({ role: "", name: "", restaurantName: "", uid: "", email: "" });
    }
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10 dark:bg-gray-900">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">

              <MuiSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity as "success" | "error" | "warning" | "info"}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
              />

              <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      Login to your Acme Inc account
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a onClick={() => { navigate('/signup') }} className="underline underline-offset-4 cursor-pointer">Sign Up</a>
                  </div>
                </div>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6] "
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
