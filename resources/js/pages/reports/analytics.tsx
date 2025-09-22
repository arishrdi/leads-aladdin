import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { 
    TrendingUp, 
    TrendingDown, 
    Target, 
    Users, 
    Calendar, 
    Clock,
    AlertTriangle,
    CheckCircle,
    ArrowRight
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Laporan', href: '/reports' },
    { title: 'Analytics Detail', href: '#' },
];

interface PageProps {
    // Additional analytics data would be passed here
    insights: {
        lead_velocity: number;
        avg_days_to_convert: number;
        hot_leads_aging: Array<{ id: number; nama_pelanggan: string; days_in_stage: number }>;
        stalled_followups: Array<{ id: number; leads_name: string; stage: string; days_overdue: number }>;
        conversion_funnel: Array<{ stage: string; count: number; conversion_rate: number }>;
        monthly_trends: Array<{ month: string; leads: number; conversions: number; revenue: number }>;
    };
}

export default function ReportsAnalytics() {
    // Mock data for demonstration - in real app this would come from props
    const mockInsights = {
        lead_velocity: 12.5,
        avg_days_to_convert: 18,
        hot_leads_aging: [
            { id: 1, nama_pelanggan: "Masjid Al-Ikhlas", days_in_stage: 15 },
            { id: 2, nama_pelanggan: "Musholla Barokah", days_in_stage: 22 },
            { id: 3, nama_pelanggan: "Pesantren Al-Hikmah", days_in_stage: 8 },
        ],
        stalled_followups: [
            { id: 1, leads_name: "H. Muhammad Yusuf", stage: "4_penawaran", days_overdue: 5 },
            { id: 2, leads_name: "Ustadz Rahman", stage: "6_demo", days_overdue: 3 },
            { id: 3, leads_name: "Ibu Fatimah", stage: "3_survey", days_overdue: 7 },
        ],
        conversion_funnel: [
            { stage: "NEW", count: 150, conversion_rate: 100 },
            { stage: "QUALIFIED", count: 120, conversion_rate: 80 },
            { stage: "WARM", count: 85, conversion_rate: 56.7 },
            { stage: "HOT", count: 45, conversion_rate: 30 },
            { stage: "CONVERTED", count: 22, conversion_rate: 14.7 },
        ],
        monthly_trends: [
            { month: "Jan", leads: 45, conversions: 8, revenue: 250000000 },
            { month: "Feb", leads: 52, conversions: 12, revenue: 380000000 },
            { month: "Mar", leads: 48, conversions: 10, revenue: 320000000 },
            { month: "Apr", leads: 61, conversions: 15, revenue: 450000000 },
            { month: "May", leads: 58, conversions: 14, revenue: 420000000 },
            { month: "Jun", leads: 65, conversions: 18, revenue: 540000000 },
        ],
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStageColor = (stage: string) => {
        const colors = {
            'NEW': 'text-blue-600',
            'QUALIFIED': 'text-purple-600',
            'WARM': 'text-yellow-600',
            'HOT': 'text-orange-600',
            'CONVERTED': 'text-green-600',
        };
        return colors[stage as keyof typeof colors] || 'text-gray-600';
    };

    const getStageDisplayName = (stage: string) => {
        const stageNames = {
            '1_kontak_awal': 'Kontak Awal',
            '2_presentasi': 'Presentasi',
            '3_survey': 'Survey',
            '4_penawaran': 'Penawaran',
            '5_negosiasi': 'Negosiasi',
            '6_demo': 'Demo',
            '7_proposal': 'Proposal',
            '8_kontrak': 'Kontrak',
            '9_pembayaran': 'Pembayaran',
            '10_closing': 'Closing',
        };
        return stageNames[stage as keyof typeof stageNames] || stage;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics Detail - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-[#2B5235]">Analytics Detail</h1>
                    <p className="text-gray-600">
                        Insights mendalam dan prediktif untuk optimasi performa
                    </p>
                </div>

                {/* Key Performance Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Lead Velocity</p>
                                    <p className="text-xl font-bold text-green-600">
                                        {mockInsights.lead_velocity} /hari
                                    </p>
                                    <p className="text-xs text-gray-500">+15% dari bulan lalu</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Avg. Time to Convert</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        {mockInsights.avg_days_to_convert} hari
                                    </p>
                                    <p className="text-xs text-gray-500">-3 hari dari target</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Leads Memerlukan Perhatian</p>
                                    <p className="text-xl font-bold text-orange-600">
                                        {mockInsights.hot_leads_aging.length + mockInsights.stalled_followups.length}
                                    </p>
                                    <p className="text-xs text-gray-500">Segera tindak lanjuti</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Target className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Forecast Revenue</p>
                                    <p className="text-lg font-bold text-purple-600">
                                        {formatCurrency(280000000)}
                                    </p>
                                    <p className="text-xs text-gray-500">Estimasi bulan ini</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="funnel" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
                        <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
                        <TabsTrigger value="alerts">Alerts & Actions</TabsTrigger>
                        <TabsTrigger value="forecast">Forecasting</TabsTrigger>
                    </TabsList>

                    <TabsContent value="funnel" className="space-y-6">
                        {/* Conversion Funnel */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Conversion Funnel Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mockInsights.conversion_funnel.map((stage, index) => (
                                        <div key={stage.stage} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${stage.stage === 'NEW' ? 'bg-blue-500' : 
                                                        stage.stage === 'QUALIFIED' ? 'bg-purple-500' :
                                                        stage.stage === 'WARM' ? 'bg-yellow-500' :
                                                        stage.stage === 'HOT' ? 'bg-orange-500' : 'bg-green-500'}`} />
                                                    <span className="font-medium">{stage.stage}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold">{stage.count} leads</span>
                                                    <Badge variant="outline">
                                                        {stage.conversion_rate.toFixed(1)}%
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Progress 
                                                value={stage.conversion_rate} 
                                                className="h-2"
                                            />
                                            {index < mockInsights.conversion_funnel.length - 1 && (
                                                <div className="flex justify-center py-2">
                                                    <ArrowRight className="h-4 w-4 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-medium text-blue-900 mb-2">Insights & Recommendations</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Conversion rate dari WARM ke HOT perlu ditingkatkan (target: 40%)</li>
                                        <li>• Drop-off terbesar terjadi di tahap QUALIFIED - review kualitas leads</li>
                                        <li>• HOT to CONVERTED rate sudah baik (48.9%) - pertahankan strategi closing</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="trends" className="space-y-6">
                        {/* Monthly Trends */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Trend Performa 6 Bulan Terakhir</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {mockInsights.monthly_trends.map((month) => (
                                        <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="font-medium text-lg">{month.month} 2024</div>
                                            <div className="grid grid-cols-3 gap-8 text-center">
                                                <div>
                                                    <div className="text-sm text-gray-600">Leads</div>
                                                    <div className="text-xl font-bold text-blue-600">{month.leads}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-600">Conversions</div>
                                                    <div className="text-xl font-bold text-green-600">{month.conversions}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-600">Revenue</div>
                                                    <div className="text-lg font-bold text-[#2B5235]">
                                                        {formatCurrency(month.revenue)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="h-5 w-5 text-green-600" />
                                            <span className="font-medium text-green-900">Trend Positif</span>
                                        </div>
                                        <p className="text-sm text-green-800">
                                            Revenue meningkat 35% dalam 3 bulan terakhir
                                        </p>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target className="h-5 w-5 text-orange-600" />
                                            <span className="font-medium text-orange-900">Focus Area</span>
                                        </div>
                                        <p className="text-sm text-orange-800">
                                            Stabilkan jumlah leads baru per bulan (target: 60+)
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="alerts" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Hot Leads Aging */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-orange-600">
                                        <AlertTriangle className="h-5 w-5" />
                                        Hot Leads Memerlukan Perhatian
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {mockInsights.hot_leads_aging.map((lead) => (
                                            <div key={lead.id} className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                                                <div>
                                                    <p className="font-medium">{lead.nama_pelanggan}</p>
                                                    <p className="text-sm text-gray-600">Status: HOT</p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="destructive">
                                                        {lead.days_in_stage} hari
                                                    </Badge>
                                                    <p className="text-xs text-orange-600 mt-1">di stage ini</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button className="w-full mt-4 bg-[#2B5235] hover:bg-[#1e3d26]">
                                        Tindak Lanjuti Semua
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Stalled Follow-ups */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-red-600">
                                        <Clock className="h-5 w-5" />
                                        Follow-up Terlambat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {mockInsights.stalled_followups.map((followup) => (
                                            <div key={followup.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                                                <div>
                                                    <p className="font-medium">{followup.leads_name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {getStageDisplayName(followup.stage)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="destructive">
                                                        {followup.days_overdue} hari
                                                    </Badge>
                                                    <p className="text-xs text-red-600 mt-1">terlambat</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                                        Jadwalkan Ulang
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Action Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5" />
                                    Recommended Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                                        <h4 className="font-medium text-blue-900 mb-2">Optimisasi Conversion</h4>
                                        <p className="text-sm text-blue-800 mb-3">
                                            Review dan perbaiki proses dari QUALIFIED ke WARM
                                        </p>
                                        <Button size="sm" variant="outline" className="text-[#2B5235] border-[#2B5235]">
                                            Lihat Detail
                                        </Button>
                                    </div>
                                    <div className="p-4 border border-[#2B5235]/20 rounded-lg bg-[#2B5235]/5">
                                        <h4 className="font-medium text-[#2B5235] mb-2">Team Training</h4>
                                        <p className="text-sm text-[#2B5235]/80 mb-3">
                                            Latihan teknik closing untuk meningkatkan HOT to CONVERTED
                                        </p>
                                        <Button size="sm" variant="outline" className="text-[#2B5235] border-[#2B5235]">
                                            Jadwalkan
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="forecast" className="space-y-6">
                        {/* Forecasting */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Prediksi Performa 3 Bulan Ke Depan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 border rounded-lg">
                                        <h3 className="text-lg font-bold text-[#2B5235]">Juli 2024</h3>
                                        <div className="mt-4 space-y-2">
                                            <div>
                                                <p className="text-sm text-gray-600">Estimasi Leads</p>
                                                <p className="text-2xl font-bold text-blue-600">68</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Estimasi Konversi</p>
                                                <p className="text-2xl font-bold text-green-600">20</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Estimasi Revenue</p>
                                                <p className="text-lg font-bold text-[#2B5235]">
                                                    {formatCurrency(600000000)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center p-6 border rounded-lg">
                                        <h3 className="text-lg font-bold text-[#2B5235]">Agustus 2024</h3>
                                        <div className="mt-4 space-y-2">
                                            <div>
                                                <p className="text-sm text-gray-600">Estimasi Leads</p>
                                                <p className="text-2xl font-bold text-blue-600">72</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Estimasi Konversi</p>
                                                <p className="text-2xl font-bold text-green-600">22</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Estimasi Revenue</p>
                                                <p className="text-lg font-bold text-[#2B5235]">
                                                    {formatCurrency(650000000)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center p-6 border rounded-lg">
                                        <h3 className="text-lg font-bold text-[#2B5235]">September 2024</h3>
                                        <div className="mt-4 space-y-2">
                                            <div>
                                                <p className="text-sm text-gray-600">Estimasi Leads</p>
                                                <p className="text-2xl font-bold text-blue-600">75</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Estimasi Konversi</p>
                                                <p className="text-2xl font-bold text-green-600">25</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Estimasi Revenue</p>
                                                <p className="text-lg font-bold text-[#2B5235]">
                                                    {formatCurrency(720000000)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                                    <h4 className="font-medium text-purple-900 mb-2">Asumsi Prediksi</h4>
                                    <ul className="text-sm text-purple-800 space-y-1">
                                        <li>• Berdasarkan trend 6 bulan terakhir</li>
                                        <li>• Asumsi tidak ada perubahan strategi besar</li>
                                        <li>• Seasonal factor untuk bulan Agustus-September</li>
                                        <li>• Target improvement 5% per bulan</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}