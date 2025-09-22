import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, className, ...props }: AppContentProps) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset 
                className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${className || ''}`} 
                {...props}
            >
                <div className="flex flex-1 flex-col min-h-0">
                    {children}
                </div>
            </SidebarInset>
        );
    }

    return (
        <main className={`mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl ${className || ''}`} {...props}>
            {children}
        </main>
    );
}
