"use client";

import {BACKEND_API_BASE_URL} from "@/constants";
import {ImageCard} from "@/components/image-card";
import {useSharedTransition} from "@/hooks/use-shared-transition";
import {CardGridSkeleton} from "@/components/card-grid-skeletion";
import {NoImagesFound} from "@/components/no-images-found";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

export interface ImageSearchData {
    id: string;
    filename: string;
    link: string;
    description: string;
    uploader: string;
    uploaded_at: string;
    updated_at: string;
    distance: number;
}

export const ImageSearch = ({

                            }: {
    images: ImageSearchData[];
    query?: string;
}) => {
    const {isPending} = useSharedTransition();
    const params = useSearchParams();
    const searchQuery = params.get("q");

    const [images, setImages] = useState<ImageSearchData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_API_BASE_URL}/search?q=${searchQuery}`,
                    {cache: "force-cache"}
                );
                const data = await response.json();
                setImages(data);
            } catch (err) {
                if (err instanceof Error) {
                    console.error(err.message);
                } else {
                    console.error("An unknown error has occurred");
                }
            }
        };

        fetchData();
    }, [searchQuery]);

    if (isPending) return <CardGridSkeleton/>;

    if (images.length === 0) {
        return <NoImagesFound query={searchQuery ?? ""}/>;
    }

    return <ImageGrid images={images}/>;
};

const ImageGrid = ({images}: { images: ImageSearchData[] }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 relative">
            {images.map((image) => (
                <ImageCard
                    key={"image_" + image.id}
                    image={image}
                />
            ))}
        </div>
    );
};