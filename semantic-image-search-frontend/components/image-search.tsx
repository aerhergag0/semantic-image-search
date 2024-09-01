"use client";

import {BACKEND_API_BASE_URL} from "@/constants";
import {ImageCard} from "@/components/image-card";
import {useSharedTransition} from "@/hooks/use-shared-transition";
import {CardGridSkeleton} from "@/components/card-grid-skeletion";
import {NoImagesFound} from "@/components/no-images-found";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Button} from "@nextui-org/button";
import ScrollToTopButton from "@/components/scroll-to-top-button";

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

interface SearchResponse {
    images: ImageSearchData[];
    page: number;
    has_next: boolean;
}

export const ImageSearch = ({}: {
    data: SearchResponse[];
    query?: string;
}) => {
    const {isPending} = useSharedTransition();
    const params = useSearchParams();
    const searchQuery = params.get("q");

    const [images, setImages] = useState<ImageSearchData[]>([]);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async (pageNum: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${BACKEND_API_BASE_URL}/search?q=${searchQuery}&page=${pageNum}`,
                {cache: "force-cache"}
            );
            const data: SearchResponse = await response.json();

            if (Array.isArray(data.images)) {
                if (pageNum === 1) {
                    setImages(data.images);
                } else {
                    setImages((prevImages) => [...prevImages, ...data.images]);
                }

                setHasMore(data.has_next);
                setPage(data.page);
            } else {
                console.error("Received data is not in the expected format:", data);
                setImages([]);
                setHasMore(false);
            }

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("An unknown error has occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchData(1)
    }, [searchQuery]);

    const handleLoadMore = async () => {
        fetchData(page + 1);
    };


    if (isPending) return <CardGridSkeleton/>;

    if (images.length === 0 && !isLoading) {
        return <NoImagesFound query={searchQuery ?? ""}/>;
    }

    return (
        <div>
            <ImageGrid images={images}/>
            {hasMore && (
                <div className="mt-4 text-center">
                    <Button onClick={handleLoadMore} disabled={isLoading}>
                        {isLoading ? "loading.." : "Load More"}
                    </Button>
                </div>
            )}
            <ScrollToTopButton/>
        </div>
    );
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