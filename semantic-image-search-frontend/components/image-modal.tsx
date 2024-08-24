import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import Image from "next/image";
import {ImageSearchData} from "@/components/image-search";
import {Download} from "lucide-react";

export type ImageModalProps = {
    isOpen: boolean;
    onOpenChange: any;
    imageData: ImageSearchData;
}

export const ImageModal = ({
    isOpen,
    onOpenChange,
    imageData
} : ImageModalProps) => {


    return (
        <Modal
            size={"4xl"}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                        <ModalBody>
                            <p>
                                {imageData.id}
                                <Image src={imageData.link} alt={imageData.id} width={300} height={450} priority></Image>
                                {imageData.filename}
                                {imageData.link}
                                {imageData.uploader}
                                {imageData.uploaded_at}
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button isIconOnly color="primary" onPress={onClose}>
                                <Download/>
                            </Button>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}