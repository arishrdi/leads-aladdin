import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, Eye, Edit, Phone } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Leads', href: '/leads' },
];

interface Lead {
    id: number;
    nama_pelanggan: string;
    no_whatsapp: string;
    nama_masjid_instansi: string;
    status: string;
    prioritas: string;
    potensi_nilai: number;
    tanggal_leads: string;
    user: {
        name: string;
    };
    cabang: {
        nama_cabang: string;
    };
    sumber_leads: {
        nama: string;
    };
}

interface PageProps {
    auth: {
        user: {
            role: string;
        };
    };
    leads: {
        data: Lead[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
        per_page: number;
    };
    filters: {
        status?: string;
        cabang_id?: string;
        search?: string;
    };
    statuses: Record<string, string>;
    cabangs: Array<{
        id: number;
        nama_cabang: string;
    }>;
}

export default function LeadsIndex() {
    const { auth, leads, filters, statuses, cabangs } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [cabangId, setCabangId] = useState(filters.cabang_id || 'all');

    const statusColors = {
        NEW: 'bg-gray-100 text-gray-800 border-gray-200',
        QUALIFIED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        WARM: 'bg-blue-100 text-blue-800 border-blue-200',
        HOT: 'bg-orange-100 text-orange-800 border-orange-200',
        CONVERTED: 'bg-green-100 text-green-800 border-green-200',
        COLD: 'bg-gray-100 text-gray-800 border-gray-200',
        CROSS_SELLING: 'bg-purple-100 text-purple-800 border-purple-200',
    };

    const priorityColors = {
        fasttrack: 'bg-red-100 text-red-800 border-red-200',
        normal: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        rendah: 'bg-green-100 text-green-800 border-green-200',
    };

    const handleFilter = () => {
        router.get('/leads', {
            search: search || undefined,
            status: status && status !== 'all' ? status : undefined,
            cabang_id: cabangId && cabangId !== 'all' ? cabangId : undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        setCabangId('all');
        router.get('/leads');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatPhoneNumber = (phone: string) => {
        if (phone.startsWith('62')) {
            return '+' + phone;
        }
        return phone;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Leads - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#2B5235]">Kelola Leads</h1>
                        <p className="text-gray-600">
                            {leads?.total || 0} leads ditemukan
                        </p>
                    </div>
                    {auth.user.role === 'marketing' && (
                        <Link href="/leads/create">
                            <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Lead
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama, telepon, atau instansi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                            
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    {Object.entries(statuses).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{key}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {auth.user.role === 'super_user' && (
                                <Select value={cabangId} onValueChange={setCabangId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Cabang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Cabang</SelectItem>
                                        {cabangs.map((cabang) => (
                                            <SelectItem key={cabang.id} value={cabang.id.toString()}>
                                                {cabang.nama_cabang}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            <div className="flex gap-2">
                                <Button onClick={handleFilter} className="flex-1">
                                    <Search className="h-4 w-4 mr-2" />
                                    Cari
                                </Button>
                                <Button variant="outline" onClick={handleReset}>
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Leads List - Mobile Optimized */}
                <div className="space-y-4">
                    {leads?.data?.map((lead) => (
                        <Card key={lead.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-[#2B5235]">
                                                {lead.nama_pelanggan}
                                            </h3>
                                            {lead.nama_masjid_instansi && (
                                                <p className="text-sm text-gray-600">
                                                    {lead.nama_masjid_instansi}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                                                {lead.status}
                                            </Badge>
                                            <Badge className={priorityColors[lead.prioritas as keyof typeof priorityColors]}>
                                                {lead.prioritas}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <a 
                                                href={`tel:${lead.no_whatsapp}`}
                                                className="text-[#2B5235] hover:underline"
                                            >
                                                {formatPhoneNumber(lead.no_whatsapp)}
                                            </a>
                                        </div>
                                        <div className="text-gray-600">
                                            <span className="font-medium">Cabang:</span> {lead.cabang.nama_cabang}
                                        </div>
                                        <div className="text-gray-600">
                                            <span className="font-medium">Sumber:</span> {lead.sumber_leads.nama}
                                        </div>
                                        <div className="text-gray-600">
                                            <span className="font-medium">PIC:</span> {lead.user.name}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <div className="text-sm text-gray-500">
                                            <div>{new Date(lead.tanggal_leads).toLocaleDateString('id-ID')}</div>
                                            {lead.potensi_nilai && (
                                                <div className="font-medium text-[#2B5235]">
                                                    {formatCurrency(lead.potensi_nilai)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/leads/${lead.id}`}>
                                                <Button size="sm" variant="outline">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            {(auth.user.role === 'super_user' || auth.user.role === 'marketing') && (
                                                <Link href={`/leads/${lead.id}/edit`}>
                                                    <Button size="sm" variant="outline">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {(!leads?.data || leads.data.length === 0) && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-gray-500">Tidak ada leads ditemukan.</p>
                                {auth.user.role === 'marketing' && (
                                    <Link href="/leads/create" className="mt-4 inline-block">
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Tambah Lead Pertama
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Pagination */}
                {leads?.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex gap-2">
                            {leads?.links?.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}