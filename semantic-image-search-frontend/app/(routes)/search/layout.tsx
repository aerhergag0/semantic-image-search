import SemanticImageSearchNavbar from "@/components/semantic-image-search-navbar";
import {TransitionProvider} from "@/hooks/use-shared-transition";
import {UserProvider} from "@/context/user-context";

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <UserProvider>
                <SemanticImageSearchNavbar/>
                <TransitionProvider>
                    {children}
                </TransitionProvider>
            </UserProvider>
        </div>
    )
}
