import { createContext, useContext, useState, ReactNode } from "react";

// 1️⃣ Context ka Type Define karna zaroori hai (TypeScript me)
interface AppContextType {
    activeUser: string | null;
  setActiveUser: (user: string | null) => void;
}

// 2️⃣ Default Value (Initial State)
const AppContext = createContext<AppContextType | undefined>(undefined);

// 3️⃣ Context Provider Component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeUser, setActiveUser] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </AppContext.Provider>
  );
};

// 4️⃣ Custom Hook for using Context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
