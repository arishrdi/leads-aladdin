import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit, Building, Users, Phone, MapPin, User, Calendar, TrendingUp, Target, DollarSign, MapPinIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cabang', href: '/cabangs' },
    { title: 'Detail Cabang', href: '#' },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
}

interface Lead {
    id: number;
    nama_pelanggan: string;
    status: string;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    sumber_leads: {
        id: number;
        nama_sumber: string;
    };
}

interface Cabang {
    id: number;
    nama_cabang: string;
    lokasi: string;
    alamat: string;
    no_telp: string;
    pic: string;
    is_active: boolean;
    users: User[];
    leads: Lead[];
}

interface Stats {
    total_leads: number;
    active_leads: number;
    converted_leads: number;
    total_revenue: number;
    total_kunjungan: number;
    active_kunjungan: number;
    completed_kunjungan: number;
    pending_kunjungan: number;
}

interface PageProps {
    cabang: Cabang;
    stats: Stats;
}

export default function ShowCabang() {
    const { cabang, stats } = usePage<PageProps>().props;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        const colors = {
            'NEW': 'bg-blue-100 text-blue-800',
            'QUALIFIED': 'bg-purple-100 text-purple-800',
            'WARM': 'bg-yellow-100 text-yellow-800',
            'HOT': 'bg-orange-100 text-orange-800',
            'CONVERTED': 'bg-green-100 text-green-800',
            'COLD': 'bg-gray-100 text-gray-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${cabang.nama_cabang} - Detail Cabang - Leads Aladdin`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
                                <Building className="h-6 w-6" />
                                {cabang.nama_cabang}
                                <Badge variant={cabang.is_active ? 'default' : 'secondary'}>
                                    {cabang.is_active ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                            </h1>
                            <p className="text-gray-600 flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {cabang.lokasi}
                            </p>
                        </div>
                    </div>
                    <Link href={`/cabangs/${cabang.id}/edit`}>
                        <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Cabang
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards - Leads */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-brand-primary mb-4">Statistik Leads</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Target className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Leads</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.total_leads}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Leads Aktif</p>
                                    <p className="text-2xl font-bold text-orange-600">{stats.active_leads}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Target className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Konversi</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.converted_leads}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#DDBE75]/20 rounded-lg">
                                    <DollarSign className="h-5 w-5 text-brand-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Revenue</p>
                                    <p className="text-lg font-bold text-brand-primary">
                                        {formatCurrency(stats.total_revenue)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    </div>
                </div>

                {/* Kunjungan Stats */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-brand-primary mb-4">Statistik Kunjungan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <MapPinIcon className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Kunjungan</p>
                                        <p className="text-2xl font-bold text-purple-600">{stats.total_kunjungan || 0}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Kunjungan Aktif</p>
                                        <p className="text-2xl font-bold text-blue-600">{stats.active_kunjungan || 0}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Target className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Kunjungan Selesai</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.completed_kunjungan || 0}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Calendar className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Kunjungan Pending</p>
                                        <p className="text-2xl font-bold text-yellow-600">{stats.pending_kunjungan || 0}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Branch Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Informasi Cabang
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">PIC:</span>
                                    <span>{cabang.pic}</span>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">Telepon:</span>
                                    <a 
                                        href={`tel:${cabang.no_telp}`}
                                        className="text-brand-primary hover:underline"
                                    >
                                        {cabang.no_telp}
                                    </a>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <span className="font-medium">Alamat:</span>
                                        <p className="text-gray-600 mt-1">{cabang.alamat}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team Members */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Tim Marketing ({cabang.users.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cabang.users.length > 0 ? (
                                <div className="space-y-3">
                                    {cabang.users.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#2B5235]/10 rounded-full flex items-center justify-center">
                                                    <User className="h-4 w-4 text-brand-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {user.role}
                                                </Badge>
                                                <Badge variant={user.is_active ? 'default' : 'secondary'} className="text-xs">
                                                    {user.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500">Belum ada marketing yang ditugaskan</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Leads */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Leads Terbaru</CardTitle>
                            <Link href={`/leads?cabang=${cabang.id}`}>
                                <Button variant="outline" size="sm">
                                    Lihat Semua
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {cabang.leads.length > 0 ? (
                            <div className="space-y-3">
                                {cabang.leads.map((lead) => (
                                    <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <Link 
                                                    href={`/leads/${lead.id}`}
                                                    className="font-medium text-brand-primary hover:underline"
                                                >
                                                    {lead.nama_pelanggan}
                                                </Link>
                                                <Badge className={getStatusColor(lead.status)}>
                                                    {lead.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                <span>PIC: {lead.user.name}</span>
                                                <span>•</span>
                                                <span>{lead.sumber_leads.nama_sumber}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(lead.created_at).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">Belum ada leads di cabang ini</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}