import Link from "next/link";
import {Button} from "@nextui-org/button";

export default function LandingHero() {
    return (
        <div className={"text-white font-bold py-36 text-center space-y-5"}>
            <div className={"text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold"}>
                <h1>Semantic Image Search</h1>
            </div>
            <div className={"text-lg sm:text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto"}>
                Find images using only text!
            </div>
            <div className={"flex justify-center space-x-4 mt-8"}>
                <Link href={"/search"}>
                    <Button variant={"solid"} className={"bg-gradient-to-b from-blue-500 to-purple-600 text-white md:text-lg p-4 md:p-6 rounded-full font-semibold w-40"}>
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