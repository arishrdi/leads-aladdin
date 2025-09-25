import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, MapPin, Phone, User, Building, Camera, FileText, Settings, Eye } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kunjungan', href: '/kunjungans' },
    { title: 'Edit Kunjungan', href: '#' },
];

interface Cabang {
    id: number;
    nama_cabang: string;
}

interface KunjunganItem {
    id: number;
    nama: string;
    deskripsi?: string;
    urutan: number;
    pivot?: {
        status: string;
    };
}

interface KunjunganItemCategory {
    id: number;
    nama: string;
    deskripsi?: string;
    input_type: 'radio' | 'checkbox';
    urutan: number;
    active_kunjungan_items: KunjunganItem[];
}

interface Kunjungan {
    id: number;
    cabang_id: number;
    waktu_canvasing: string;
    bertemu_dengan: string;
    nomor_aktif_takmir: string;
    nama_masjid: string;
    alamat_masjid: string;
    foto_masjid?: string;
    nama_pengurus: string;
    jumlah_shof: string;
    kondisi_karpet: string;
    status: string;
    kebutuhan: string;
    catatan?: string;
    kunjungan_items: KunjunganItem[];
}

interface PageProps {
    kunjungan: Kunjungan;
    cabangs: Cabang[];
    itemCategories: KunjunganItemCategory[];
    config: {
        statuses: Record<string, string>;
    };
}

