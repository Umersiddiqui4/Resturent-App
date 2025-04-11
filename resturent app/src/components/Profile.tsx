import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "./lib/supabaseClient"; // Supabase client import
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // Firebase config import
import { FloatingPaths } from "./components/FloatingPaths";
import { Sparkles } from "lucide-react";

export default function ProfileForm() {
    const { activeUser, setActiveUser } = useAppContext();
    const [name, setName] = useState(activeUser?.name || "");
    const [avatar, setAvatar] = useState(activeUser?.avatar || "");
    const [imageFile, setImageFile] = useState<any>(null);

    useEffect(() => {
        const storedOwnersRaw = localStorage.getItem("activeUser");
        setActiveUser(JSON.parse(storedOwnersRaw || "{}"));
    
      
    }, [setActiveUser]);

    if (!activeUser) {
        return  <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
        <div className="absolute inset-0">
            <FloatingPaths position={1} />
            <FloatingPaths position={-1} />
        </div>
       
    </div>; // or a loading spinner
        
    }
    
    // Handle image selection
    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };
    console.log(activeUser, "activeUser");


    // Handle save changes (update Firestore and Supabase)
    const handleSave = async () => {
        let newAvatar = avatar;

        if (imageFile) {
            // Make the file name unique by adding a timestamp
            const filePath = `images/${imageFile?.name}`
            // Upload image to Supabase Storage with a unique file name
            const { data, error } = await supabase.storage
                .from("restaurant-images") // "avatars" bucket name
                .upload(filePath, imageFile);

            if (error) {
                console.error("Error uploading file: ", error);
                return;
            }

            // Get the public URL for the uploaded image
            newAvatar = supabase.storage.from("restaurant-images").getPublicUrl(data.path).data.publicUrl;
        }

        const updatedUser: any = { ...activeUser, name, avatar: newAvatar };

        // Update Firestore document
        if (!activeUser?.uid) {
            console.error("User ID is undefined");
            return;
        }

        const userDocRef = doc(db, "users", activeUser.uid);
        await updateDoc(userDocRef, {
            name: name,
            avatar: newAvatar,
        });

        // Update activeUser state and localStorage
        setActiveUser(updatedUser);
        localStorage.setItem("activeUser", JSON.stringify(updatedUser));
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>
            <div className="w-full z-10 max-w-2xl mx-auto space-y-8 p-6 bg-white/70 m-2 dark:bg-zinc-950/50 backdrop-blur-xs rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
                <div className="flex items-center justify-center gap-6">
                    <Avatar className="h-24 w-24 rounded-full border-2 border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
                        <AvatarImage src={activeUser?.avatar} className="rounded-full object-cover" />
                        <AvatarFallback className="bg-zinc-100 dark:bg-zinc-900">SC</AvatarFallback>
                    </Avatar>
                    <Button
                        variant="outline"
                        className="h-24 w-24 rounded-full border-2 border-dashed border-zinc-200/80 dark:border-zinc-800/80 
                             hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50
                             transition-colors shadow-sm"
                    >
                        <Sparkles className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                    </Button>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 w-full text-center text-sm hover:cursor-pointer">
                    Upload / Generate a new avatar
                </p>

                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-300">
                            Display Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="off"
                            className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80
                                 focus:border-zinc-300 dark:focus:border-zinc-700
                                 focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-800
                                 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="Role" className="text-zinc-700 dark:text-zinc-300">
                            Role
                        </Label>
                        <Input
                            id="username"
                            placeholder="@username"
                            value={activeUser?.role}
                            autoComplete="off"
                            disabled
                            className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80
                                 focus:border-zinc-300 dark:focus:border-zinc-700
                                 focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-800
                                 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="Email" className="text-zinc-700 dark:text-zinc-300">
                            Email
                        </Label>
                        <Input
                            id="Email"
                            placeholder="Email"
                            value={activeUser?.email}
                            autoComplete="off"
                            disabled
                            className="bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/80
                                 focus:border-zinc-300 dark:focus:border-zinc-700
                                 focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-800
                                 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="avatar" className="text-zinc-700 dark:text-zinc-300">
                            Avatar (Image)
                        </Label>
                        <input
                            type="file"
                            id="avatar"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80
                                 focus:border-zinc-300 dark:focus:border-zinc-700
                                 focus:ring-1 focus:ring-zinc-200 dark:focus:ring-zinc-800"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <Button
                        variant="outline"
                        className="border-zinc-200/80 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
