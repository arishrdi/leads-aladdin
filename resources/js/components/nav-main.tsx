import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-brand-primary font-semibold mb-2">Menu Utama</SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
                {items.map((item) => {
                    const isActive = page.url === item.href || 
                                   (item.href !== '/dashboard' && page.url.startsWith(item.href));
                    
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className="text-sm font-medium transition-all duration-200 touch-target"
                            >
                                <Link href={item.href} prefetch >
                                    {item.icon && <item.icon className="h-5 w-5" />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
