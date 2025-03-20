import { ThemeProvider } from "./components/comp-manager/theme-provider"
import AppRouter from "./routes/Router"

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="restaurant-theme">
      <AppRouter />
    </ThemeProvider>
  )
}
