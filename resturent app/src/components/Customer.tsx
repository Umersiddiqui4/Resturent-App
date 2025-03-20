"use client"

import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "./components/ui/avatar"
import { Card, CardContent } from "./components/ui/card"
import { Separator } from "./components/ui/separator"
import { Star } from "lucide-react"

interface Review {
  id: string;
  userName: string;
  userInitials: string;
  userImage?: string;
  rating: number;
  date: string;
  comment: string;
}

interface CustomerReviewsProps {
  reviews?: Review[]
  title?: string
}
interface Dish {
  name: string;
  description: string;
  price: number;
  image: string;
}
interface Feedback {
  id: number;
  user: string;
  rating: number;
  comment: string;
  selectedDish: Dish
}

export default function Customer({
  reviews = defaultReviews,
  title = "Customer Reviews",
}: CustomerReviewsProps) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-preference")

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark")
      }
    }
  }, [])

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const storedFeedback = localStorage.getItem("feedback");
    if (storedFeedback) {
      setFeedbacks(JSON.parse(storedFeedback));
    }
  }, []);





  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8 transition-colors duration-200 bg-background text-foreground">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold">
          {title} ({reviews.length})
        </h2>
      </div>

      <div className="space-y-4 md:space-y-6">
      {feedbacks && Object.keys(feedbacks).length > 0 ? (
  Object.values(feedbacks).map((review, index) => (
          <div key={review.id}>
            <Card className="overflow-hidden border dark:border-gray-700">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <Avatar className="h-10 w-10 border dark:border-gray-600 shrink-0">
                    <AvatarImage src={review?.selectedDish?.image} alt={review.selectedDish.name} />
                    
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-medium">{review.selectedDish.name}</h3>
                        {/* <p className="text-xs sm:text-sm text-muted-foreground">{review.date}</p> */}
                      </div>

                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400 dark:fill-yellow-300 dark:text-yellow-300"
                                : "fill-muted stroke-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm md:text-base leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {index < reviews.length - 1 && <Separator className="my-4 md:my-6 md:hidden" />}
          </div>
       ))
      ) : (
        <p>No feedback available.</p>
)}
      </div>
    </div>
  )
}

// Sample data for demonstration
const defaultReviews: Review[] = [
  {
    id: "1",
    userName: "Sarah Johnson",
    userInitials: "SJ",
    rating: 5,
    date: "March 15, 2025",
    comment:
      "This product exceeded my expectations! The quality is outstanding and it arrived earlier than expected. I've already recommended it to several friends.",
  },
  {
    id: "2",
    userName: "Michael Chen",
    userInitials: "MC",
    rating: 4,
    date: "March 10, 2025",
    comment:
      "Very good product overall. The only reason I'm not giving 5 stars is because the color is slightly different from what was shown in the pictures. Otherwise, it works perfectly and the customer service was excellent.",
  },
  {
    id: "3",
    userName: "Emily Rodriguez",
    userInitials: "ER",
    rating: 3,
    date: "March 5, 2025",
    comment:
      "Decent product for the price. Shipping was fast and the packaging was secure. It does what it's supposed to do, but I think there are better options available if you're willing to spend a bit more.",
  },
  {
    id: "4",
    userName: "David Wilson",
    userInitials: "DW",
    rating: 5,
    date: "February 28, 2025",
    comment:
      "Absolutely love this! It's exactly what I was looking for and the quality is top-notch. The attention to detail is impressive and it's clear that a lot of thought went into the design. Will definitely purchase from this company again.",
  },
]

