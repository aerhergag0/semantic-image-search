import {Card} from "@nextui-org/card";
import {ImageSearchData} from "@/components/image-search";
import Image from "next/image";
import {useDisclosure} from "@nextui-org/modal";
import {ImageModal} from "@/components/image-modal";
import {Chip} from "@nextui-org/chip";

export const formatDate = (utcDateString: string): string => {
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
    image
}: {
    image: ImageSearchData;
}) {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <Card
            key={image.id}
            className="h-[250px] md:h-[450px] relative group rounded-lg overflow-hidden"
            isPressable
            onPress={onOpen}
        >
            <ImageModal isOpen={isOpen} onOpenChange={onOpenChange} imageData={image}></ImageModal>
            <div className="absolute inset-0 z-10">
                <span className="sr-only">View image</span>
            </div>
            <Image
                src={image.link}
                alt={image.filename}
                fill
                sizes={"100vw, 50vw, 33vw"}
                priority
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
            {(1 - image.distance) < 0.26 ?
                <div className={"p-2"}>
                    <Chip color={"warning"}>Low Similarity</Chip>
                </div>
                : null}
        </Card>
    );
}