"use client"

import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "./components/ui/avatar";
import { Card, CardContent } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { Star } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { DishCard } from "./components/dish-card-feedback";

interface Dish {
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Feedback {
  id: string;
  user: {
    name: string;
    email: string;
    role: string;
    uid: string;
  };
  rating: number;
  comment: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  selectedDish: Dish;
  dishId: string;
}

export default function CustomerReviews() {
  const [storedFeedbackId, setStoredFeedbackId] = useState<string | null>(null);
  const [selectedDishFeedbacks, setSelectedDishFeedbacks] = useState<Feedback[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const imageUrls = [
    "https://lh3.googleusercontent.com/o4LgaHPHAOBOa_SEi1PywFSN5OLt-1-wSW0DdzyhN93ecj42bSLgFFcXAaY3qf9S01vRAYy-gk-YZ5jWRXVbkRsLOGY=s274",
    "https://lh3.googleusercontent.com/maTUQ3Ta1FoqleO_3xL8TKkFg9kEh5_H_EncsHkk9Bfkeqi6n3cZt39tngZH4DxjbB4fHW2B09aBC2NVOGqgQzoMjg=s274",
    "https://lh3.googleusercontent.com/wTpHV8D9ClLAVLv9L7iWhXovWhiEJGOYuSInCaX3Mr-Uf9DO_Z2PtBTtkeiFnxdBErHyM8ZkqgjTD5s-_kob7ETPZQ=s274",
    "https://lh3.googleusercontent.com/ZqSxpU7fblRYQOwqqBa2SO4sCY7NJozzKNncnxj1P8uCKrDWHuU9qqmmaRoH4FgH0qnTjSP6AEwDVqw8hdMF-wou=s274",
    "https://lh3.googleusercontent.com/nCDf_xgCbqq4oj13H-JiiJirvNT0Ryw3ja2L8L-Ee7MKKkPpo1HVR96YEonHL3kEjEoXZw_hLgS337igGMdMBR8YrQ=s274",
    "https://lh3.googleusercontent.com/xEaWGLkuu-l8lARoV0kSXu1DsqwSB-Iv0c7TMHYfwNJ1yundZzNKtXB2ga3W2g1VFe9EeiE7JnPq8IMgYr_6oKfT6L4=s274",
    "https://lh3.googleusercontent.com/LAhteYg76zIknMeQoDOQ24LuUxj5y2ssuCpwuP4R9_mZQaLUYWEiPjfEtvQIygr7GJzQZIuBIm_kN0g8tRAXTNoztjc=s274",
    "https://lh3.googleusercontent.com/EqL-hRovyAIqH3l472FzU-97GTX_xIPz6bdV7YJXx6M_lgRPi6KluCkXqlJd5AAm0euUJNJvpSjAmcNWw7xtdBhs6w=s274",
    "https://lh3.googleusercontent.com/zw40mVwEu2KBDKJQSDtL7mDkol1xDiB3CxIObJXlcmKsSB85GDD8STSrzQe7ZWGu6mNb608ETrT1L4CYINrjY9AJ=s248",
    "https://lh3.googleusercontent.com/lNXUwGZf6b2_brqsNLOgvziyB4bi5S7BDcxvM9gT292KoayzU0kQs7tlklMEOIg-i1n2p92rlor8FV1quAz1rehB=s248"
  ];

  useEffect(() => {
    const savedId = localStorage.getItem("feedbackId")?.trim();

    if (savedId) {
      setStoredFeedbackId(savedId);
      console.log(selectedDish, "selectedDish");
      
    }
  }, []);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!storedFeedbackId) return;

      try {
        const feedbackRef = collection(db, "dishFeedback", storedFeedbackId, "comments");
        const querySnapshot = await getDocs(feedbackRef);

        const feedbackList: Feedback[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Feedback[];

        setSelectedDishFeedbacks(feedbackList);

        if (feedbackList.length > 0) {
          setSelectedDish(feedbackList[0].selectedDish);
        }

      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, [storedFeedbackId]);
  console.log(selectedDishFeedbacks, "selectedDishFeedbacks");
  
  

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8 transition-colors duration-200 bg-background text-foreground">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold">
          Customer Reviews ({selectedDishFeedbacks.length})
        </h2>
      </div>

      {selectedDishFeedbacks[0]?.dishId && (
        <DishCard dish={selectedDishFeedbacks[0]?.dishId} />
      )}




      <div className="space-y-4 md:space-y-6">
        {selectedDishFeedbacks.length > 0 ? (
          selectedDishFeedbacks.map((review: any, index) => (
            <div key={review.id}>
              <Card className="overflow-hidden border dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex sm:flex-row sm:items-start gap-4">
                    <Avatar className="h-20 w-20 border dark:border-gray-600 shrink-0">
                      <AvatarImage
                        src={review?.user?.avatar ? review?.user?.avatar : imageUrls[index % imageUrls.length]}
                        alt={review.user?.name || "Anonymous"}
                      />
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="font-medium">
                            {review.user?.name || "Anonymous"}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {review.createdAt?.seconds
                              ? new Date(review.createdAt.seconds * 1000).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>

                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${i < review.rating
                                ? "fill-yellow-400 text-yellow-400 dark:fill-yellow-300 dark:text-yellow-300"
                                : "fill-muted stroke-muted-foreground"
                                }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-lg sm:text-2xl md:xl leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {index < selectedDishFeedbacks.length - 1 && (
                <Separator className="my-4 md:my-6 md:hidden" />
              )}
            </div>
          ))
        ) : (
          <p>No feedback available.</p>
        )}
      </div>
    </div>
  );
}
