import { db } from "../../firebase/firebaseConfig"; // Tumhari Firebase configuration
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

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
  category_id: string; // Make sure category_id is required
}




// Function to Add Items to an Existing Category
const uploadItemsToCategory = async (restaurantId: string, categories: Category[]) => {
  if (!Array.isArray(categories)) {
    throw new Error("The 'categories' parameter must be an array.");
  }

  try {
    await Promise.all(
      categories.map(async (category) => {
        if (!category.category_id) {
          throw new Error("Each category must have a valid 'category_id'.");
        }

        // Step 1: Get the existing category from Firestore
        const categoryRef = doc(db, `restaurants/${restaurantId}/categories/${category.category_id}`);
        const categorySnapshot = await getDoc(categoryRef);

        if (!categorySnapshot.exists()) {
          throw new Error(`Category with ID ${category.category_id} does not exist.`);
        }

        // Step 2: Add items to the existing category if they exist
        if (category.items && category.items.length > 0) {
          const itemsCollectionRef = collection(db, `restaurants/${restaurantId}/categories/${category.category_id}/items`);

          await Promise.all(
            category.items.map(async (item) => {
              // Add the item to Firestore in the existing category
              await setDoc(doc(itemsCollectionRef), item);
            })
          );
        }
      })
    );

    console.log("Items added to the existing categories successfully!");
  } catch (error) {
    console.error("Error adding items to categories: ", error);
  }
};


// Function to Create a New Category
const createCategory = async (restaurantId: string, newCategories: Category[]) => {
  console.log("Creating categories: ", newCategories);
  
  if (!Array.isArray(newCategories) || newCategories.length === 0) {
    throw new Error("newCategories must be a non-empty array.");
  }

  try {
    // Step 1: Loop through the array of categories
    await Promise.all(
      newCategories.map(async (category) => {
        if (!category.name) {
          throw new Error("Each category must have a valid name.");
        }

        // Step 2: Reference to the "categories" collection for the given restaurant
        const categoryRef = doc(collection(db, `restaurants/${restaurantId}/categories`));

        // Step 3: Add the new category to Firestore
        await setDoc(categoryRef, {
          name: category.name,
          iconKey: category.iconKey || "",  // Optional, will use empty string if not provided
          category_id: category.category_id || categoryRef.id,  // Use provided category_id or auto-generate
        });

        console.log(`New category "${category.name}" created successfully!`);
      })
    );
  } catch (error) {
    console.error("Error creating categories: ", error);
  }
};


export {uploadItemsToCategory, createCategory};
