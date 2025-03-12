"use client";


import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";




const Navbar2 = () => {
    return (
        <div className="sticky top-0 w-full bg-white pt-1 z-50 ">
            <div className="w-full h-[1px] bg-gray-200"></div>
            {/* second row */}
            <div className=" md:max-w-[75%] px-4 md:px-0  mx-auto py-5 space-y-5  flex justify-between items-center">
                {/* logo */}
                <Link href="/" className="hidden md:block">
                    <Image src={"/logo.png"} height={100} width={100} alt="logo" className="cursor-pointer" /> </Link>
                {/* menu */}
                <NavigationMenu className="flex items-center pb-3">
                    <NavigationMenuList className="text-sm font-semibold flex gap-5 md:gap-8">
                        <NavigationMenuItem className=" hover:text-blue-700">
                            <Link href="/" legacyBehavior passHref>
                                <NavigationMenuLink>
                                    HOME
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem className=" hover:text-blue-700">
                            <Link href="/about" legacyBehavior passHref>
                                <NavigationMenuLink>
                                    ABOUT
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem className=" hover:text-blue-700">
                            <Link href="/products" legacyBehavior passHref>
                                <NavigationMenuLink>
                                    PRODUCTS
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem className=" hover:text-blue-700">
                            <Link href="/contact" legacyBehavior passHref>
                                <NavigationMenuLink>
                                    CONTACT
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

        </div>
    )
}

export default Navbar2

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"