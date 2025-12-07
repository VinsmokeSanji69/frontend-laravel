import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { LogOut, Library } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserDropdownProps {
    user: User;
}

export default function UserDropdown({ user }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get first letter of user's name
    const initial = user.name.charAt(0).toUpperCase();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLibraryClick = () => {
        setIsOpen(false);
        router.visit('/exam-library');
    };

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

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-foreground flex items-center justify-center font-bold text-xl text-white hover:scale-105 transition-transform shadow-[3px_3px_0_#000000] active:shadow-[1px_1px_0_#000000] active:translate-x-[2px] active:translate-y-[2px]"
                aria-label="User menu"
            >
                {initial}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-background border-2 border-foreground rounded-xl shadow-[6px_6px_0_#000000] z-50 overflow-hidden">
                    <div className="px-4 py-4 border-b-2 border-foreground bg-accent-blue/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-foreground flex items-center justify-center font-bold text-white">
                                {initial}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">{user.name}</p>
                                <p className="text-xs text-gray-600 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLibraryClick}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 font-medium border-t-2 border-transparent hover:border-blue-200 group"
                    >
                        <Library className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                        <span className="group-hover:text-blue-600 transition-colors">
                            My Library
                        </span>
                    </button>

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 font-medium border-t-2 border-transparent hover:border-red-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LogOut className="h-5 w-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                        <span className="group-hover:text-red-600 transition-colors">
                            {isLoggingOut ? 'Logging out...' : 'Log out'}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
