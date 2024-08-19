import Navbar from "@/components/navbar";

export default function SearchPageLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    return (
        <main>
            <Navbar/>
            {children}
        </main>
    );
}