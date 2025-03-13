import LoginForm from "@/components/SignIn-form";
import { RegisterForm } from "../components/Register-form";
import { RestaurantMenu } from "@/components/restaurant-menu";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RestaurantMenu />} />
        <Route path="/signin" element={<LoginForm />} />
        <Route path="/signup" element={<RegisterForm />} />
      </Routes>
    </Router>
  );
}
