import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import {AppContent} from "@/components/app-content";
import {AppShell} from "@/components/app-shell";
import {AppHeader} from "@/components/app-header";
import {AppFooter} from "@/components/app-footer";

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppShell variant="header">
        <AppContent variant="header" className="overflow-x-hidden">
            <AppHeader breadcrumbs={breadcrumbs}/>
            {children}
        </AppContent>
    </AppShell>
);
