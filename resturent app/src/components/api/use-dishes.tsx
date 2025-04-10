"use client"

import { useState, useEffect } from "react"
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../../firebase/firebaseConfig"
import type { Dish } from "../comp-manager/types"

export function useDishes(restaurantId: string, categoryId?: string) {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch dishes
  const fetchDishes = async () => {
    if (!restaurantId) return

    setLoading(true)
    setError(null)

    try {
      let dishesQuery

      if (categoryId) {
        // Fetch dishes for a specific category
        dishesQuery = query(
          collection(db, "restaurants", restaurantId, "categories", categoryId, "dishes"),
          orderBy("displayOrder"),
        )
      } else {
        // Fetch all dishes for the restaurant
        dishesQuery = query(
          collection(db, "dishes"),
          where("restaurantId", "==", restaurantId),
          orderBy("displayOrder"),
        )
      }

      const snapshot = await getDocs(dishesQuery)
      const dishesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Dish[]

      setDishes(dishesData)
    } catch (err) {
      console.error("Error fetching dishes:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch dishes"))
    } finally {
      setLoading(false)
    }
  }

  // Add a dish
  const addDish = async (newDish: Omit<Dish, "id" | "displayOrder" | "createdAt">) => {
    if (!restaurantId) throw new Error("Restaurant ID is required")

    try {
      const categoryId = newDish.category

      if (!categoryId) throw new Error("Category ID is required")

      const dishesRef = collection(db, "restaurants", restaurantId, "categories", categoryId, "dishes")

      // Get the highest display order
      const maxDisplayOrder = dishes.length > 0 ? Math.max(...dishes.map((d) => d.displayOrder ?? 0)) : 0

      const dishData = {
        ...newDish,
        restaurantId,
        displayOrder: maxDisplayOrder + 1,
        createdAt: serverTimestamp(),
      }

      const docRef = await addDoc(dishesRef, dishData)

      const addedDish: Dish = {
        ...dishData,
        id: docRef.id,
        displayOrder: maxDisplayOrder + 1,
        createdAt: new Date().toISOString(),
      }

      setDishes((prev) => [...prev, addedDish])
      return addedDish
    } catch (err) {
      console.error("Error adding dish:", err)
      throw err
    }
  }

  // Update a dish
  const updateDish = async (id: string, updates: Partial<Dish>) => {
    try {
      const dishRef = doc(db, "dishes", id)
      await updateDoc(dishRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })

      setDishes((prev) => prev.map((dish) => (dish.id === id ? { ...dish, ...updates } : dish)))

      return { id, ...updates }
    } catch (err) {
      console.error("Error updating dish:", err)
      throw err
    }
  }

  // Delete a dish
  const deleteDish = async (id: string) => {
    try {
      const dishRef = doc(db, "dishes", id)
      await deleteDoc(dishRef)

      setDishes((prev) => prev.filter((dish) => dish.id !== id))
      return id
    } catch (err) {
      console.error("Error deleting dish:", err)
      throw err
    }
  }

  // Reorder dishes
  const reorderDishes = async (reorderedDishes: Dish[]) => {
    try {
      const batch = writeBatch(db)

      reorderedDishes.forEach((dish, index) => {
        const dishRef = doc(db, "dishes", dish.id)
        batch.update(dishRef, { displayOrder: index + 1 })
      })

      await batch.commit()

      setDishes(
        reorderedDishes.map((dish, index) => ({
          ...dish,
          displayOrder: index + 1,
        })),
      )

      return reorderedDishes
    } catch (err) {
      console.error("Error reordering dishes:", err)
      throw err
    }
  }

  // Load dishes on mount and when dependencies change
  useEffect(() => {
    if (restaurantId) {
      fetchDishes()
    }
  }, [restaurantId, categoryId])

  return {
    dishes,
    loading,
    error,
    fetchDishes,
    addDish,
    updateDish,
    deleteDish,
    reorderDishes,
  }
}