export default function EditKunjungan() {
    const { kunjungan, cabangs, itemCategories, config } = usePage<PageProps>().props;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    // Build initial item responses from existing data
    const initialItemResponses: Record<string, string> = {};
    kunjungan.kunjungan_items.forEach(item => {
        if (item.pivot) {
            initialItemResponses[item.id.toString()] = item.pivot.status;
        }
    });

    const { data, setData, patch, processing, errors } = useForm({
        cabang_id: kunjungan.cabang_id.toString(),
        waktu_canvasing: kunjungan.waktu_canvasing,
        bertemu_dengan: kunjungan.bertemu_dengan,
        nomor_aktif_takmir: kunjungan.nomor_aktif_takmir,
        nama_masjid: kunjungan.nama_masjid,
        alamat_masjid: kunjungan.alamat_masjid,
        foto_masjid: null as File | null,
        nama_pengurus: kunjungan.nama_pengurus,
        jumlah_shof: kunjungan.jumlah_shof,
        kondisi_karpet: kunjungan.kondisi_karpet,
        status: kunjungan.status,
        kebutuhan: kunjungan.kebutuhan,
        catatan: kunjungan.catatan || '',
        item_responses: initialItemResponses,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(`/kunjungans/${kunjungan.id}`, {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
        setData('foto_masjid', file);
    };

    const handleItemResponse = (itemId: number, value: string, inputType: string) => {
        if (inputType === 'radio') {
            // For radio, we need to clear other selections in the same category
            const category = itemCategories.find(cat => 
                cat.active_kunjungan_items.some(item => item.id === itemId)
            );
            if (category) {
                const newResponses = { ...data.item_responses };
                // Clear all items in this category first
                category.active_kunjungan_items.forEach(item => {
                    delete newResponses[item.id.toString()];
                });
                // Set the selected item
                newResponses[itemId.toString()] = value;
                setData('item_responses', newResponses);
            }
        } else {
            // For checkbox, just toggle the item
            setData('item_responses', {
                ...data.item_responses,
                [itemId.toString()]: value,
            });
        }
    };

    const formatFileSize = (bytes: number) => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    const maxFileSize = 10 * 1024 * 1024; // 10MB

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Kunjungan - ${kunjungan.nama_masjid} - Leads Aladdin`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-primary">Edit Kunjungan</h1>
                        <p className="text-muted-foreground">
                            {kunjungan.nama_masjid}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <Card className="border-border/50 shadow-soft">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Informasi Dasar
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Branch Selection (if multiple available) */}
                                {cabangs.length > 1 && (
                                    <div>
                                        <Label htmlFor="cabang_id">Cabang *</Label>
                                        <Select value={data.cabang_id} onValueChange={(value) => setData('cabang_id', value)}>
                                            <SelectTrigger className={errors.cabang_id ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih cabang" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cabangs.map((cabang) => (
                                                    <SelectItem key={cabang.id} value={cabang.id.toString()}>
                                                        {cabang.nama_cabang}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.cabang_id && (
                                            <p className="text-sm text-red-500 mt-1">{errors.cabang_id}</p>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="waktu_canvasing">Waktu Canvasing *</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="waktu_canvasing"
                                            type="date"
                                            value={data.waktu_canvasing}
                                            onChange={(e) => setData('waktu_canvasing', e.target.value)}
                                            className={`pl-10 ${errors.waktu_canvasing ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.waktu_canvasing && (
                                        <p className="text-sm text-red-500 mt-1">{errors.waktu_canvasing}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="bertemu_dengan">Bertemu Dengan *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="bertemu_dengan"
                                            value={data.bertemu_dengan}
                                            onChange={(e) => setData('bertemu_dengan', e.target.value)}
                                            placeholder="Nama orang yang ditemui"
                                            className={`pl-10 ${errors.bertemu_dengan ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.bertemu_dengan && (
                                        <p className="text-sm text-red-500 mt-1">{errors.bertemu_dengan}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="nomor_aktif_takmir">Nomor Aktif Takmir *</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="nomor_aktif_takmir"
                                            value={data.nomor_aktif_takmir}
                                            onChange={(e) => setData('nomor_aktif_takmir', e.target.value)}
                                            placeholder="62812345678"
                                            className={`pl-10 ${errors.nomor_aktif_takmir ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.nomor_aktif_takmir && (
                                        <p className="text-sm text-red-500 mt-1">{errors.nomor_aktif_takmir}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="status">Status *</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(config.statuses).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{key}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500 mt-1">{errors.status}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mosque Information */}
                        <Card className="border-border/50 shadow-soft">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Informasi Masjid
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="nama_masjid">Nama Masjid *</Label>
                                    <Input
                                        id="nama_masjid"
                                        value={data.nama_masjid}
                                        onChange={(e) => setData('nama_masjid', e.target.value)}
                                        placeholder="Masjid Al-Ikhlas"
                                        className={errors.nama_masjid ? 'border-red-500' : ''}
                                    />
                                    {errors.nama_masjid && (
                                        <p className="text-sm text-red-500 mt-1">{errors.nama_masjid}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="alamat_masjid">Alamat Masjid *</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Textarea
                                            id="alamat_masjid"
                                            value={data.alamat_masjid}
                                            onChange={(e) => setData('alamat_masjid', e.target.value)}
                                            placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota"
                                            rows={3}
                                            className={`pl-10 resize-none ${errors.alamat_masjid ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.alamat_masjid && (
                                        <p className="text-sm text-red-500 mt-1">{errors.alamat_masjid}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="nama_pengurus">Nama Pengurus *</Label>
                                    <Input
                                        id="nama_pengurus"
                                        value={data.nama_pengurus}
                                        onChange={(e) => setData('nama_pengurus', e.target.value)}
                                        placeholder="Nama ketua takmir atau pengurus"
                                        className={errors.nama_pengurus ? 'border-red-500' : ''}
                                    />
                                    {errors.nama_pengurus && (
                                        <p className="text-sm text-red-500 mt-1">{errors.nama_pengurus}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="jumlah_shof">Jumlah Shof *</Label>
                                    <Input
                                        id="jumlah_shof"
                                        value={data.jumlah_shof}
                                        onChange={(e) => setData('jumlah_shof', e.target.value)}
                                        placeholder="10 shof"
                                        className={errors.jumlah_shof ? 'border-red-500' : ''}
                                    />
                                    {errors.jumlah_shof && (
                                        <p className="text-sm text-red-500 mt-1">{errors.jumlah_shof}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Photo Upload */}
                    <Card className="border-border/50 shadow-soft">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera className="h-5 w-5" />
                                Foto Masjid
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Current Photo */}
                            {kunjungan.foto_masjid && (
                                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                                    <h4 className="font-medium mb-2">Foto saat ini:</h4>
                                    <div className="flex items-center gap-3">
                                        <Camera className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex-1">
                                            <p className="font-medium">Foto tersimpan</p>
                                            <a 
                                                href={`/storage/${kunjungan.foto_masjid}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-brand-primary hover:text-brand-primary-dark flex items-center gap-1"
                                            >
                                                <Eye className="h-3 w-3" />
                                                Lihat foto
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div>
                                <Label htmlFor="foto_masjid">
                                    {kunjungan.foto_masjid ? 'Ganti Foto Masjid' : 'Foto Masjid'}
                                </Label>
                                <div className="mt-2">
                                    <Input
                                        id="foto_masjid"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className={errors.foto_masjid ? 'border-red-500' : ''}
                                    />
                                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                        <p>Format yang didukung: JPG, JPEG, PNG</p>
                                        <p>Maksimal ukuran file: 10MB</p>
                                        {kunjungan.foto_masjid && (
                                            <p>Kosongkan jika tidak ingin mengubah foto</p>
                                        )}
                                    </div>
                                </div>
                                {errors.foto_masjid && (
                                    <p className="text-sm text-red-500 mt-1">{errors.foto_masjid}</p>
                                )}
                            </div>

                            {/* New File Preview */}
                            {selectedFile && (
                                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                    <h4 className="font-medium mb-2">File baru yang dipilih:</h4>
                                    <div className="flex items-center gap-3">
                                        <Camera className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex-1">
                                            <p className="font-medium">{selectedFile.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatFileSize(selectedFile.size)} • {selectedFile.type}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedFile.size > maxFileSize && (
                                        <p className="text-sm text-red-500 mt-2">
                                            ⚠️ File terlalu besar! Maksimal 10MB.
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Additional Details */}
                    <Card className="border-border/50 shadow-soft">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Detail Tambahan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="kondisi_karpet">Kondisi Karpet *</Label>
                                <Textarea
                                    id="kondisi_karpet"
                                    value={data.kondisi_karpet}
                                    onChange={(e) => setData('kondisi_karpet', e.target.value)}
                                    placeholder="Deskripsi kondisi karpet yang ada saat ini..."
                                    rows={3}
                                    className={errors.kondisi_karpet ? 'border-red-500' : ''}
                                />
                                {errors.kondisi_karpet && (
                                    <p className="text-sm text-red-500 mt-1">{errors.kondisi_karpet}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="kebutuhan">Kebutuhan *</Label>
                                <Textarea
                                    id="kebutuhan"
                                    value={data.kebutuhan}
                                    onChange={(e) => setData('kebutuhan', e.target.value)}
                                    placeholder="Detail kebutuhan karpet (ukuran, motif, dll)..."
                                    rows={3}
                                    className={errors.kebutuhan ? 'border-red-500' : ''}
                                />
                                {errors.kebutuhan && (
                                    <p className="text-sm text-red-500 mt-1">{errors.kebutuhan}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="catatan">Catatan</Label>
                                <Textarea
                                    id="catatan"
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    placeholder="Catatan tambahan tentang kunjungan..."
                                    rows={3}
                                    className={errors.catatan ? 'border-red-500' : ''}
                                />
                                {errors.catatan && (
                                    <p className="text-sm text-red-500 mt-1">{errors.catatan}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dynamic Items */}
                    {itemCategories && itemCategories.length > 0 && (
                        <Card className="border-border/50 shadow-soft">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Checklist Item
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {itemCategories.map((category) => (
                                    <div key={category.id} className="space-y-3">
                                        <div className="border-b pb-2">
                                            <h4 className="font-medium text-brand-primary">{category.nama}</h4>
                                            {category.deskripsi && (
                                                <p className="text-sm text-muted-foreground">{category.deskripsi}</p>
                                            )}
                                        </div>

                                        {category.input_type === 'radio' ? (
                                            <RadioGroup
                                                value={Object.keys(data.item_responses).find(key => 
                                                    category.active_kunjungan_items.some(item => item.id.toString() === key)
                                                ) || ''}
                                                onValueChange={(itemId) => {
                                                    if (itemId) {
                                                        handleItemResponse(parseInt(itemId), 'ada', 'radio');
                                                    }
                                                }}
                                                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                            >
                                                {category.active_kunjungan_items.map((item) => (
                                                    <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                                                        <RadioGroupItem value={item.id.toString()} id={`radio-${item.id}`} />
                                                        <div className="flex-1">
                                                            <Label htmlFor={`radio-${item.id}`} className="font-medium cursor-pointer">
                                                                {item.nama}
                                                            </Label>
                                                            {item.deskripsi && (
                                                                <p className="text-xs text-muted-foreground">{item.deskripsi}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {category.active_kunjungan_items.map((item) => (
                                                    <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`checkbox-${item.id}`}
                                                                checked={data.item_responses[item.id.toString()] === 'ada'}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) {
                                                                        handleItemResponse(item.id, 'ada', 'checkbox');
                                                                    } else {
                                                                        const newResponses = { ...data.item_responses };
                                                                        delete newResponses[item.id.toString()];
                                                                        setData('item_responses', newResponses);
                                                                    }
                                                                }}
                                                            />
                                                            <Label htmlFor={`checkbox-${item.id}`} className="text-sm font-medium cursor-pointer">
                                                                Ada
                                                            </Label>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium">{item.nama}</div>
                                                            {item.deskripsi && (
                                                                <p className="text-xs text-muted-foreground">{item.deskripsi}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

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
                                    disabled={processing || (selectedFile && selectedFile.size > maxFileSize)}
                                    className="bg-brand-primary hover:bg-brand-primary-dark flex-1"
                                >
                                    {processing ? 'Menyimpan...' : 'Perbarui Kunjungan'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}