import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Package, Eye, Edit, Trash2, Plus, FileText, Activity } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Data', href: '#' },
    { title: 'Tipe Karpet', href: '#' },
];

interface TipeKarpet {
    id: number;
    nama: string;
    deskripsi: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    leads_count?: number;
}

interface PageProps {
    tipeKarpets: TipeKarpet[];
}

export default function TipeKarpetsIndex() {
    const { tipeKarpets } = usePage<PageProps>().props;

    const handleDelete = (tipeKarpet: TipeKarpet) => {
        if (confirm(`Apakah Anda yakin ingin menghapus tipe karpet "${tipeKarpet.nama}"?`)) {
            router.delete(`/tipe-karpets/${tipeKarpet.id}`);
        }
    };

    const activeTipeKarpets = tipeKarpets.filter(t => t.is_active);
    const totalLeads = tipeKarpets.reduce((sum, t) => sum + (t.leads_count || 0), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tipe Karpet - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#2B5235]">Tipe Karpet</h1>
                        <p className="text-gray-600">
                            Kelola jenis-jenis karpet yang tersedia
                        </p>
                    </div>
                    <Link href="/tipe-karpets/create">
                        <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Tipe Karpet
                        </Button>
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#2B5235]/10 rounded-lg">
                                    <Package className="h-5 w-5 text-[#2B5235]" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Tipe Aktif</p>
                                    <p className="text-2xl font-bold text-[#2B5235]">
                                        {activeTipeKarpets.length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Activity className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Leads</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {totalLeads}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <FileText className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Rata-rata per Tipe</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {activeTipeKarpets.length > 0 
                                            ? Math.round(totalLeads / activeTipeKarpets.length)
                                            : 0
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tipe Karpets List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {tipeKarpets.map((tipeKarpet) => (
                        <Card key={tipeKarpet.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#2B5235]/10 rounded-lg">
                                            <Package className="h-5 w-5 text-[#2B5235]" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg text-[#2B5235]">
                                                {tipeKarpet.nama}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600">
                                                ID: {tipeKarpet.id}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={tipeKarpet.is_active ? 'default' : 'secondary'}>
                                        {tipeKarpet.is_active ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                                {/* Description */}
                                {tipeKarpet.deskripsi && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Deskripsi:</p>
                                        <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                                            {tipeKarpet.deskripsi}
                                        </p>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-[#2B5235]">
                                            {tipeKarpet.leads_count || 0}
                                        </div>
                                        <div className="text-xs text-gray-500">Total Leads</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-blue-600">
                                            {new Date(tipeKarpet.created_at).toLocaleDateString('id-ID')}
                                        </div>
                                        <div className="text-xs text-gray-500">Dibuat</div>
                                    </div>
                                </div>

                                {/* Last Updated */}
                                <div className="text-xs text-gray-500">
                                    Terakhir diperbarui: {new Date(tipeKarpet.updated_at).toLocaleString('id-ID')}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-gray-100">
                                    <Link href={`/tipe-karpets/${tipeKarpet.id}/edit`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleDelete(tipeKarpet)}
                                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {tipeKarpets.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Belum ada tipe karpet
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Tambahkan tipe karpet pertama untuk mulai mengkategorikan produk karpet.
                            </p>
                            <Link href="/tipe-karpets/create">
                                <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tambah Tipe Karpet Pertama
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}