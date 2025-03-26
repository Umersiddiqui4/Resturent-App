import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; 
import { useAppContext } from "@/context/AppContext";

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setOwners } = useAppContext()

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const restaurantsCollection = collection(db, "restaurants");
        const snapshot = await getDocs(restaurantsCollection);
        const restaurantList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as any),
        }));

        setRestaurants(restaurantList);
        setOwners(restaurantList)
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Failed to fetch restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return { restaurants, loading, error };
}
