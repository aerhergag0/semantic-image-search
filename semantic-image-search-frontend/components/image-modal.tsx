import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import {Download, Info} from 'lucide-react';
import Image from "next/image";
import {ImageSearchData} from "@/components/image-search";
import {formatDate} from "@/components/image-card";
import Link from "next/link";

export type ImageModalProps = {
    isOpen: boolean;
    onOpenChange: any;
    imageData: ImageSearchData;
}

export const ImageModal = ({
    isOpen,
    onOpenChange,
    imageData
}: ImageModalProps) => {


    return (
        <Modal
            size={"2xl"}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement={"center"}
            scrollBehavior={"inside"}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-2xl font-bold text-gray-800">
                            <div className="flex items-center gap-2">
                                <Info/>
                                <span> Image Info</span>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-[60%] order-1 md:order-none">
                                    <Image
                                        src={imageData.link}
                                        alt={imageData.filename}
                                        width={450}
                                        height={300}
                                        priority
                                        className="rounded-lg shadow-lg object-cover w-full h-auto"
                                    />
                                </div>

                                <div className="w-full md:w-[40%] bg-gray-50 p-4 rounded-lg order-2 md:order-none">
                                    <div className="mb-4">
                                        <strong className="text-gray-700 font-semibold">Filename:</strong>
                                        <span className="ml-2 text-gray-600">{imageData.filename}</span>
                                    </div>
                                    <div className="mb-4">
                                        <strong className="text-gray-700 font-semibold">Description:</strong>
                                        <span className="ml-2 text-gray-600">{imageData.description}</span>
                                    </div>
                                    <div className="mb-4">
                                        <strong className="text-gray-700 font-semibold">Uploader:</strong>
                                        <span className="ml-2 text-gray-600">{imageData.uploader}</span>
                                    </div>
                                    <div className="mb-4">
                                        <strong className="text-gray-700 font-semibold">Uploaded Time:</strong>
                                        <span className="ml-2 text-gray-600">{formatDate(imageData.uploaded_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Link href={imageData.link}>
                                <Button startContent={<Download/>} color="primary"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                                >
                                    Download
                                </Button>
                            </Link>
                            <Button color="danger" variant="flat" onPress={onClose}
                                    className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-2 px-4 rounded-lg transition duration-300"
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}