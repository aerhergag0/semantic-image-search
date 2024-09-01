import ErrorComponent from "@/components/error-component";
import {ImageSearch} from "@/components/image-search";

export const SuspendedImageSearch = async ({query}: { query?: string }) => {
    const {images, error} = {images: [], error: null};

    if (error) {
        return <ErrorComponent error={error}/>;
    }

    return <ImageSearch data={images} query={query}/>;
};