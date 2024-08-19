import {Card} from "@nextui-org/card";
import {ImageSearchData} from "@/components/image-search";
import Image from "next/image";

const formatDate = (utcDateString: string): string => {
    const date = new Date(utcDateString);
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    return new Intl.DateTimeFormat('ko-KR', options).format(kstDate);
};


export function ImageCard({
                              image,
                              // similarity,
                          }: {
    image: ImageSearchData;
    // similarity?: number;
}) {
    return (
        <Card
            key={image.id}
            className="h-[250px] md:h-[450px] relative group rounded-lg overflow-hidden"
        >
            <div className="absolute inset-0 z-10">
                <span className="sr-only">View image</span>
            </div>
            <Image
                src={`/s3/${image.filename}`}
                alt={image.filename}
                width={300}
                height={450}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div
                className="absolute inset-0 bg-zinc-900/70 group-hover:opacity-100 opacity-0 transition-opacity flex flex-col items-center justify-center p-6 text-white text-center">
                <h3 className="text-xl font-semibold">{image.filename}</h3>
                <p className="hidden md:block text-sm mt-2 overflow-y-hidden">
                    {image.description}
                </p>
                <p className="hidden md:block text-xs font-medium text-gray-100 italic mt-4">
                    Uploaded by {image.uploader} on {formatDate(image.uploaded_at)}
                </p>
            </div>
            {/*{similarity ? (*/}
            {/*    <div className="py-2 z-10 absolute bottom-2 left-2">*/}
            {/*        <MatchBadge*/}
            {/*            type={similarity === 1 ? "direct" : "semantic"}*/}
            {/*            similarity={similarity}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*) : null}*/}
        </Card>
    );
}