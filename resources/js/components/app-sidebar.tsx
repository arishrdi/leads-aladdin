import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { BranchSelector } from '@/components/branch-selector';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, Building, Calendar, FileText, Settings, BarChart3, Phone, UserCog, Database, FolderOpen } from 'lucide-react';
import AppLogo from './app-logo';

const getMainNavItems = (user: User): NavItem[] => {
    const baseItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Leads',
            href: '/leads',
            icon: Users,
        },
        {
            title: 'Follow-ups',
            href: '/follow-ups',
            icon: Calendar,
        },
        {
            title: 'Dokumen',
            href: '/dokumens',
            icon: FolderOpen,
        },
    ];

    // Add role-specific navigation items
    if (user.role === 'super_user') {
        baseItems.push(
            {
                title: 'Kelola User',
                href: '/users',
                icon: UserCog,
            },
            {
                title: 'Cabang',
                href: '/cabangs',
                icon: Building,
            },
            {
                title: 'Sumber Leads',
                href: '/sumber-leads',
                icon: Database,
            },
            {
                title: 'Tipe Karpet',
                href: '/tipe-karpets',
                icon: Database,
            },
            {
                title: 'Reports',
                href: '/reports',
                icon: BarChart3,
            },
            {
                title: 'Settings',
                href: '/settings',
                icon: Settings,
            }
        );
    }

    if (user.role === 'supervisor') {
        baseItems.push(
            {
                title: 'Reports',
                href: '/reports',
                icon: BarChart3,
            }
        );
    }

    return baseItems;
};

const footerNavItems: NavItem[] = [
    {
        title: 'Support',
        href: 'tel:+6221-555-0100',
        icon: Phone,
    },
    {
        title: 'Dokumentasi',
        href: '/help',
        icon: FileText,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth: { user: User } };
    const mainNavItems = getMainNavItems(auth.user);

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-[#DDBE75]/20">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <BranchSelector className="mb-4" />
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
