import Link from "next/link";
import {Button} from "@nextui-org/button";
import {Search} from "lucide-react";

const Navbar = async () => {
    return (
        <div className={"flex items-center p-4"}>
            <div className={"flex w-full justify-end"}>
                <Link href={"/search"}>
                    <Button startContent={<Search/>}>Go To Search Page</Button>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;