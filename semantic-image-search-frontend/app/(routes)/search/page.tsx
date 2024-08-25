import {Suspense} from "react";
import SearchBox from "@/components/search-box";
import {CardGridSkeleton} from "@/components/card-grid-skeletion";
import {SuspendedImageSearch} from "@/components/suspended-image-search";

export default function SearchPage({
                                       searchParams,
                                   }: {
    searchParams: { q?: string };
}) {

    const query = searchParams.q;

    const randomExampleMessage = () => {
        const examples = [
            "구름이 있는 산",
            "비가 오는 도시",
            "바다 위의 섬",
            "가을 숲과 낙엽",
            "나무 위에 앉아 있는 고양이",
        ];

        const randomIndex = Math.floor(Math.random() * examples.length);
        return examples[randomIndex];
    }

    return (
        <div className={"p-8 space-y-4"}>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-semibold text-2xl">Semantic Image Search</h1>
                </div>
            </div>
            <div>
                <p>
                    Try searching for something
                    semantically, like &quot;{randomExampleMessage()}&quot;.
                </p>
            </div>

            <div className="">
                <div className="pt-2">
                    <SearchBox query={query}/>
                </div>
                <Suspense fallback={<CardGridSkeleton/>} key={query}>
                    <SuspendedImageSearch query={query}/>
                </Suspense>
            </div>
        </div>
    );
}