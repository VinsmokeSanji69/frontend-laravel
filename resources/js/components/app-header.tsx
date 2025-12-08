import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

import { cn } from '@/lib/utils';
import { home } from '@/routes';
import {type BreadcrumbItem, type NavItem, type SharedData} from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import {UserProfile} from "@/components/user-profile";


const mainNavItems: NavItem[] = [
    {
        title: 'Features',
        href: "/#features",
    },
    {
        title: 'How it Works',
        href: "/#how-it-works",
    },
    {
        title: 'Get Started',
        href: "/#generate-exam",
    },
];


const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AppHeaderProps {
    auth?: {
        user: User | null;
    };
    breadcrumbs?: BreadcrumbItem[];
}


export function AppHeader({ auth ,breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    return (
        <>
            <div className="fixed w-full border-b-2 border-card-foreground bg-background z-2">
                <div className="mx-auto flex h-16 items-center px-4">

                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mr-2 h-[34px] w-[34px]"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
                            >
                                <SheetTitle className="sr-only">
                                    Navigation Menu
                                </SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-lg">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className="flex items-center space-x-2 font-medium"
                                                >
                                                    {item.icon && (
                                                        <Icon
                                                            iconNode={item.icon}
                                                            className="h-5 w-5"
                                                        />
                                                    )}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                        {auth?.user && (
                                            <UserProfile user={auth.user} isMobile={true}></UserProfile>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link
                        href={home()}
                        prefetch
                        className="flex items-center space-x-2"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full w-full items-center space-x-6 lg:flex">
                        <div className="ml-auto flex items-center space-x-2">
                            <div className="relative flex items-center space-x-1">
                                <NavigationMenu className="flex h-full items-stretch">
                                    <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                        {mainNavItems.map((item, index) => (
                                            <NavigationMenuLink
                                                key={index}
                                                className="relative flex h-full items-center"
                                            >
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        navigationMenuTriggerStyle(),
                                                        page.url ===
                                                        (typeof item.href ===
                                                        'string'
                                                            ? item.href
                                                            : item.href.url) &&
                                                        activeItemStyles,
                                                        'h-9 cursor-pointer px-3',
                                                    )}
                                                >
                                                    {item.icon && (
                                                        <Icon
                                                            iconNode={item.icon}
                                                            className="mr-2 h-4 w-4"
                                                        />
                                                    )}
                                                    {item.title}
                                                </Link>
                                                {page.url === item.href && (
                                                    <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                                )}
                                            </NavigationMenuLink>
                                        ))}
                                        {auth?.user && (
                                            <UserProfile user={auth.user}></UserProfile>
                                        )}
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    );
}
