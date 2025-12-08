import {type BreadcrumbItem} from '@/types';
import { type ReactNode } from 'react';
import {AppContent} from "@/components/app-content";
import {AppShell} from "@/components/app-shell";
import {AppHeader} from "@/components/app-header";

interface User {
    id: number;
    name: string;
    email: string;
}
interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    auth?: {
        user: User | null;
    };
}

export default ({ children, breadcrumbs, auth, ...props }: AppLayoutProps) => (
    <AppShell variant="header">
        <AppContent variant="header" className="overflow-x-hidden">
            <AppHeader breadcrumbs={breadcrumbs} auth={auth}/>
            {children}
        </AppContent>
    </AppShell>
);
