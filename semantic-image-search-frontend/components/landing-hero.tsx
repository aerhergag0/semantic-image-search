import Link from "next/link";
import {Button} from "@nextui-org/button";

export default function LandingHero() {
    return (
        <div className={"text-white font-bold py-36 text-center space-y-5"}>
            <div className={"text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold"}>
                <h1>Semantic Image Search</h1>
            </div>
            <div>
                Searching for images using natural language has never been easier.
            </div>
            <div className={"flex justify-center space-x-4"}>
                <Link href={"/search"}>
                    <Button variant={"solid"} className={"md:text-lg p-4 md:p-6 rounded-full font-semibold w-40"}>
                        Search Now
                    </Button>
                </Link>

                <Link href={"/upload"}>
                    <Button variant={"solid"} className={"md:text-lg p-4 md:p-6 rounded-full font-semibold w-40"}>
                        Upload Image
                    </Button>
                </Link>
            </div>
        </div>
    );
}