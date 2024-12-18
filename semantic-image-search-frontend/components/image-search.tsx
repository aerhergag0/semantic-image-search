"use client";

import {BACKEND_API_BASE_URL} from "@/constants";
import {ImageCard} from "@/components/image-card";
import {useSharedTransition} from "@/hooks/use-shared-transition";
import {CardGridSkeleton} from "@/components/card-grid-skeletion";
import {NoImagesFound} from "@/components/no-images-found";
import {useSearchParams} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {Button} from "@nextui-org/button";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import LoadingDots from "@/components/loading-dots";

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

    const fetchData = useCallback(async (pageNum: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${BACKEND_API_BASE_URL}/search?q=${searchQuery}&page=${pageNum}`,
                {
                    cache: "force-cache",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': '69420'
                    }
                }
            );
            const data: SearchResponse = await response.json();

            if (!Array.isArray(data.images)) {
                console.error("Received data is not in the expected format");
            }

            setImages(prevImages => pageNum === 1 ? data.images : [...prevImages, ...data.images]);
            setHasMore(data.has_next);
            setPage(data.page);
        } catch (err) {
            console.error("Error fetching data:", err);
            setImages([]);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        setPage(1);
        setImages([]);
        fetchData(1).catch((err) => console.error(err));
    }, [searchQuery, fetchData]);

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            fetchData(page + 1).catch((err) => console.error(err));
        }
    }


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
                        {isLoading ? <LoadingDots color="#808080"/> : "Load More"}
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