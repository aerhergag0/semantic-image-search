"use client";

import Link from "next/link";
import {Button} from "@nextui-org/button";
import {ImageUp, MenuIcon, Search} from "lucide-react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle
} from "@nextui-org/navbar";
import React from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";

export default function SemanticImageSearchNavbar() {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const menuItems = [
        ["Main Page", "/"],
        ["Search Image", "/search"],
        ["Upload Image", "/upload"],
    ];

    const currentPath = usePathname();

    return (
        <Navbar
            onMenuOpenChange={setIsMenuOpen}
            position={"static"}
            isBordered
            className={"bg-black"}
            maxWidth={"full"}
        >
            <NavbarContent justify="start" className={""}>
                <NavbarMenuToggle
                    icon={(isOpen) => <MenuIcon color="white"/>}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                />
                <NavbarBrand className={"gap-3"}>
                    <Link href={"/"}>
                        <Image src={"/logo.png"} alt={"logo"} width={30} height={30}/>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
            </NavbarContent>

            <NavbarContent justify={"end"}>
                <NavbarItem className={"flex gap-4"}>
                    <Link href={"/search"}>
                        <Button startContent={<Search/>}>Search</Button>
                    </Link>
                    <Link href={"/upload"}>
                        <Button startContent={<ImageUp/>}>Upload</Button>
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu>
                {menuItems
                    .filter((item) => item[1] !== currentPath)
                    .map((item, index) => (
                        <NavbarMenuItem key={`${item[0]}-${index}`}>
                            <Link
                                color={
                                    index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                                }
                                className="w-full"
                                href={item[1]}
                            >
                                {item[0]}
                            </Link>
                        </NavbarMenuItem>
                    ))}
            </NavbarMenu>
        </Navbar>
    );
}
