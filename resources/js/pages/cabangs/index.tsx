import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Building, Users, Eye, Edit, Trash2, Plus, Phone, MapPin, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cabang', href: '#' },
];

interface Cabang {
    id: number;
    nama_cabang: string;
    lokasi: string;
    alamat: string;
    no_telp: string;
    pic: string;
    is_active: boolean;
    users_count: number;
    leads_count: number;
    users: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
    }>;
}

interface PageProps {
    cabangs: Cabang[];
}

export default function CabangsIndex() {
    const { cabangs } = usePage<PageProps>().props;

    const handleDelete = (cabang: Cabang) => {
        if (confirm(`Apakah Anda yakin ingin menghapus cabang ${cabang.nama_cabang}?`)) {
            router.delete(`/cabangs/${cabang.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Cabang - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#2B5235]">Manajemen Cabang</h1>
                        <p className="text-gray-600">
                            Kelola cabang dan penugasan marketing di seluruh lokasi
                        </p>
                    </div>
                    <Link href="/cabangs/create">
                        <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Cabang
                        </Button>
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#2B5235]/10 rounded-lg">
                                    <Building className="h-5 w-5 text-[#2B5235]" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Cabang</p>
                                    <p className="text-2xl font-bold text-[#2B5235]">
                                        {cabangs.filter(c => c.is_active).length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Marketing</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {cabangs.reduce((sum, c) => sum + c.users_count, 0)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Building className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Leads</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {cabangs.reduce((sum, c) => sum + c.leads_count, 0)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <MapPin className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Lokasi</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {new Set(cabangs.map(c => c.lokasi)).size}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cabang List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {cabangs.map((cabang) => (
                        <Card key={cabang.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#2B5235]/10 rounded-lg">
                                            <Building className="h-5 w-5 text-[#2B5235]" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg text-[#2B5235]">
                                                {cabang.nama_cabang}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {cabang.lokasi}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={cabang.is_active ? 'default' : 'secondary'}>
                                        {cabang.is_active ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                                {/* Contact Info */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium">PIC:</span>
                                        <span>{cabang.pic}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <a 
                                            href={`tel:${cabang.no_telp}`}
                                            className="text-[#2B5235] hover:underline"
                                        >
                                            {cabang.no_telp}
                                        </a>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <span className="flex-1 text-gray-600">{cabang.alamat}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-[#2B5235]">
                                            {cabang.users_count}
                                        </div>
                                        <div className="text-xs text-gray-500">Marketing</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-blue-600">
                                            {cabang.leads_count}
                                        </div>
                                        <div className="text-xs text-gray-500">Leads</div>
                                    </div>
                                </div>

                                {/* Marketing Team */}
                                {cabang.users.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Tim Marketing:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {cabang.users.slice(0, 3).map((user) => (
                                                <Badge key={user.id} variant="outline" className="text-xs">
                                                    {user.name}
                                                </Badge>
                                            ))}
                                            {cabang.users.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{cabang.users.length - 3} lainnya
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-gray-100">
                                    <Link href={`/cabangs/${cabang.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Detail
                                        </Button>
                                    </Link>
                                    <Link href={`/cabangs/${cabang.id}/edit`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleDelete(cabang)}
                                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {cabangs.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Belum ada cabang
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Tambahkan cabang pertama untuk mulai mengelola tim marketing di berbagai lokasi.
                            </p>
                            <Link href="/cabangs/create">
                                <Button className="bg-[#2B5235] hover:bg-[#2B5235]/90">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tambah Cabang Pertama
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}