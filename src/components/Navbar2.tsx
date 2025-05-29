"use client";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar2 = () => {
    const { user, signOut } = useUser();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [user, mounted]);

    return (
        <div className="sticky top-0 w-full bg-white pt-1 z-50 ">
            <div className="w-full h-[1px] bg-gray-200"></div>
            {/* second row */}
            <div className=" md:max-w-[75%] px-2 md:px-0  mx-auto py-5 space-y-5  flex justify-between items-center">
                {/* logo */}
                <Link href="/" className="hidden md:block">
                    <Image src={"/logo.png"} height={100} width={100} alt="logo" className="cursor-pointer" />
                </Link>
                {/* menu */}
                {mounted && user?.role != "admin" && user?.role != "manager" && user?.role != "product_adder" && (
                    <NavigationMenu className="flex items-center pb-3">
                        <NavigationMenuList className="text-sm font-semibold flex gap-5 md:gap-8">
                            <NavigationMenuItem className="hover:text-blue-700">
                                <NavigationMenuLink asChild>
                                    <Link href="/">
                                        HOME
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem className="hover:text-blue-700">
                                <NavigationMenuLink asChild>
                                    <Link href="/about">
                                        ABOUT
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="hover:text-blue-700 font-extrabold text-sm px-0">
                                    PRODUCTS
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-3 p-4">
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/products"
                                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-700"
                                                >
                                                    <div className="text-sm font-medium">All Products</div>
                                                    <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                                                        Browse our complete product catalog
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/custom-products"
                                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-700"
                                                >
                                                    <div className="text-sm font-medium">Custom Coils</div>
                                                    <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                                                        Design your custom coil configuration
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem className="hover:text-blue-700">
                                <NavigationMenuLink asChild>
                                    <Link href="/contact">
                                        CONTACT
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            {user && (
                                <>
                                    {user.role === "admin" && (
                                        <NavigationMenuItem className="hover:text-blue-700">
                                            <NavigationMenuLink asChild>
                                                <Link href="/admin-products">
                                                    ADMIN
                                                </Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    )}
                                </>
                            )}
                        </NavigationMenuList>
                    </NavigationMenu>
                )}
            </div>
        </div>
    );
};

export default Navbar2;

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