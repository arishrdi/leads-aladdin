import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Save, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Leads', href: '/leads' },
    { title: 'Tambah Lead', href: '/leads/create' },
];

interface PageProps {
    sumberLeads: Array<{
        id: number;
        nama: string;
    }>;
    tipeKarpets: Array<{
        id: number;
        nama: string;
    }>;
    cabangs: Array<{
        id: number;
        nama_cabang: string;
    }>;
    config: {
        statuses: Record<string, string>;
        prioritas: Record<string, string>;
        sapaan: Record<string, string>;
    };
}

export default function CreateLead() {
    const { sumberLeads, tipeKarpets, cabangs, config } = usePage<PageProps>().props;
    
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isDateOpen, setIsDateOpen] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal_leads: new Date().toISOString().split('T')[0],
        sapaan: 'Bapak',
        nama_pelanggan: '',
        no_whatsapp: '',
        nama_masjid_instansi: '',
        alamat: '',
        sumber_leads_id: '',
        catatan: '',
        prioritas: 'normal',
        kebutuhan_karpet: '',
        potensi_nilai: '',
        tipe_karpet_id: '',
        cabang_id: cabangs.length === 1 ? cabangs[0].id.toString() : '',
        status: 'WARM',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        post('/leads', data, {
            onSuccess: () => reset(),
        });
    };

    const formatPhoneNumber = (value: string) => {
        // Remove all non-digit characters
        const numbers = value.replace(/\D/g, '');
        
        // If starts with 62, keep it
        if (numbers.startsWith('62')) {
            return numbers;
        }
        
        // If starts with 0, replace with 62
        if (numbers.startsWith('0')) {
            return '62' + numbers.slice(1);
        }
        
        // If no prefix, add 62
        if (numbers && !numbers.startsWith('62')) {
            return '62' + numbers;
        }
        
        return numbers;
    };

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhoneNumber(value);
        setData('no_whatsapp', formatted);
    };

    const displayPhoneNumber = (value: string) => {
        if (value.startsWith('62')) {
            return '+' + value;
        }
        return value;
    };

    const formatCurrency = (value: string) => {
        // Remove non-numeric characters
        const numbers = value.replace(/\D/g, '');
        
        // Format with thousands separator
        if (numbers) {
            return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return '';
    };

    const handleCurrencyChange = (value: string) => {
        const formatted = formatCurrency(value);
        setData('potensi_nilai', formatted);
    };

    const getCurrencyValue = () => {
        // Remove dots for submission
        return data.potensi_nilai.replace(/\./g, '');
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            setData('tanggal_leads', date.toISOString().split('T')[0]);
            setIsDateOpen(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Lead - Leads Aladdin" />
            
            <div className=" space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#2B5235]">Tambah Lead Baru</h1>
                        <p className="text-gray-600">Isi informasi lead yang akan ditambahkan</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="tanggal_leads">Tanggal Lead *</Label>
                                    <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !selectedDate && "text-muted-foreground",
                                                    errors.tanggal_leads && "border-red-500"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: id }) : "Pilih tanggal"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={handleDateSelect}
                                                initialFocus
                                                locale={id}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.tanggal_leads && (
                                        <p className="text-sm text-red-500 mt-1">{errors.tanggal_leads}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="sapaan">Sapaan *</Label>
                                    <Select value={data.sapaan} onValueChange={(value) => setData('sapaan', value)}>
                                        <SelectTrigger className={errors.sapaan ? 'border-red-500' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(config.sapaan).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>{value}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.sapaan && (
                                        <p className="text-sm text-red-500 mt-1">{errors.sapaan}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="nama_pelanggan">Nama Pelanggan *</Label>
                                <Input
                                    id="nama_pelanggan"
                                    value={data.nama_pelanggan}
                                    onChange={(e) => setData('nama_pelanggan', e.target.value)}
                                    placeholder="Masukkan nama lengkap pelanggan"
                                    className={errors.nama_pelanggan ? 'border-red-500' : ''}
                                />
                                {errors.nama_pelanggan && (
                                    <p className="text-sm text-red-500 mt-1">{errors.nama_pelanggan}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="no_whatsapp">Nomor WhatsApp *</Label>
                                <Input
                                    id="no_whatsapp"
                                    value={displayPhoneNumber(data.no_whatsapp)}
                                    onChange={(e) => handlePhoneChange(e.target.value)}
                                    placeholder="Contoh: +628123456789"
                                    className={errors.no_whatsapp ? 'border-red-500' : ''}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Format akan otomatis diubah ke +62xxx
                                </p>
                                {errors.no_whatsapp && (
                                    <p className="text-sm text-red-500 mt-1">{errors.no_whatsapp}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="nama_masjid_instansi">Nama Masjid/Instansi</Label>
                                <Input
                                    id="nama_masjid_instansi"
                                    value={data.nama_masjid_instansi}
                                    onChange={(e) => setData('nama_masjid_instansi', e.target.value)}
                                    placeholder="Nama masjid atau instansi (opsional)"
                                    className={errors.nama_masjid_instansi ? 'border-red-500' : ''}
                                />
                                {errors.nama_masjid_instansi && (
                                    <p className="text-sm text-red-500 mt-1">{errors.nama_masjid_instansi}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="alamat">Alamat</Label>
                                <Textarea
                                    id="alamat"
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    placeholder="Alamat lengkap pelanggan (opsional)"
                                    rows={2}
                                    className={errors.alamat ? 'border-red-500' : ''}
                                />
                                {errors.alamat && (
                                    <p className="text-sm text-red-500 mt-1">{errors.alamat}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lead Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Lead</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="sumber_leads_id">Sumber Lead *</Label>
                                    <Select value={data.sumber_leads_id} onValueChange={(value) => setData('sumber_leads_id', value)}>
                                        <SelectTrigger className={errors.sumber_leads_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih sumber lead" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sumberLeads.map((sumber) => (
                                                <SelectItem key={sumber.id} value={sumber.id.toString()}>
                                                    {sumber.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.sumber_leads_id && (
                                        <p className="text-sm text-red-500 mt-1">{errors.sumber_leads_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="status">Status Lead *</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(config.statuses).map((status) => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500 mt-1">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="prioritas">Prioritas *</Label>
                                    <Select value={data.prioritas} onValueChange={(value) => setData('prioritas', value)}>
                                        <SelectTrigger className={errors.prioritas ? 'border-red-500' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(config.prioritas).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>{value}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.prioritas && (
                                        <p className="text-sm text-red-500 mt-1">{errors.prioritas}</p>
                                    )}
                                </div>

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
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="kebutuhan_karpet">Kebutuhan Karpet</Label>
                                    <Input
                                        id="kebutuhan_karpet"
                                        value={data.kebutuhan_karpet}
                                        onChange={(e) => setData('kebutuhan_karpet', e.target.value)}
                                        placeholder="Contoh: 10x10 meter"
                                        className={errors.kebutuhan_karpet ? 'border-red-500' : ''}
                                    />
                                    {errors.kebutuhan_karpet && (
                                        <p className="text-sm text-red-500 mt-1">{errors.kebutuhan_karpet}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="tipe_karpet_id">Tipe Karpet</Label>
                                    <Select value={data.tipe_karpet_id || 'none'} onValueChange={(value) => setData('tipe_karpet_id', value === 'none' ? '' : value)}>
                                        <SelectTrigger className={errors.tipe_karpet_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih tipe karpet (opsional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Belum ditentukan</SelectItem>
                                            {tipeKarpets.map((tipe) => (
                                                <SelectItem key={tipe.id} value={tipe.id.toString()}>
                                                    {tipe.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.tipe_karpet_id && (
                                        <p className="text-sm text-red-500 mt-1">{errors.tipe_karpet_id}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="potensi_nilai">Potensi Nilai (Rupiah)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                                    <Input
                                        id="potensi_nilai"
                                        type="text"
                                        value={data.potensi_nilai}
                                        onChange={(e) => handleCurrencyChange(e.target.value)}
                                        placeholder="0"
                                        className={cn(
                                            "pl-10",
                                            errors.potensi_nilai ? 'border-red-500' : ''
                                        )}
                                    />
                                </div>
                               
                                {errors.potensi_nilai && (
                                    <p className="text-sm text-red-500 mt-1">{errors.potensi_nilai}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="catatan">Catatan</Label>
                                <Textarea
                                    id="catatan"
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    placeholder="Catatan tambahan tentang lead ini"
                                    rows={3}
                                    className={errors.catatan ? 'border-red-500' : ''}
                                />
                                {errors.catatan && (
                                    <p className="text-sm text-red-500 mt-1">{errors.catatan}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[#2B5235] hover:bg-[#2B5235]/90"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Lead'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}