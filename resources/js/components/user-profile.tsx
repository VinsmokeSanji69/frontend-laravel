import {useRef, useState} from 'react';
import {ChevronDown, Library, LogOut} from 'lucide-react';
import {router} from "@inertiajs/react";

interface User {
    id: number;
    name: string;
    email: string;
}

type Props = {
    user: User;
    isMobile?: boolean
};

export function UserProfile({ user, isMobile }: Props) {
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoggingOut(true);

        router.post('/logout', {}, {
            preserveState: false,
            onFinish: () => {
                setIsLoggingOut(false);
                // Force reload to clear any cached state
                window.location.href = '/';
            }
        });
    };

    const handleLibraryClick = () => {
        setIsOpen(false);
        router.visit('/exam-library');
    };

    return (
        <div className="relative inline-block text-left">
            {/* Avatar Button */}
            <button
                type="button"
                className="flex items-center space-x-2 rounded-full p-1.5 px-2 transition-all hover:-translate-y-0.5 border-2 border-transparent focus:outline-none"
                onClick={() => setOpen(!open)}
            >
                <div className="h-10 w-10 rounded-full bg-accent-blue flex items-center justify-center text-foreground font-bold border-2 border-card-foreground shadow-[3px_3px_0_#000000]">
                    {user.name[0].toUpperCase()}
                </div>

                {isMobile && (
                    <div className="flex items-center gap-1">
                        <span className="font-medium text-md text-foreground">
                            {user.name}
                        </span>
                        <ChevronDown className="h-4 w-4 text-foreground" />
                    </div>
                )}

            </button>

            {/* Dropdown Menu */}
            {open && (
                <div className={
                    `absolute w-64  font-medium rounded-md bg-background border-card-foreground border-2 z-50 shadow-[3px_3px_0_#000000] ${isMobile ? "bottom-full mb-2 left-0" : "top-full mt-2 right-0"}`}>
                    <div className="px-4 py-4 border-b-2 border-foreground bg-accent-blue/30">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-accent-blue flex items-center justify-center text-foreground font-bold border-2 border-card-foreground shadow-[3px_3px_0_#000000]">
                                {user.name[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">{user.name}</p>
                                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="py-1 text-lg">
                        <button
                            onClick={handleLibraryClick}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 font-medium border-t-2 border-transparent group transition-all hover:-translate-y-0.5"
                        >
                            <span>
                                My Exam Library
                            </span>
                        </button>

                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 font-medium border-t-2 border-transparent group disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                        >
                            <span>
                                Log Out
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
