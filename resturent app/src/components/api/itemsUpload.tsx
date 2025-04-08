import { db } from "../../firebase/firebaseConfig"; // Tumhari Firebase configuration
import { collection, doc, setDoc } from "firebase/firestore";

interface Item {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

interface Category {
  name: string;
  iconKey?: string;
  items?: Item[];
  category_id?: string;
}

// Function to Upload Multiple Categories
const uploadCategoriesWithItems = async (restaurantId: string, categories: Category[]) => {
  try {
    await Promise.all(
      categories.map(async (category) => {
        
        // Step 2: Agar items hain to unko bhi upload karo
          const itemsCollectionRef = collection(db, `restaurants/${restaurantId}/categories/${categoryRef.id}/items`);
          
          await Promise.all(
            category.map(async (item) => {
              await setDoc(doc(itemsCollectionRef), item);
            })
          );
      })
    );

    console.log("All categories and items uploaded successfully!");
  } catch (error) {
    console.error("Error uploading categories and items: ", error);
  }
};

export default uploadCategoriesWithItems;
