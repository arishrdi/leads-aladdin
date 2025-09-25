import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Edit, Trash2, Settings, List, RadioIcon, CheckSquare, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Data', href: '#' },
    { title: 'Kelola Item Kunjungan', href: '/kunjungan-items' },
];

interface KunjunganItem {
    id: number;
    nama: string;
    deskripsi?: string;
    urutan: number;
    is_active: boolean;
}

interface KunjunganItemCategory {
    id: number;
    nama: string;
    deskripsi?: string;
    input_type: 'radio' | 'checkbox';
    urutan: number;
    is_active: boolean;
    kunjungan_items: KunjunganItem[];
}

interface PageProps {
    categories: KunjunganItemCategory[];
}

export default function KunjunganItemsIndex() {
    const { categories } = usePage<PageProps>().props;

    const handleDelete = (type: 'category' | 'item', id: number, name: string) => {
        const routeId = type === 'category' ? `category-${id}` : id.toString();
        router.delete(`/kunjungan-items/${routeId}`, {
            preserveScroll: true,
        });
    };

    const getInputTypeIcon = (inputType: 'radio' | 'checkbox') => {
        return inputType === 'radio' 
            ? <RadioIcon className="h-4 w-4" />
            : <CheckSquare className="h-4 w-4" />;
    };

    const getInputTypeLabel = (inputType: 'radio' | 'checkbox') => {
        return inputType === 'radio' ? 'Radio Button' : 'Checkbox';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Item Kunjungan - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-brand-primary">Kelola Item Kunjungan</h1>
                        <p className="text-muted-foreground text-lg">
                            Kelola kategori dan item untuk formulir kunjungan
                        </p>
                    </div>
                    <div>
                        <Link href="/kunjungan-items/create">
                            <Button className="bg-brand-primary hover:bg-brand-primary-dark transition-colors touch-target">
                                <Plus className="h-4 w-4 mr-2" />
                                Buat Kategori Baru
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Categories and Items */}
                <div className="space-y-6">
                    {categories.map((category) => (
                        <Card key={category.id} className="border-border/50 shadow-soft">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            {getInputTypeIcon(category.input_type)}
                                            <CardTitle className="text-brand-primary">
                                                {category.nama}
                                            </CardTitle>
                                        </div>
                                        <Badge variant={category.is_active ? "default" : "secondary"}>
                                            {category.is_active ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {getInputTypeLabel(category.input_type)}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/kunjungan-items/category-${category.id}/edit`}>
                                            <Button size="sm" variant="outline" className="touch-target">
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit Kategori</span>
                                            </Button>
                                        </Link>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="touch-target text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Hapus Kategori</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className="flex items-center gap-2">
                                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                                        Konfirmasi Hapus Kategori
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Apakah Anda yakin ingin menghapus kategori "{category.nama}"?
                                                        <br />
                                                        <span className="text-red-600 font-medium">
                                                            Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
                                                        </span>
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline">
                                                            Batal
                                                        </Button>
                                                    </DialogTrigger>
                                                    <Button 
                                                        variant="destructive" 
                                                        onClick={() => handleDelete('category', category.id, category.nama)}
                                                    >
                                                        Ya, Hapus Kategori
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                                {category.deskripsi && (
                                    <p className="text-sm text-muted-foreground">
                                        {category.deskripsi}
                                    </p>
                                )}
                            </CardHeader>
                            <CardContent>
                                {category.kunjungan_items && category.kunjungan_items.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <List className="h-4 w-4" />
                                            <span>Item dalam kategori ini:</span>
                                        </div>
                                        <div className="grid gap-2">
                                            {category.kunjungan_items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground">
                                                                #{item.urutan}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">
                                                                {item.nama}
                                                            </div>
                                                            {item.deskripsi && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    {item.deskripsi}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Badge 
                                                            variant={item.is_active ? "default" : "secondary"}
                                                            className="text-xs"
                                                        >
                                                            {item.is_active ? 'Aktif' : 'Nonaktif'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Link href={`/kunjungan-items/${item.id}/edit`}>
                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                                <Edit className="h-3 w-3" />
                                                                <span className="sr-only">Edit Item</span>
                                                            </Button>
                                                        </Link>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                    <span className="sr-only">Hapus Item</span>
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle className="flex items-center gap-2">
                                                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                                                        Konfirmasi Hapus Item
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        Apakah Anda yakin ingin menghapus item "{item.nama}"?
                                                                        <br />
                                                                        <span className="text-red-600 font-medium">
                                                                            Tindakan ini tidak dapat dibatalkan.
                                                                        </span>
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <DialogTrigger asChild>
                                                                        <Button variant="outline">
                                                                            Batal
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <Button 
                                                                        variant="destructive" 
                                                                        onClick={() => handleDelete('item', item.id, item.nama)}
                                                                    >
                                                                        Ya, Hapus Item
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">
                                            Belum ada item dalam kategori ini
                                        </p>
                                        <Link href={`/kunjungan-items/category-${category.id}/edit`}>
                                            <Button size="sm" variant="outline">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Kelola Item
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {/* Empty State */}
                    {(!categories || categories.length === 0) && (
                        <Card className="border-border/50 shadow-soft">
                            <CardContent className="text-center py-16">
                                <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    Belum ada kategori item
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    Mulai dengan membuat kategori seperti "Produk Pendukung" atau "Jam Digital"
                                </p>
                                <Link href="/kunjungan-items/create">
                                    <Button className="bg-brand-primary hover:bg-brand-primary-dark touch-target">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Buat Kategori & Item Pertama
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Info Card */}
                <Card className="border-border/50 shadow-soft bg-blue-50/50 dark:bg-blue-950/20">
                    <CardHeader>
                        <CardTitle className="text-blue-800 dark:text-blue-200">
                            Informasi Pengelolaan Item
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                                    Tentang Kategori:
                                </h4>
                                <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                                    <li>• Setiap kategori memiliki tipe input (Radio/Checkbox)</li>
                                    <li>• Radio: Pilih satu item saja</li>
                                    <li>• Checkbox: Pilih beberapa item</li>
                                    <li>• Urutan kategori menentukan urutan di formulir</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                                    Tentang Item:
                                </h4>
                                <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                                    <li>• Setiap item dalam kategori akan ditampilkan sebagai pilihan</li>
                                    <li>• Marketing dapat memilih "Ada" atau "Belum Ada"</li>
                                    <li>• Urutan item menentukan urutan dalam kategori</li>
                                    <li>• Item nonaktif tidak akan muncul di formulir</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}