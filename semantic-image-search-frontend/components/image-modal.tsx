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
import {Chip} from "@nextui-org/chip";

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

    const similarityScore = 1 - imageData.distance;
    const getSimilarityColor = (score: number) => {
        if (score < 0.26) return "warning";
        return "success";
    };

    return (
        <Modal
            size="3xl"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            scrollBehavior="outside"
            classNames={{
                base: "bg-white dark:bg-gray-900",
                header: "border-b border-gray-200 dark:border-gray-700",
                body: "p-6",
                footer: "border-t border-gray-200 dark:border-gray-700"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-gray-600"/>
                                <span className="text-xl font-semibold text-gray-800">Image Details</span>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-6">
                                {/*상단 메인 섹터*/}
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/*이미지 영역*/}
                                    <div className="w-full lg:w-2/3 relative">
                                        <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                                            <Image
                                                src={imageData.link}
                                                alt={imageData.filename}
                                                width={800}
                                                height={600}
                                                priority
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                    </div>

                                    {/*이미지 정보 영역*/}
                                    <div className="w-full lg:w-1/3">
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-500">Similarity
                                                        Score</label>
                                                    <div>
                                                        <Chip
                                                            color={getSimilarityColor(similarityScore)}
                                                            variant="flat"
                                                            className="text-xs"
                                                        >
                                                            {similarityScore.toFixed(4)}
                                                        </Chip>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label
                                                        className="text-sm font-medium text-gray-500">Filename</label>
                                                    <p className="text-gray-800 font-medium break-all">{imageData.filename}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <label
                                                        className="text-sm font-medium text-gray-500">Description</label>
                                                    <p className="text-gray-800 break-words max-h-32 overflow-y-auto">
                                                        {imageData.description || "No description provided"}
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <label
                                                        className="text-sm font-medium text-gray-500">Uploader</label>
                                                    <p className="text-gray-800">{imageData.uploader}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-500">Upload
                                                        Date</label>
                                                    <p className="text-gray-800">{formatDate(imageData.uploaded_at)}</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {isReportFormVisible && (
                                    <div className="w-full transform transition-all duration-300 ease-in-out">
                                        <div
                                            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                                            <ReportForm
                                                imageData={imageData}
                                                onClose={() => setIsReportFormVisible(false)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter className="flex justify-between">
                            <div className="flex gap-2">
                                <Button
                                    color="danger"
                                    variant="flat"
                                    isIconOnly
                                    onPress={handleReportButtonClick}
                                    className="rounded-lg"
                                >
                                    <Siren className="w-5 h-5"/>
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Link href={imageData.link} target="_blank">
                                    <Button
                                        color="primary"
                                        className="rounded-lg"
                                        startContent={<Download className="w-4 h-4"/>}
                                    >
                                        Download
                                    </Button>
                                </Link>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                    className="rounded-lg"
                                >
                                    Close
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}