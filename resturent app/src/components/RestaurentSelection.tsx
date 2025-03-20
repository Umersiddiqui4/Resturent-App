"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RestaurentSelection() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [owners, setOwners] = useState<{ restaurantName: string }[]>([]);
  const navigate = useNavigate();
  const [value, setValue] = useState("")

  // Fixed restaurant images
  const images = [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.squarespace-cdn.com/content/v1/61d2ccabbc553c1fec7c16e9/1710783697256-KVOWMG2EKE1PMJ4NXGBJ/DSC_4094.jpg?format=2500w",
    "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
    "https://roerestaurant.co.uk/wp-content/uploads/2024/06/e5dba8c1-7bf4-4a38-8e55-e459a7a6ef70-2.webp",
    "https://thethekedaar.in/blogs/wp-content/uploads/2021/03/Restaurant-Interior.jpg",
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/ea/23/5d/zeeyara-terrace.jpg?w=900&h=500&s=1",
    "https://www.tinbuilding.com/wp-content/uploads/2024/09/download-6-scaled-920x518.webp",
    "https://assets.architecturaldigest.in/photos/6385cf3311f0276636badfb6/16:9/w_1280,c_limit/DSC_8367-Edit-W.png",
    "https://assets.architecturaldigest.in/photos/64f85037ec0bc118bdd98aba/master/pass/Untitled%20design%20(14).png",
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/c2/ff/0b/marcopolo.jpg?w=600&h=-1&s=1",
  ];

  useEffect(() => {
    const storedOwners = JSON.parse(localStorage.getItem("owners") || "[]");
    setOwners(storedOwners);
  }, []);

  const handleImageClick = (image: string, owner: any ) => {
    setBackgroundImage(image);
    setValue(owner.restaurantName)
    localStorage.setItem("activeRestaurant", JSON.stringify(owner.restaurantName));
    
  };

  return (
    <div
      className="min-h-screen transition-all duration-1000 ease-in-out  p-4 md:p-8"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: backgroundImage ? undefined : "#f5f5f5",
      }}
    >
      <div className="container mx-auto transition-all duration-700 ">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 text-white transition-colors duration-700 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Select a Restaurant
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 backdrop-blur-sm bg-white/10 p-4 md:p-6 rounded-xl">
          {owners.map((owner, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => handleImageClick(images[index % images.length], owner)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70" />
              <img
                src={images[index % images.length]}
                alt={owner.restaurantName}
                className="absolute inset-0 w-full h-full object-cover "
              />
              <div className="absolute bottom-2 left-2 text-white text-lg  font-bold z-10 backdrop-blur-sm">
              {owner.restaurantName.charAt(0).toUpperCase() + owner.restaurantName.slice(1)} Restaurant
              </div>
            </div>
          ))}
        </div>

        {backgroundImage && (
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-4 py-2 bg-white/100 hover:bg-white text-black rounded-md font-bold  transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            {value ? value.charAt(0).toUpperCase() + value.slice(1) : "Select plzz.."}
          </button>
        )}
      </div>
    </div>
  );
}

export default RestaurentSelection;
