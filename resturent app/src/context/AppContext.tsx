import { createContext, useContext, useState, ReactNode } from "react";
import { User, Restaurent } from "../components/comp-manager/types";

interface AppContextType {
  activeUser: User | null;
  setActiveUser: (user: User | null) => void;
  activeCategory: any | null;
  setActiveCategory: (category: string | null) => void;
  activeRestaurant: Restaurent | null;
  setActiveRestaurant: (restaurant: Restaurent | null) => void;
  owners: User[];
  setOwners: (owners: User[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurent | null>(null);
  const [owners, setOwners] = useState<User[]>([]);

  return (
    <AppContext.Provider value={{
      activeUser, setActiveUser,
      activeCategory, setActiveCategory,
      activeRestaurant, setActiveRestaurant,
      owners, setOwners
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
