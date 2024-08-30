import SemanticImageSearchNavbar from "@/components/semantic-image-search-navbar";
import {TransitionProvider} from "@/hooks/use-shared-transition";

export default function SearchLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    return (
        <div>
            <SemanticImageSearchNavbar/>
            <TransitionProvider>{children}</TransitionProvider>
        </div>
    )
}
