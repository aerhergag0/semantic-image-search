"use client";

import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import {Download, Info, Siren} from 'lucide-react';
import Image from "next/image";
import {ImageSearchData} from "@/components/image-search";
import {formatDate} from "@/components/image-card";
import Link from "next/link";
import {useState} from "react";
import ReportForm from "@/components/report-form";

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

    const [isReportFormVisible, setIsReportFormVisible] = useState(false);

    const handleReportButtonClick = () => {
        setIsReportFormVisible(!isReportFormVisible);
    };

    return (
        <Modal
            size={"2xl"}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement={"center"}
            scrollBehavior={"outside"}
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
                                    <div className="space-y-3">
                                        {[
                                            {label: "Filename:", value: imageData.filename},
                                            {label: "Description:", value: imageData.description},
                                            {label: "Uploader:", value: imageData.uploader},
                                            {label: "Uploaded Time:", value: formatDate(imageData.uploaded_at)},
                                            {label: "Similarity Score:", value: (1 - imageData.distance).toFixed(10)}
                                        ].map((item, index) => (
                                            <div key={index} className="grid grid-cols-2 gap-4">
                                                <strong className="text-gray-700 font-semibold">{item.label}</strong>
                                                <span className="text-gray-600 ">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {isReportFormVisible && (
                                <ReportForm imageData={imageData}/>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" isIconOnly onPress={handleReportButtonClick}
                                    className="hover:bg-red-200 rounded-lg transition duration-300"
                            >
                                <Siren/>
                            </Button>
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