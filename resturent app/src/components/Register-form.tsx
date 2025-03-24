"use client"
import { auth, db } from "../firebase/firebaseConfig";
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./components/ui/button"
import { Card, CardContent } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { ThemeToggle } from "./components/ui/Theme-toggle"
import { Eye, EyeOff } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import MuiSnackbar from "./components/ui/MuiSnackbar"
import { useAppContext } from "../context/AppContext"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}
interface snak {
  open: boolean
  message: string
  severity: string
}

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState<"user" | "owner">("user")
  const [snackbar, setSnackbar] = useState<snak>({ open: false, message: "", severity: "info" })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    restaurantName: "",
    role: accountType
  })
  const { setActiveUser } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 🛑 Step 1: Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // ✅ Step 2: Firestore mein user data store karein
      const userData = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: accountType, // Default role (change if needed)
        createdAt: new Date(), // Timestamp for tracking
        restaurantName: formData.restaurantName,
      };
      localStorage.setItem("activeRestaurant", JSON.stringify(userData.restaurantName));
      localStorage.setItem("activeUser", JSON.stringify(userData));


      await setDoc(doc(db, "users", user.uid), userData);

      // ✅ Step 3: Firestore se user data fetch karein
      const userDoc: any = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        setActiveUser(userDoc.data());
        setSnackbar({ open: true, message: "Registration successful! Redirecting...", severity: "success" });

        setTimeout(() => {
          if (userData.role === "owner") {
            navigate("/dashboard");
          } else {
            navigate("/restaurent-selection");
          }
        }, 500);
      } else {
        setSnackbar({ open: true, message: "User data not found in Firestore!", severity: "error" });
      }
    } catch (error: any) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    }
  };

  console.log(accountType);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10 dark:bg-gray-900">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">

              {/* MUI Snackbar Component */}
              <MuiSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity as "success" | "error" | "warning" | "info"}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
              />

              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="text-balance text-muted-foreground">Sign up to get started with Acme Inc</p>
                  </div>

                  <Tabs defaultValue="user" className="w-full" onValueChange={(value) => setAccountType(value as "user" | "owner")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="user">User</TabsTrigger>
                      <TabsTrigger value="owner">Restaurant Owner</TabsTrigger>
                    </TabsList>

                    {/* 👤 Normal User Registration */}
                    <TabsContent value="user">
                      <form className="flex flex-col gap-4 mt-4" onSubmit={handleRegister}>
                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="password">Password</Label>
                          <div className="relative">
                            <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required />
                            <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <Button type="submit" className="w-full mt-2">Create Account</Button>
                      </form>
                    </TabsContent>

                    {/* 🍽️ Restaurant Owner Registration */}
                    <TabsContent value="owner">
                      <form className="flex flex-col gap-4 mt-4" onSubmit={handleRegister}>
                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="restaurantName">Restaurant Name</Label>
                          <Input id="restaurantName" name="restaurantName" type="text" value={formData.restaurantName} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="password">Password</Label>
                          <div className="relative">
                            <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required />
                            <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <Button type="submit" className="w-full mt-2">Create Owner Account</Button>

                      </form>
                    </TabsContent>
                  </Tabs>
                  <div className="text-center text-sm">
                    Already have an account? <a onClick={() => { navigate('/') }} className="underline underline-offset-4 cursor-pointer ">Sign In</a>
                  </div>
                </div>
              </div>
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
