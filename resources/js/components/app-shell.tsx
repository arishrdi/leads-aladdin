import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const { sidebarOpen } = usePage<SharedData>().props;

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }

    return (
        <SidebarProvider 
            defaultOpen={sidebarOpen ?? false}
            className="min-h-screen"
            style={{
                "--sidebar-width": "16rem",
                "--sidebar-width-mobile": "18rem",
            } as React.CSSProperties}
        >
            <div className="flex min-h-screen w-full bg-background">
                {children}
            </div>
        </SidebarProvider>
    );
}
