import { Link } from "@inertiajs/react";
import AppLogoIcon from "./app-logo-icon";
import { Icon } from "@/components/icon";
import {Facebook, Github, Mail} from "lucide-react";
const home = () => '/';
export function AppFooter() {
    return (
        <footer className="border-t-2 border-card-foreground bg-background">
            <div className="mx-auto flex h-20 items-center justify-between px-10">

                {/* Left: Logo */}
                <Link href={home()} prefetch className="flex items-center space-x-2" >
                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                    <span className="font-medium text-md text-foreground">
                        ExamBits
                    </span>
                </Link>

                {/* Right: Navigation Links */}
                <div className="flex items-center space-x-6 text-sm">
                    <a
                        href="https://github.com/dxn-xnt/ExamBits.git"
                        target="_blank"
                        className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Github />
                        <span>GitHub</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
