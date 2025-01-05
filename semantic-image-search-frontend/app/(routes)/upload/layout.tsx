import SemanticImageSearchNavbar from "@/components/semantic-image-search-navbar";
import {UserProvider} from "@/context/user-context";

export default function SearchPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <UserProvider>
                <SemanticImageSearchNavbar/>
                {children}
            </UserProvider>
        </div>
    );
}