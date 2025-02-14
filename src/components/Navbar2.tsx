"use client";


import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";




const Navbar2 = () => {
    return (
        <div className="sticky top-0 w-full bg-white pt-1">
            <div className="w-full h-[1px] bg-gray-200"></div>
            {/* second row */}
            <div className="py-5 px-20 space-y-5  flex justify-between items-center">
                {/* logo */}
                <Link href="/">
                    <Image src={"/logo.png"} height={100} width={100} alt="logo" className="cursor-pointer" /> </Link>
                {/* menu */}
                <NavigationMenu className="flex items-center pb-3">
                    <NavigationMenuList className="text-sm font-semibold flex gap-8">
                        <NavigationMenuItem className=" hover:text-blue-700">
                            <Link href="/docs" legacyBehavior passHref>
                                <NavigationMenuLink>
                                    HOME
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem className=" hover:text-blue-700">
                            <Link href="/docs" legacyBehavior passHref>
                                <NavigationMenuLink>
                                    ABOUT
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem className=" hover:text-blue-700">
                            <Link href="/docs" legacyBehavior passHref>
                                <NavigationMenuLink>
                                    PRODUCTS
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem className=" hover:text-blue-700">
                            <Link href="/docs" legacyBehavior passHref>
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


const components: { title: string; href: string; description: string }[] = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
]



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