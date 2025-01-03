"use client";

import {ChangeEvent, useCallback, useMemo, useRef, useState} from 'react'
import toast from "react-hot-toast";
import LoadingDots from "@/components/loading-dots";
import {AWS_BUCKET_LINK, AWS_BUCKET_NAME, BACKEND_API_BASE_URL, s3} from "@/constants";
import {DeleteObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import {v4 as uuidv4} from "uuid";
import {Input} from "@nextui-org/input";
import {uploadSuccessToast} from "@/components/upload-success-toast";


export default function Uploader() {

    const [data, setData] = useState<{
        image: string | null
    }>({
        image: null,
    })

    const [file, setFile] = useState<File | null>(null)

    const [dragActive, setDragActive] = useState(false)
    const descriptionRef = useRef<HTMLInputElement>(null)

    const onChangePicture = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.currentTarget.files && event.currentTarget.files[0]
            if (file) {
                if (file.size / 1024 / 1024 > 10) {
                    toast.error('File size too big (max 10MB)')
                    return
                }

                const validTypes = ["image/jpeg", "image/png", "image/gif"];
                if (!validTypes.includes(file.type)) {
                    toast.error("Unsupported file format. Please upload a JPG, PNG, or GIF file.");
                    return;
                }

                setFile(file)
                const reader = new FileReader()
                reader.onload = (e) => {
                    try {
                        setData((prev) => ({...prev, image: e.target?.result as string}))
                    } catch (err) {
                        console.error("Error setting image data:", err);
                        toast.error("Error setting image data. Please try again.");
                    }
                }
                reader.readAsDataURL(file)
            }
        },
        [setData]
    )

    const [saving, setSaving] = useState(false)

    const saveDisabled = useMemo(() => {
        return !data.image || saving
    }, [data.image, saving])


    return (
        <form
            className="grid gap-6"
            onSubmit={async (e) => {
                e.preventDefault()
                setSaving(true)

                const formData = new FormData();

                const ext = file?.name.split(".").at(-1);
                const uid = uuidv4().replace(/-/g, "");
                const fileName = `${uid}${ext ? "." + ext : ""}`;

                if (file) {
                    formData.append('file', file, file.name);
                    formData.append('file_name', fileName);
                    formData.append('link', `${AWS_BUCKET_LINK}/${fileName}`)
                }

                if (descriptionRef.current && descriptionRef.current.value.trim() !== "") {
                    formData.append('description', descriptionRef.current!.value);
                } else {
                    formData.append('description', 'default description');
                }


                try {
                    const uploadToS3 = new PutObjectCommand({
                        Bucket: AWS_BUCKET_NAME,
                        Key: `${fileName}`,
                        Body: file!,
                    })
                    await s3.send(uploadToS3);
                } catch (error) {
                    console.error(error);
                }

                fetch(`${BACKEND_API_BASE_URL}/upload`, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                    headers: {
                        'ngrok-skip-browser-warning': '69420'
                    }
                }).then(async (res) => {
                    if (res.status === 200) {
                        const {url} = (await res.json()) as { url: string }
                        uploadSuccessToast()
                    } else {
                        const error = await res.text()
                        toast.error(error)
                    }
                })
                    .catch((error) => {
                        console.error('Error during upload or processing:', error);
                        toast.error(`Upload failed: ${error.message}`);

                        try {
                            const deleteFromS3 = new DeleteObjectCommand({
                                Bucket: AWS_BUCKET_NAME,
                                Key: `${fileName}`,
                            })
                            s3.send(deleteFromS3);
                        } catch (error) {
                            console.error(error);
                        }
                    })
                    .finally(() => {
                        setSaving(false)
                    })
            }}
        >
            <div>
                <div className="space-y-1 mb-4">
                    <h2 className="text-xl font-semibold">Upload a file</h2>
                    <p className="text-sm text-gray-500">
                        Accepted formats: .png, .jpg, .gif
                    </p>
                </div>
                <label
                    htmlFor="image-upload"
                    className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
                >
                    <div
                        className="absolute z-[5] h-full w-full rounded-md"
                        onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setDragActive(true)
                        }}
                        onDragEnter={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setDragActive(true)
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setDragActive(false)
                        }}
                        onDrop={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setDragActive(false)

                            const file = e.dataTransfer.files && e.dataTransfer.files[0]
                            if (file) {
                                if (file.size / 1024 / 1024 > 10) {
                                    toast.error('File size too big (max 10MB)')
                                    return
                                }

                                const validTypes = ["image/jpeg", "image/png", "image/gif"];
                                if (!validTypes.includes(file.type)) {
                                    toast.error("Unsupported file format. Please upload a JPG, PNG, or GIF file.");
                                    return
                                }

                                setFile(file)
                                const reader = new FileReader()
                                reader.onload = (e) => {
                                    try {
                                        setData((prev) => ({...prev, image: e.target?.result as string}))
                                    } catch (err) {
                                        console.error("Error setting image data:", err);
                                        toast.error("Error setting image data. Please try again.");
                                    }
                                }
                                reader.readAsDataURL(file)
                            }
                        }}
                    />
                    <div
                        className={`${
                            dragActive ? 'border-2 border-black' : ''
                        } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
                            data.image
                                ? 'bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md'
                                : 'bg-white opacity-100 hover:bg-gray-50'
                        }`}
                    >
                        <svg
                            className={`${
                                dragActive ? 'scale-110' : 'scale-100'
                            } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                            <path d="M12 12v9"></path>
                            <path d="m16 16-4-4-4 4"></path>
                        </svg>
                        <p className="mt-2 text-center text-sm text-gray-500">
                            Drag and drop or click to upload.
                        </p>
                        <p className="mt-2 text-center text-sm text-gray-500">
                            Max file size: 10MB
                        </p>
                        <span className="sr-only">Photo upload</span>
                    </div>
                    {data.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={data.image}
                            alt="Preview"
                            className="h-full w-full rounded-md object-cover"
                        />
                    )}
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                        id="image-upload"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={onChangePicture}
                    />
                </div>
                <Input
                    type="text"
                    name="description"
                    placeholder="Enter description"
                    className="border rounded p-2"
                    ref={descriptionRef}
                />
            </div>

            <button
                disabled={saveDisabled}
                className={`${
                    saveDisabled
                        ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                        : 'border-black bg-black text-white hover:bg-white hover:text-black'
                } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
            >
                {saving ? (
                    <LoadingDots color="#808080"/>
                ) : (
                    <p className="text-sm">Confirm upload</p>
                )}
            </button>
        </form>
    );
}