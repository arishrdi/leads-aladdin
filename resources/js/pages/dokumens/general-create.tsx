import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LeadCombobox } from '@/components/lead-combobox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Upload, FileText, User, Building } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Dokumen', href: '/dokumens' },
    { title: 'Upload Dokumen', href: '#' },
];

interface Lead {
    id: number;
    nama_pelanggan: string;
    sapaan: string;
    no_whatsapp: string;
    nama_masjid_instansi: string;
    status: string;
    user: {
        name: string;
    };
    cabang: {
        nama_cabang: string;
        lokasi: string;
    };
}

interface PageProps {
    leads: Lead[];
    config: {
        dokumenKategori: Record<string, string>;
    };
}

export default function GeneralCreateDokumen() {
    const { leads, config } = usePage<PageProps>().props;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    
    const { data, setData, post, processing, errors } = useForm({
        leads_id: '',
        judul: '',
        deskripsi: '',
        kategori: '',
        file: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/dokumens', {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
        setData('file', file);
        
        // Auto-fill title with filename if empty
        if (file && !data.judul) {
            const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
            setData('judul', nameWithoutExtension);
        }
    };

    const handleLeadChange = (leadId: string) => {
        const lead = leads.find(l => l.id.toString() === leadId) || null;
        setSelectedLead(lead);
        setData('leads_id', leadId);
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

    const formatPhoneNumber = (phone: string) => {
        if (phone.startsWith('62')) {
            return '+' + phone;
        }
        return phone;
    };

    const acceptedFileTypes = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png';
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Dokumen - Leads Aladdin" />
            
            <div className=" space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-primary">Upload Dokumen</h1>
                        <p className="text-gray-600">
                            Pilih lead dan upload dokumen
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lead Selection & Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Pilih Lead
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="leads_id">Lead *</Label>
                                <LeadCombobox
                                    leads={leads}
                                    value={data.leads_id}
                                    onValueChange={handleLeadChange}
                                    placeholder="Pilih lead untuk dokumen ini"
                                    hasError={!!errors.leads_id}
                                />
                                {errors.leads_id && (
                                    <p className="text-sm text-red-500 mt-1">{errors.leads_id}</p>
                                )}
                            </div>

                            {/* Selected Lead Information */}
                            {selectedLead && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-3">
                                    <div className="flex items-center gap-3">
                                        <User className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">
                                            {selectedLead.sapaan} {selectedLead.nama_pelanggan}
                                        </span>
                                    </div>

                                    {selectedLead.nama_masjid_instansi && (
                                        <div className="flex items-center gap-3">
                                            <Building className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm">{selectedLead.nama_masjid_instansi}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <span className="text-blue-600">📱</span>
                                        <span className="text-sm">{formatPhoneNumber(selectedLead.no_whatsapp)}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Building className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm">
                                            {selectedLead.cabang.nama_cabang} ({selectedLead.cabang.lokasi})
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <User className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm">PIC: {selectedLead.user.name}</span>
                                    </div>

                                    <div className="text-sm">
                                        <strong>Status:</strong> {selectedLead.status}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upload Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Detail Dokumen
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Label htmlFor="judul">Judul Dokumen *</Label>
                                    <Input
                                        id="judul"
                                        value={data.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                        placeholder="Masukkan judul dokumen"
                                        className={errors.judul ? 'border-red-500' : ''}
                                    />
                                    {errors.judul && (
                                        <p className="text-sm text-red-500 mt-1">{errors.judul}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="kategori">Kategori *</Label>
                                    <Select value={data.kategori} onValueChange={(value) => setData('kategori', value)}>
                                        <SelectTrigger className={errors.kategori ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih kategori dokumen" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(config.dokumenKategori).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>{value}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kategori && (
                                        <p className="text-sm text-red-500 mt-1">{errors.kategori}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="deskripsi">Deskripsi</Label>
                                    <Textarea
                                        id="deskripsi"
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        placeholder="Deskripsi singkat tentang dokumen ini..."
                                        rows={3}
                                        className={errors.deskripsi ? 'border-red-500' : ''}
                                    />
                                    {errors.deskripsi && (
                                        <p className="text-sm text-red-500 mt-1">{errors.deskripsi}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="file">File Dokumen *</Label>
                                    <div className="mt-2">
                                        <Input
                                            id="file"
                                            type="file"
                                            accept={acceptedFileTypes}
                                            onChange={handleFileChange}
                                            className={errors.file ? 'border-red-500' : ''}
                                        />
                                        <div className="mt-2 space-y-1 text-xs text-gray-500">
                                            <p>Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG</p>
                                            <p>Maksimal ukuran file: 10MB</p>
                                        </div>
                                    </div>
                                    {errors.file && (
                                        <p className="text-sm text-red-500 mt-1">{errors.file}</p>
                                    )}
                                </div>

                                {/* File Preview */}
                                {selectedFile && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium mb-2">File yang dipilih:</h4>
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="font-medium">{selectedFile.name}</p>
                                                <p className="text-sm text-gray-500">
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

                                <div className="pt-4 border-t">
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
                                            disabled={processing || !selectedFile || !selectedLead || selectedFile.size > maxFileSize}
                                            className="bg-[#2B5235] hover:bg-[#2B5235]/90 flex-1"
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {processing ? 'Mengupload...' : 'Upload Dokumen'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Upload Guidelines */}
                <Card>
                    <CardHeader>
                        <CardTitle>Panduan Upload Dokumen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <h4 className="font-medium mb-2 text-brand-primary">Kategori Penawaran:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Proposal harga</li>
                                    <li>• Brosur produk</li>
                                    <li>• Katalog karpet</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 text-brand-primary">Kategori Sketsa Survey:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Hasil survey lokasi</li>
                                    <li>• Sketsa desain</li>
                                    <li>• File perhitungan Excel</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2 text-brand-primary">Tips Upload:</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Gunakan nama file yang jelas</li>
                                    <li>• Pastikan kualitas file baik</li>
                                    <li>• Kompres file jika terlalu besar</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}