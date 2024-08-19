import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle} from "lucide-react";

export default function ErrorComponent({error}: { error: Error }) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4"/>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {error.message ?? "An error occured. Please try again later."}
            </AlertDescription>
        </Alert>
    );
}