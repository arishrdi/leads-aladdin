import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Settings, Plus, Trash2, RadioIcon, CheckSquare, GripVertical } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Data', href: '#' },
    { title: 'Kelola Item Kunjungan', href: '/kunjungan-items' },
    { title: 'Tambah Kategori', href: '#' },
];

interface ItemData {
    id: string;
    nama: string;
    deskripsi: string;
    urutan: number;
    is_active: boolean;
}

export default function CreateKunjunganItem() {
    const [items, setItems] = useState<ItemData[]>([]);
    const [nextId, setNextId] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        // Category fields
        nama: '',
        deskripsi: '',
        input_type: 'checkbox' as 'radio' | 'checkbox',
        urutan: 0,
        is_active: true,
        // Items data
        items: [] as ItemData[],
    });

    const addItem = () => {
        const newItem: ItemData = {
            id: `temp-${nextId}`,
            nama: '',
            deskripsi: '',
            urutan: items.length,
            is_active: true,
        };
        const newItems = [...items, newItem];
        setItems(newItems);
        setData('items', newItems);
        setNextId(nextId + 1);
    };

    const removeItem = (itemId: string) => {
        const newItems = items.filter(item => item.id !== itemId);
        setItems(newItems);
        setData('items', newItems);
    };

    const updateItem = (itemId: string, field: keyof ItemData, value: any) => {
        const newItems = items.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
        );
        setItems(newItems);
        setData('items', newItems);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/kunjungan-items');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kategori - Leads Aladdin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-primary">
                            Tambah Kategori Baru
                        </h1>
                        <p className="text-muted-foreground">
                            Buat kategori baru dan tambahkan item-itemnya
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Category Form */}
                    <Card className="border-border/50 shadow-soft">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Detail Kategori
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nama">Nama Kategori *</Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        placeholder="Contoh: Sajadah"
                                        className={errors.nama ? 'border-red-500' : ''}
                                    />
                                    {errors.nama && (
                                        <p className="text-sm text-red-500 mt-1">{errors.nama}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="input_type">Tipe Input *</Label>
                                    <Select 
                                        value={data.input_type} 
                                        onValueChange={(value: 'radio' | 'checkbox') => setData('input_type', value)}
                                    >
                                        <SelectTrigger className={errors.input_type ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih tipe input" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="checkbox">
                                                <div className="flex items-center gap-2">
                                                    <CheckSquare className="h-4 w-4" />
                                                    Checkbox (Pilih beberapa)
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="radio">
                                                <div className="flex items-center gap-2">
                                                    <RadioIcon className="h-4 w-4" />
                                                    Radio Button (Pilih satu)
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.input_type && (
                                        <p className="text-sm text-red-500 mt-1">{errors.input_type}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <Textarea
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    placeholder="Deskripsi singkat tentang kategori ini..."
                                    rows={2}
                                    className={errors.deskripsi ? 'border-red-500' : ''}
                                />
                                {errors.deskripsi && (
                                    <p className="text-sm text-red-500 mt-1">{errors.deskripsi}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="urutan">Urutan</Label>
                                    <Input
                                        id="urutan"
                                        type="number"
                                        min="0"
                                        value={data.urutan}
                                        onChange={(e) => setData('urutan', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                        className={errors.urutan ? 'border-red-500' : ''}
                                    />
                                    {errors.urutan && (
                                        <p className="text-sm text-red-500 mt-1">{errors.urutan}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Semakin kecil nomor urutan, semakin awal ditampilkan
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2 pt-6">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active">Aktif</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items Form */}
                    <Card className="border-border/50 shadow-soft">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Plus className="h-5 w-5" />
                                    Item dalam Kategori
                                </CardTitle>
                                <Button type="button" onClick={addItem} variant="outline" size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tambah Item
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {items.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Belum ada item. Klik "Tambah Item" untuk menambahkan item ke kategori ini.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item, index) => (
                                        <div key={item.id} className="p-4 border rounded-lg bg-muted/30">
                                            <div className="flex items-start gap-4">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <GripVertical className="h-4 w-4" />
                                                    <span className="text-sm">#{index + 1}</span>
                                                </div>
                                                
                                                <div className="flex-1 space-y-3">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <Label>Nama Item *</Label>
                                                            <Input
                                                                value={item.nama}
                                                                onChange={(e) => updateItem(item.id, 'nama', e.target.value)}
                                                                placeholder="Contoh: Sajadah Premium"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Urutan</Label>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                value={item.urutan}
                                                                onChange={(e) => updateItem(item.id, 'urutan', parseInt(e.target.value) || 0)}
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <Label>Deskripsi</Label>
                                                        <Textarea
                                                            value={item.deskripsi}
                                                            onChange={(e) => updateItem(item.id, 'deskripsi', e.target.value)}
                                                            placeholder="Deskripsi singkat..."
                                                            rows={2}
                                                        />
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            checked={item.is_active}
                                                            onCheckedChange={(checked) => updateItem(item.id, 'is_active', checked)}
                                                        />
                                                        <Label>Aktif</Label>
                                                    </div>
                                                </div>
                                                
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <Card className="border-border/50 shadow-soft">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    disabled={processing}
                                    className="flex-1"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-brand-primary hover:bg-brand-primary-dark flex-1"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Kategori & Item'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>

                {/* Guidelines */}
                <Card className="border-border/50 shadow-soft bg-blue-50/50 dark:bg-blue-950/20">
                    <CardHeader>
                        <CardTitle className="text-blue-800 dark:text-blue-200">
                            Contoh Penggunaan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                                    Kategori dengan Checkbox:
                                </h4>
                                <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                                    <li>• <strong>Produk Pendukung:</strong> Keset, Parfum, Sajadah</li>
                                    <li>• <strong>Sound System:</strong> TOA, JBL, Wireless Mic</li>
                                    <li>• Marketing bisa pilih beberapa item sekaligus</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                                    Kategori dengan Radio Button:
                                </h4>
                                <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                                    <li>• <strong>Jam Digital:</strong> Kecil, Sedang, Besar</li>
                                    <li>• <strong>Ukuran Karpet:</strong> 6x9m, 9x12m, 12x15m</li>
                                    <li>• Marketing hanya bisa pilih satu ukuran saja</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}