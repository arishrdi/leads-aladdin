import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertTriangle, Building, Edit, Eye, Grid, List, MapPin, Phone, Plus, Trash2, User, Users, Calendar } from 'lucide-react';
import { useState } from 'react';

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
    kunjungan_count: number;
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
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    const handleDelete = (cabang: Cabang) => {
        router.delete(`/cabangs/${cabang.id}`);
    };

    return (

        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Cabang - Leads Aladdin" />

            <div className="space-y-6">
                <div className="flex flex-col justify-start gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
                    <div className="w-full">
                        <h1 className="text-2xl font-bold text-brand-primary">Manajemen Cabang</h1>
                        <p className="mt-1 text-gray-600">Kelola cabang dan penugasan marketing di seluruh lokasi</p>
                    </div>
                    <div className="flex w-full items-center justify-between gap-3 lg:justify-end">
                        <div className="flex rounded-lg border">
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className="rounded-r-none"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className="rounded-l-none"
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button asChild>
                            <Link href="/cabangs/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Cabang
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-[#2B5235]/10 p-2">
                                    <Building className="h-5 w-5 text-brand-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Cabang</p>
                                    <p className="text-2xl font-bold text-brand-primary">{cabangs.filter((c) => c.is_active).length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-100 p-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Marketing</p>
                                    <p className="text-2xl font-bold text-blue-600">{cabangs.reduce((sum, c) => sum + c.users_count, 0)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-green-100 p-2">
                                    <Building className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Leads</p>
                                    <p className="text-2xl font-bold text-green-600">{cabangs.reduce((sum, c) => sum + c.leads_count, 0)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-purple-100 p-2">
                                    <Calendar className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Kunjungan</p>
                                    <p className="text-2xl font-bold text-purple-600">{cabangs.reduce((sum, c) => sum + c.kunjungan_count, 0)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-orange-100 p-2">
                                    <MapPin className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Lokasi</p>
                                    <p className="text-2xl font-bold text-orange-600">{new Set(cabangs.map((c) => c.lokasi)).size}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cabang List */}
                {viewMode === 'list' ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Cabang</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cabang</TableHead>
                                        <TableHead>PIC</TableHead>
                                        <TableHead>Kontak</TableHead>
                                        <TableHead>Alamat</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Marketing</TableHead>
                                        <TableHead>Leads</TableHead>
                                        <TableHead>Kunjungan</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cabangs.map((cabang) => (
                                        <TableRow key={cabang.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-lg bg-[#2B5235]/10 p-2">
                                                        <Building className="h-4 w-4 text-brand-primary" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">{cabang.nama_cabang}</span>
                                                        <p className="text-sm text-gray-600">{cabang.lokasi}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{cabang.pic}</TableCell>
                                            <TableCell>
                                                <a href={`tel:${cabang.no_telp}`} className="text-brand-primary hover:underline">
                                                    {cabang.no_telp}
                                                </a>
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                <span className="block truncate text-sm text-gray-600">{cabang.alamat}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={cabang.is_active ? 'default' : 'secondary'}>
                                                    {cabang.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-brand-primary">{cabang.users_count}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-blue-600">{cabang.leads_count}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-purple-600">{cabang.kunjungan_count}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/cabangs/${cabang.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/cabangs/${cabang.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle className="flex items-center gap-2">
                                                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                                                    Konfirmasi Hapus Cabang
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    Apakah Anda yakin ingin menghapus cabang "{cabang.nama_cabang}"?
                                                                    <br />
                                                                    Tindakan ini tidak dapat dibatalkan.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="outline">Batal</Button>
                                                                </DialogTrigger>
                                                                <Button variant="destructive" onClick={() => handleDelete(cabang)}>
                                                                    Ya, Hapus
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {cabangs.map((cabang) => (
                            <Card key={cabang.id} className="transition-shadow hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-[#2B5235]/10 p-2">
                                                <Building className="h-5 w-5 text-brand-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg text-brand-primary">{cabang.nama_cabang}</CardTitle>
                                                <p className="flex items-center gap-1 text-sm text-gray-600">
                                                    <MapPin className="h-3 w-3" />
                                                    {cabang.lokasi}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={cabang.is_active ? 'default' : 'secondary'}>{cabang.is_active ? 'Aktif' : 'Nonaktif'}</Badge>
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
                                            <a href={`tel:${cabang.no_telp}`} className="text-brand-primary hover:underline">
                                                {cabang.no_telp}
                                            </a>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                                            <span className="flex-1 text-gray-600">{cabang.alamat}</span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-4 border-t border-gray-100 py-3">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-brand-primary">{cabang.users_count}</div>
                                            <div className="text-xs text-gray-500">Marketing</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-blue-600">{cabang.leads_count}</div>
                                            <div className="text-xs text-gray-500">Leads</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-purple-600">{cabang.kunjungan_count}</div>
                                            <div className="text-xs text-gray-500">Kunjungan</div>
                                        </div>
                                    </div>

                                    {/* Marketing Team */}
                                    {cabang.users.length > 0 && (
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-gray-700">Tim Marketing:</p>
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
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/cabangs/${cabang.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/cabangs/${cabang.id}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className="flex items-center gap-2">
                                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                                        Konfirmasi Hapus Cabang
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Apakah Anda yakin ingin menghapus cabang "{cabang.nama_cabang}"?
                                                        <br />
                                                        Tindakan ini tidak dapat dibatalkan.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline">Batal</Button>
                                                    </DialogTrigger>
                                                    <Button variant="destructive" onClick={() => handleDelete(cabang)}>
                                                        Ya, Hapus
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {cabangs.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Building className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">Belum ada cabang</h3>
                            <p className="mb-6 text-gray-500">Tambahkan cabang pertama untuk mulai mengelola tim marketing di berbagai lokasi.</p>
                            <Button asChild>
                                <Link href="/cabangs/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Cabang Pertama
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
