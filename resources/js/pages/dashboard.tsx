import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Users, Target, TrendingUp, Calendar, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    auth: {
        user: {
            id: number;
            name: string;
            role: string;
        };
    };
    stats: {
        total_leads: number;
        warm_leads: number;
        hot_leads: number;
        customers: number;
        todays_followups: number;
        overdue_followups: number;
    };
    recent_leads: Array<{
        id: number;
        nama_pelanggan: string;
        status: string;
        tanggal_leads: string;
    }>;
    todays_followups: Array<{
        id: number;
        stage: string;
        scheduled_at: string;
        leads: {
            nama_pelanggan: string;
            status: string;
        };
    }>;
}

export default function Dashboard() {
    const { auth, stats, recent_leads, todays_followups } = usePage<DashboardProps>().props;
    const isMarketing = auth.user.role === 'marketing';

    const statusColors = {
        NEW: 'bg-gray-100 text-gray-800',
        QUALIFIED: 'bg-yellow-100 text-yellow-800',
        WARM: 'bg-blue-100 text-blue-800',
        HOT: 'bg-orange-100 text-orange-800',
        CONVERTED: 'bg-green-100 text-green-800',
        COLD: 'bg-gray-100 text-gray-800',
        CROSS_SELLING: 'bg-purple-100 text-purple-800',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#2B5235]">
                            Selamat Datang, {auth.user.name}
                        </h1>
                        <p className="text-gray-600">
                            {isMarketing ? 'Kelola leads dan follow-up Anda' : 'Pantau kinerja tim dan leads'}
                        </p>
                    </div>
                    {isMarketing && (
                        <Link href="/leads/create">
                            <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Lead
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_leads || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Leads Warm</CardTitle>
                            <Target className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats?.warm_leads || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Leads Hot</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats?.hot_leads || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Customer</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats?.customers || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Follow-up Cards for Marketing */}
                {isMarketing && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Follow-up Hari Ini</CardTitle>
                                <Calendar className="h-4 w-4 text-[#2B5235]" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-[#2B5235]">{stats?.todays_followups || 0}</div>
                                <Link href="/follow-ups" className="text-xs text-muted-foreground hover:underline">
                                    Lihat semua →
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Follow-up Terlambat</CardTitle>
                                <Calendar className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{stats?.overdue_followups || 0}</div>
                                <Link href="/follow-ups" className="text-xs text-muted-foreground hover:underline">
                                    Tindak lanjuti →
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Recent Leads & Today's Follow-ups */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Leads */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Leads Terbaru</CardTitle>
                            <CardDescription>
                                {recent_leads?.length || 0} leads terbaru
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recent_leads?.map((lead) => (
                                    <div key={lead.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{lead.nama_pelanggan}</p>
                                            <p className="text-sm text-gray-500">{lead.tanggal_leads}</p>
                                        </div>
                                        <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                                            {lead.status}
                                        </Badge>
                                    </div>
                                )) || (
                                    <p className="text-gray-500 text-center py-4">Belum ada leads</p>
                                )}
                            </div>
                            <div className="mt-4">
                                <Link href="/leads">
                                    <Button variant="outline" className="w-full">
                                        Lihat Semua Leads
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Follow-ups for Marketing */}
                    {isMarketing && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Follow-up Hari Ini</CardTitle>
                                <CardDescription>
                                    {todays_followups?.length || 0} follow-up dijadwalkan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {todays_followups?.map((followup) => (
                                        <div key={followup.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{followup.leads.nama_pelanggan}</p>
                                                <p className="text-sm text-gray-500">{followup.stage}</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={statusColors[followup.leads.status as keyof typeof statusColors]}>
                                                    {followup.leads.status}
                                                </Badge>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(followup.scheduled_at).toLocaleTimeString('id-ID', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )) || (
                                        <p className="text-gray-500 text-center py-4">Tidak ada follow-up hari ini</p>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <Link href="/follow-ups">
                                        <Button variant="outline" className="w-full">
                                            Lihat Semua Follow-up
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
