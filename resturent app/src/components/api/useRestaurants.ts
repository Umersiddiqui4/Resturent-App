import { useState, useEffect } from "react";
import { collection,addDoc, setDoc , getDocs } from "firebase/firestore";
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


export const uploadCategoriesToFirestore = async (restaurantId: string, categories: any[]) => {
  try {
    const categoriesCollectionRef = collection(db, "restaurants", restaurantId, "categories"); // Subcollection ka reference

    for (const category of categories) {
      const docRef = await addDoc(categoriesCollectionRef, {
        ...category,
        uid: "", // Temporary UID (Firestore ka generated ID)
      });

      // **Firestore ke generated UID ko update karo**
      await setDoc(docRef, { ...category, uid: docRef.id });

      console.log(`Category '${category.name}' uploaded with UID: ${docRef.id}`);
    }

    console.log("All categories uploaded successfully! ✅");
  } catch (error) {
    console.error("Error uploading categories:", error);
  }
};


export const getCategoriesFromFirestore = async (restaurantId: string) => {
  try {
    const categoriesCollectionRef = collection(db, "restaurants", restaurantId, "categories"); // Subcollection ka reference
    const snapshot = await getDocs(categoriesCollectionRef);

    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Categories fetched successfully: ", categories);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};


