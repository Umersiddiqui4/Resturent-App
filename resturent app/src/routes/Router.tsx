import LoginForm from "@/components/SignIn-form";
import { RegisterForm } from "../components/Register-form";
import { RestaurantMenu } from "@/components/components/restaurant-menu";
import { Routes, Route } from "react-router-dom";
import RestaurentSelection from "@/components/RestaurentSelection";
  import Customer from "@/components/Customer";

export default function AppRouter() {

  return (
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<RestaurantMenu />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/restaurent-selection" element={<RestaurentSelection />} />
      </Routes>
  );
}
