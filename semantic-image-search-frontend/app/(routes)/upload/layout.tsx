import SemanticImageSearchNavbar from "@/components/semantic-image-search-navbar";

export default function SearchPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <SemanticImageSearchNavbar/>
            {children}
        </div>
    );
}