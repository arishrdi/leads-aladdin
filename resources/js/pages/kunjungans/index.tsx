import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, Eye, Edit, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kunjungan', href: '/kunjungans' },
];

interface Kunjungan {
    id: number;
    nama_masjid: string;
    bertemu_dengan: string;
    nomor_aktif_takmir: string;
    alamat_masjid: string;
    status: string;
    waktu_canvasing: string;
    user: {
        name: string;
    };
    cabang: {
        nama_cabang: string;
    };
}

interface PageProps {
    auth: {
        user: {
            role: string;
        };
    };
    kunjungans: {
        data: Kunjungan[];
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

export default function KunjungansIndex() {
    const { auth, kunjungans, filters, statuses, cabangs } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [cabangId, setCabangId] = useState(filters.cabang_id || 'all');

    const statusColors = {
        COLD: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700',
        WARM: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
        HOT: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700',
    };

    const handleFilter = () => {
        router.get('/kunjungans', {
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
        router.get('/kunjungans');
    };

    const formatPhoneNumber = (phone: string) => {
        if (phone.startsWith('62')) {
            return '+' + phone;
        }
        return phone;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Kunjungan - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-brand-primary">Kelola Kunjungan</h1>
                        <p className="text-muted-foreground text-lg">
                            {kunjungans?.total || 0} kunjungan ditemukan
                        </p>
                    </div>
                    {auth.user.role === 'marketing' && (
                        <Link href="/kunjungans/create">
                            <Button className="bg-brand-primary hover:bg-brand-primary-dark transition-colors touch-target">
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Kunjungan
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <Card className="border-border/50 shadow-soft">
                    <CardHeader>
                        <CardTitle className="text-brand-primary">Filter & Pencarian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama masjid, PIC, atau telepon..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 touch-target"
                                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                            
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="touch-target">
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
                                    <SelectTrigger className="touch-target">
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
                                <Button onClick={handleFilter} className="flex-1 bg-brand-primary hover:bg-brand-primary-dark touch-target">
                                    <Search className="h-4 w-4 mr-2" />
                                    Cari
                                </Button>
                                <Button variant="outline" onClick={handleReset} className="touch-target">
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Kunjungans List - Mobile Optimized */}
                <div className="space-y-4">
                    {kunjungans?.data?.map((kunjungan) => (
                        <Card key={kunjungan.id} className="border-border/50 shadow-soft hover:shadow-soft-md transition-all duration-200 hover:border-brand-primary/20">
                            <CardContent className="p-4 sm:p-6">
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <h3 className="font-semibold text-lg text-brand-primary">
                                                {kunjungan.nama_masjid}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                PIC: {kunjungan.bertemu_dengan}
                                            </p>
                                        </div>
                                        <Badge className={statusColors[kunjungan.status as keyof typeof statusColors]} variant="outline">
                                            {kunjungan.status}
                                        </Badge>
                                    </div>

                                    {/* Details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <a 
                                                href={`tel:${kunjungan.nomor_aktif_takmir}`}
                                                className="text-brand-primary hover:text-brand-primary-dark transition-colors font-medium"
                                            >
                                                {formatPhoneNumber(kunjungan.nomor_aktif_takmir)}
                                            </a>
                                        </div>
                                        <div className="text-muted-foreground">
                                            <span className="font-medium text-foreground">Cabang:</span> {kunjungan.cabang.nama_cabang}
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <span className="text-muted-foreground">{kunjungan.alamat_masjid}</span>
                                        </div>
                                        <div className="text-muted-foreground">
                                            <span className="font-medium text-foreground">PIC:</span> {kunjungan.user.name}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        <div className="text-sm space-y-1">
                                            <div className="text-muted-foreground">
                                                {new Date(kunjungan.waktu_canvasing).toLocaleDateString('id-ID', {
                                                    weekday: 'short',
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/kunjungans/${kunjungan.id}`}>
                                                <Button size="sm" variant="outline" className="touch-target">
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sr-only">Lihat Detail</span>
                                                </Button>
                                            </Link>
                                            {(auth.user.role === 'super_user' || auth.user.role === 'marketing') && (
                                                <Link href={`/kunjungans/${kunjungan.id}/edit`}>
                                                    <Button size="sm" variant="outline" className="touch-target">
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {(!kunjungans?.data || kunjungans.data.length === 0) && (
                        <Card className="border-border/50 shadow-soft">
                            <CardContent className="text-center py-16">
                                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">Tidak ada kunjungan ditemukan</h3>
                                <p className="text-muted-foreground mb-6">
                                    {search || status !== 'all' || cabangId !== 'all' 
                                        ? 'Coba ubah filter pencarian atau hapus semua filter'
                                        : 'Mulai dengan menambahkan kunjungan pertama Anda'
                                    }
                                </p>
                                {auth.user.role === 'marketing' && (
                                    <Link href="/kunjungans/create">
                                        <Button className="bg-brand-primary hover:bg-brand-primary-dark touch-target">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Tambah Kunjungan Pertama
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Pagination */}
                {kunjungans?.last_page > 1 && (
                    <Card className="border-border/50 shadow-soft">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {kunjungans.from} - {kunjungans.to} dari {kunjungans.total} kunjungan
                                </div>
                                <div className="flex justify-center">
                                    <div className="flex gap-1">
                                        {kunjungans?.links?.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`touch-target ${link.active ? 'bg-brand-primary hover:bg-brand-primary-dark' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}