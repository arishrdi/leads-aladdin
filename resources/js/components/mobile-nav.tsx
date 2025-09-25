import { Button } from '@/components/ui/button';
import { type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, Calendar, Plus, FileText, MapPin } from 'lucide-react';

interface MobileNavProps {
    user: User;
}

export function MobileNav({ user }: MobileNavProps) {
    const page = usePage();
    
    const quickActions = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
            color: 'bg-[#2B5235]',
        },
        {
            title: 'Leads',
            href: '/leads',
            icon: Users,
            color: 'bg-[#2B5235]',
        },
        {
            title: 'Follow-ups',
            href: '/follow-ups',
            icon: Calendar,
            color: 'bg-[#2B5235]',
        },
        {
            title: 'Kunjungan',
            href: '/kunjungans',
            icon: MapPin,
            color: 'bg-[#2B5235]',
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2 sm:hidden">
            <div className="flex justify-around items-center">
                {quickActions.map((action) => {
                    const isActive = page.url === action.href || 
                                   (action.href === '/leads' && page.url.startsWith('/leads') && page.url !== '/leads/create') ||
                                   (action.href === '/follow-ups' && page.url.startsWith('/follow-ups'));
                    
                    return (
                        <Link key={action.title} href={action.href} className="flex-1">
                            <Button
                                variant={isActive ? 'default' : 'ghost'}
                                size="sm"
                                className={`w-full flex flex-col items-center gap-1 h-auto py-2 px-1 ${
                                    isActive 
                                        ? `${action.color} text-white hover:${action.color}/90` 
                                        : 'text-gray-600 hover:text-[#2B5235] hover:bg-gray-50'
                                }`}
                            >
                                <action.icon className="h-4 w-4" />
                                <span className="text-xs font-medium leading-none">
                                    {action.title}
                                </span>
                            </Button>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}