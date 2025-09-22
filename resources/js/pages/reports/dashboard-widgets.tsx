import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    TrendingUp, 
    Users, 
    Target, 
    Calendar,
    AlertCircle,
    CheckCircle2,
    Clock,
    Phone,
    MessageCircle,
    ArrowRight
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Widget Overview', href: '#' },
];

export default function DashboardWidgets() {
    const todayStats = {
        new_leads: 5,
        scheduled_followups: 12,
        overdue_followups: 3,
        hot_leads: 8,
        calls_made: 24,
        whatsapp_sent: 18,
    };

    const urgentActions = [
        { id: 1, type: 'hot_lead', customer: 'Masjid Al-Ikhlas', action: 'Follow up survey', priority: 'high' },
        { id: 2, type: 'overdue', customer: 'H. Muhammad Yusuf', action: 'Reschedule demo', priority: 'medium' },
        { id: 3, type: 'closing', customer: 'Ustadz Rahman', action: 'Finalize contract', priority: 'high' },
    ];

    const quickStats = [
        { label: 'Leads Hari Ini', value: todayStats.new_leads, icon: Target, color: 'blue' },
        { label: 'Follow-ups Terjadwal', value: todayStats.scheduled_followups, icon: Calendar, color: 'green' },
        { label: 'Terlambat', value: todayStats.overdue_followups, icon: AlertCircle, color: 'red' },
        { label: 'Hot Leads', value: todayStats.hot_leads, icon: TrendingUp, color: 'orange' },
    ];

    const communicationStats = [
        { label: 'Panggilan', value: todayStats.calls_made, icon: Phone, color: 'purple' },
        { label: 'WhatsApp', value: todayStats.whatsapp_sent, icon: MessageCircle, color: 'green' },
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-red-200 bg-red-50';
            case 'medium': return 'border-yellow-200 bg-yellow-50';
            default: return 'border-gray-200 bg-gray-50';
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high': return <Badge variant="destructive">Urgent</Badge>;
            case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Normal</Badge>;
            default: return <Badge variant="outline">Low</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Widgets - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#2B5235]">Overview Hari Ini</h1>
                        <p className="text-gray-600">
                            {new Date().toLocaleDateString('id-ID', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>
                    <Link href="/reports">
                        <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                            Lihat Laporan Lengkap
                        </Button>
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickStats.map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${
                                        stat.color === 'blue' ? 'bg-blue-100' :
                                        stat.color === 'green' ? 'bg-green-100' :
                                        stat.color === 'red' ? 'bg-red-100' :
                                        stat.color === 'orange' ? 'bg-orange-100' : 'bg-gray-100'
                                    }`}>
                                        <stat.icon className={`h-5 w-5 ${
                                            stat.color === 'blue' ? 'text-blue-600' :
                                            stat.color === 'green' ? 'text-green-600' :
                                            stat.color === 'red' ? 'text-red-600' :
                                            stat.color === 'orange' ? 'text-orange-600' : 'text-gray-600'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                        <p className={`text-2xl font-bold ${
                                            stat.color === 'blue' ? 'text-blue-600' :
                                            stat.color === 'green' ? 'text-green-600' :
                                            stat.color === 'red' ? 'text-red-600' :
                                            stat.color === 'orange' ? 'text-orange-600' : 'text-gray-600'
                                        }`}>
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Urgent Actions */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-orange-600" />
                                Tindakan Prioritas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {urgentActions.map((action) => (
                                    <div key={action.id} className={`p-4 border rounded-lg ${getPriorityColor(action.priority)}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium">{action.customer}</h4>
                                            {getPriorityBadge(action.priority)}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{action.action}</p>
                                        <div className="flex gap-2">
                                            <Button size="sm" className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                                                Tindak Lanjuti
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                Lihat Detail
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link href="/follow-ups" className="block mt-4">
                                <Button variant="outline" className="w-full">
                                    Lihat Semua Follow-ups
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Communication Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Aktivitas Komunikasi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {communicationStats.map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            stat.color === 'purple' ? 'bg-purple-100' : 'bg-green-100'
                                        }`}>
                                            <stat.icon className={`h-4 w-4 ${
                                                stat.color === 'purple' ? 'text-purple-600' : 'text-green-600'
                                            }`} />
                                        </div>
                                        <span className="text-sm font-medium">{stat.label}</span>
                                    </div>
                                    <Badge variant="outline" className="text-lg font-bold">
                                        {stat.value}
                                    </Badge>
                                </div>
                            ))}

                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Target Harian</span>
                                    <span className="text-sm font-medium">30 kontak</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-[#2B5235] h-2 rounded-full" 
                                        style={{ width: `${((todayStats.calls_made + todayStats.whatsapp_sent) / 30) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {todayStats.calls_made + todayStats.whatsapp_sent} dari 30 target
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Aksi Cepat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/leads/create">
                                <Button variant="outline" className="w-full h-16 flex-col gap-2">
                                    <Target className="h-5 w-5" />
                                    <span className="text-sm">Tambah Lead</span>
                                </Button>
                            </Link>
                            <Link href="/follow-ups">
                                <Button variant="outline" className="w-full h-16 flex-col gap-2">
                                    <Calendar className="h-5 w-5" />
                                    <span className="text-sm">Follow-ups</span>
                                </Button>
                            </Link>
                            <Link href="/leads?status=HOT">
                                <Button variant="outline" className="w-full h-16 flex-col gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    <span className="text-sm">Hot Leads</span>
                                </Button>
                            </Link>
                            <Link href="/reports">
                                <Button variant="outline" className="w-full h-16 flex-col gap-2">
                                    <Users className="h-5 w-5" />
                                    <span className="text-sm">Laporan</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ringkasan Performa Minggu Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">28</div>
                                <div className="text-sm text-gray-600">Leads Baru</div>
                                <div className="text-xs text-green-600 mt-1">+12% dari minggu lalu</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-green-600">7</div>
                                <div className="text-sm text-gray-600">Konversi</div>
                                <div className="text-xs text-green-600 mt-1">+3 dari target</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">89%</div>
                                <div className="text-sm text-gray-600">Follow-up Rate</div>
                                <div className="text-xs text-green-600 mt-1">Di atas target 85%</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-[#2B5235]">4.2</div>
                                <div className="text-sm text-gray-600">Avg Rating</div>
                                <div className="text-xs text-gray-500 mt-1">Customer satisfaction</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}