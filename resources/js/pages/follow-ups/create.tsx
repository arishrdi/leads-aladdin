import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, User, Building } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Leads', href: '/leads' },
    { title: 'Tambah Follow-up', href: '#' },
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
    lead: Lead;
    config: {
        followUpStages: Record<string, string>;
    };
}

export default function CreateFollowUp() {
    const { lead, config } = usePage<PageProps>().props;
    
    const { data, setData, post, processing, errors } = useForm({
        stage: '',
        scheduled_at: '',
        catatan: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/leads/${lead.id}/follow-ups`);
    };

    const formatPhoneNumber = (phone: string) => {
        if (phone.startsWith('62')) {
            return '+' + phone;
        }
        return phone;
    };

    // Set default date to tomorrow at 9 AM (Jakarta time)
    const getDefaultDateTime = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        // Convert to Jakarta timezone-aware string
        const jakartaOffset = 7 * 60; // Jakarta is UTC+7
        const utc = tomorrow.getTime() + (tomorrow.getTimezoneOffset() * 60000);
        const jakartaTime = new Date(utc + (jakartaOffset * 60000));
        return jakartaTime.toISOString().slice(0, 16);
    };

    // Initialize default scheduled time if not set
    if (!data.scheduled_at) {
        setData('scheduled_at', getDefaultDateTime());
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tambah Follow-up - ${lead.nama_pelanggan} - Leads Aladdin`} />
            
            <div className=" space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-primary">Tambah Follow-up Baru</h1>
                        <p className="text-gray-600">
                            Untuk {lead.sapaan} {lead.nama_pelanggan}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lead Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informasi Lead
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">
                                    {lead.sapaan} {lead.nama_pelanggan}
                                </span>
                            </div>

                            {lead.nama_masjid_instansi && (
                                <div className="flex items-center gap-3">
                                    <Building className="h-4 w-4 text-gray-400" />
                                    <span>{lead.nama_masjid_instansi}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <span className="text-gray-400">📱</span>
                                <div className="flex gap-2">
                                    <a 
                                        href={`tel:${lead.no_whatsapp}`}
                                        className="text-brand-primary hover:underline font-medium"
                                    >
                                        {formatPhoneNumber(lead.no_whatsapp)}
                                    </a>
                                    <span className="text-gray-400">|</span>
                                    <a 
                                        href={`https://wa.me/${lead.no_whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-brand-primary hover:underline"
                                    >
                                        WhatsApp
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Building className="h-4 w-4 text-gray-400" />
                                <span>
                                    {lead.cabang.nama_cabang} ({lead.cabang.lokasi})
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-gray-400" />
                                <span>PIC: {lead.user.name}</span>
                            </div>

                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Status saat ini:</strong> {lead.status}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Follow-up Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Follow-up</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Label htmlFor="stage">Tahap Follow-up *</Label>
                                    <Select value={data.stage} onValueChange={(value) => setData('stage', value)}>
                                        <SelectTrigger className={errors.stage ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih tahap follow-up" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(config.followUpStages).map(([key, description]) => (
                                                <SelectItem key={key} value={key}>
                                                    <div>
                                                        <div className="font-medium">{key}</div>
                                                        <div className="text-xs text-gray-500">{description}</div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.stage && (
                                        <p className="text-sm text-red-500 mt-1">{errors.stage}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="scheduled_at">Jadwal Follow-up *</Label>
                                    <DateTimePicker
                                        value={data.scheduled_at}
                                        onValueChange={(value) => setData('scheduled_at', value || '')}
                                        placeholder="Pilih tanggal dan waktu follow-up"
                                        hasError={!!errors.scheduled_at}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Pilih tanggal dan waktu yang tepat untuk menghubungi pelanggan
                                    </p>
                                    {errors.scheduled_at && (
                                        <p className="text-sm text-red-500 mt-1">{errors.scheduled_at}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="catatan">Catatan (Opsional)</Label>
                                    <Textarea
                                        id="catatan"
                                        value={data.catatan}
                                        onChange={(e) => setData('catatan', e.target.value)}
                                        placeholder="Tambahkan catatan atau rencana pembicaraan..."
                                        rows={4}
                                        className={errors.catatan ? 'border-red-500' : ''}
                                    />
                                    {errors.catatan && (
                                        <p className="text-sm text-red-500 mt-1">{errors.catatan}</p>
                                    )}
                                </div>

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
                                            disabled={processing}
                                            className="bg-[#2B5235] hover:bg-[#2B5235]/90 flex-1"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {processing ? 'Menyimpan...' : 'Jadwalkan Follow-up'}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </AppLayout>
    );
}