import toast from "react-hot-toast";

export const uploadSuccessToast = () => {
    toast(
        (t: { id: string }
        ) => (
            <div className="relative">
                <div className="p-2">
                    <p className="font-semibold text-gray-900">
                        File uploaded!
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Your file has been uploaded successfully.
                    </p>
                </div>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="absolute top-0 -right-2 inline-flex text-gray-400 focus:outline-none focus:text-gray-500 rounded-full p-1.5 hover:bg-gray-100 transition ease-in-out duration-150"
                >
                    <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 5.293a1 1 0 011.414 0L10
                            8.586l3.293-3.293a1 1 0 111.414 1.414L11.414
                            10l3.293 3.293a1 1 0 01-1.414 1.414L10
                            11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586
                            10 5.293 6.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        ),
        {duration: 5000}
    )
}