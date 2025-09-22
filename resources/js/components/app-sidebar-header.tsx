import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const currentPageTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : 'Dashboard';
    
    return (
        <header className="flex h-14 md:h-16 shrink-0 items-center gap-2 border-b border-[#DDBE75]/20 px-4 md:px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 min-w-0 flex-1">
                <SidebarTrigger className="-ml-1 text-[#2B5235] hover:bg-[#2B5235]/10" />
                <div className="min-w-0 flex-1">
                    {/* Mobile: Show page title */}
                    <h1 className="sm:hidden text-lg font-semibold text-[#2B5235] truncate">
                        {currentPageTitle}
                    </h1>
                    {/* Desktop: Show breadcrumbs */}
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
        </header>
    );
}
