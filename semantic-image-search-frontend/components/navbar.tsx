import Link from "next/link";
import {Button} from "@nextui-org/button";

const Navbar = async () => {
    return (
        <div className={"flex items-center p-4"}>
            <div className={"flex w-full justify-end"}>
                <Link href={"/search"}>
                    <Button>Go To Search Page</Button>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;