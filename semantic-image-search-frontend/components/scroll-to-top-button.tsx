import {useEffect, useState} from "react";
import {Button} from "@nextui-org/button";
import {ChevronUp} from "lucide-react";

export default function ScrollToTopButton() {

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <Button
            className={`
        fixed bottom-6 right-6 
        rounded-full p-2
        transition-all duration-300 ease-in-out
        shadow-lg
        z-50
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
            isIconOnly
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <ChevronUp className="h-6 w-6"/>
        </Button>
    );
}