import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Tumhari Firebase config ka import

const fetchCategoriesAndItems = async (restaurantId: string) => {
  try {
    const categoriesRef = collection(db, `restaurants/${restaurantId}/categories`);
    const categorySnapshot = await getDocs(categoriesRef);

    const categories = await Promise.all(
      categorySnapshot.docs.map(async (categoryDoc) => {
        const categoryData = categoryDoc.data();
        const categoryId = categoryDoc.id;

        // Step 2: Fetch items inside each category
        const itemsRef = collection(db, `restaurants/${restaurantId}/categories/${categoryId}/items`);
        const itemsSnapshot = await getDocs(itemsRef);

        const items = itemsSnapshot.docs.map((itemDoc) => ({
          id: itemDoc.id,
          ...itemDoc.data(),
        }));

        return {
          id: categoryId,
          ...categoryData,
          items,
        };
      })
    );
    console.log("Fetched categories and items: ", categories);
    return categories;
  } catch (error) {
    console.error("Error fetching categories and items: ", error);
    return [];
  }
};

export default fetchCategoriesAndItems;



