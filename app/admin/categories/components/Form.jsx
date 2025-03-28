"use client";

import { createNewCategory } from "@/lib/firestore/categories/write";
import { Button } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Form() {
    const [data, setData] = useState(null);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const handleData = (key, value) => {
        setData((preData) => ({
            ...(preData ?? {}),
            [key]: value,
        }));
    };

    // Check form validity
    useEffect(() => {
        setIsFormValid(data?.name && data?.slug && image);
    }, [data, image]);

    const handleCreate = async () => {
        setIsLoading(true);
        try {
            await createNewCategory({ data: data, image: image });
            toast.success("Successfully created");

            setData(null);
            setImage(null);
            document.getElementById("category-image").value = null;
        } catch (error) {
            toast.error(error?.message || "An error occurred");
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col gap-3 bg-white rounded-xl p-5 w-30 md:w-[400px]">
            <h1 className="font-semibold">{id ? "Update" : "Create"} Category</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleCreate();
                }}
                className="flex flex-col gap-3"
            >
                <div className="flex flex-col gap-1">
                    <label htmlFor="category-image" className="text-gray-500 text-sm">
                        Image <span className="text-red-500">*</span>
                    </label>
                    {image && (
                        <div className="flex justify-center items-center p-3">
                            <img className="h-20" src={URL.createObjectURL(image)} alt="Category Preview" />
                        </div>
                    )}
                    <input
                        onChange={(e) => {
                            if (e.target.files.length > 0) {
                                const file = e.target.files[0];
                                const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic"];
                                
                                if (validTypes.includes(file.type)) {
                                    setImage(file);
                                } else {
                                    toast.error("Invalid file type. Only JPG, JPEG, PNG, and HEIC are allowed.");
                                    e.target.value = null;
                                }
                            }
                        }}
                        id="category-image"
                        name="category-image"
                        type="file"
                        className="border px-4 rounded-lg w-full focus:outline"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="category-name" className="text-gray-500 text-sm">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="category-name"
                        name="category-name"
                        type="text"
                        placeholder="Enter Name"
                        value={data?.name ?? ""}
                        onChange={(e) => handleData("name", e.target.value)}
                        className="border px-4 rounded-lg w-full focus:outline"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="category-slug" className="text-gray-500 text-sm">
                        Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="category-slug"
                        name="category-slug"
                        type="text"
                        placeholder="Enter Slug"
                        value={data?.slug ?? ""}
                        onChange={(e) => handleData("slug", e.target.value)}
                        className="border px-4 rounded-lg w-full focus:outline"
                    />
                </div>

                <Button 
                    isLoading={isLoading} 
                    isDisabled={!isFormValid || isLoading} 
                    type="submit" 
                    className={isFormValid ? "bg-blue-500" : "bg-gray-300"}
                >
                    Create
                </Button>
            </form>
        </div>
    );
}
