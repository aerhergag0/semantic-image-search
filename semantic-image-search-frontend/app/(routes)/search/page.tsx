import {Button} from "@nextui-org/button";
import Link from "next/link";
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

    return (
        <main className={"p-8 space-y-4"}>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-semibold text-2xl">Semantic Image Search</h1>
                </div>
                <Link href={"/upload"}>
                    <Button>Upload Image</Button>
                </Link>
            </div>
            <div>
                <p>
                    Try searching for something
                    semantically, like &quot;구름이 있는 산&quot;.
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
        </main>
    );
}