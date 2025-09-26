import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Phone, User, Building, Calendar, Clock, CheckCircle, XCircle, Circle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Follow-ups', href: '/follow-ups' },
    { title: 'Detail Follow-up', href: '#' },
];

interface FollowUp {
    id: number;
    stage: string;
    attempt: number;
    attempt_count: number;
    attempt_1_completed: boolean;
    attempt_2_completed: boolean;
    attempt_3_completed: boolean;
    attempt_1_completed_at?: string;
    attempt_2_completed_at?: string;
    attempt_3_completed_at?: string;
    completed_attempts_count: number;
    next_attempt_number: number;
    scheduled_at: string;
    scheduled_at_jakarta: string;
    status: string;
    catatan: string;
    auto_scheduled?: boolean;
    leads: {
        id: number;
        nama_pelanggan: string;
        no_whatsapp: string;
        nama_masjid_instansi: string;
        status: string;
        sapaan: string;
        cabang: {
            nama_cabang: string;
            lokasi: string;
        };
    };
    user: {
        name: string;
    };
}

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            role: string;
        };
    };
    followUp: FollowUp;
    config: {
        followUpStages: Record<string, string>;
        alasanClosing: Record<string, string>;
        alasanTidakClosing: Record<string, string>;
    };
    canEdit: boolean;
}

export default function ShowFollowUp() {
    const { auth, followUp, config, canEdit } = usePage<PageProps>().props;
    const [showCompleteForm, setShowCompleteForm] = useState(false);
    const [showRescheduleForm, setShowRescheduleForm] = useState(false);

    const { data: completeData, setData: setCompleteData, patch: submitComplete, processing: completing, errors: completeErrors } = useForm({
        ada_respon: false,
        catatan: '',
        lead_status: followUp.leads.status,
        alasan_closing: '',
        alasan_tidak_closing: '',
        auto_schedule_next: true,
        progress_to_next_stage: false,
        next_stage: '',
    });

    const { data: rescheduleData, setData: setRescheduleData, patch: submitReschedule, processing: rescheduling, errors: rescheduleErrors } = useForm({
        scheduled_at: followUp.scheduled_at_jakarta ? new Date(followUp.scheduled_at_jakarta).toISOString().slice(0, 16) : '',
    });

    const statusColors = {
        WARM: 'bg-blue-100 text-blue-800',
        HOT: 'bg-orange-100 text-orange-800',
        CUSTOMER: 'bg-green-100 text-green-800',
        EXIT: 'bg-red-100 text-red-800',
        COLD: 'bg-gray-100 text-gray-800',
        CROSS_SELLING: 'bg-purple-100 text-purple-800',
    };

    const formatPhoneNumber = (phone: string) => {
        if (phone.startsWith('62')) {
            return '+' + phone;
        }
        return phone;
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleComplete: FormEventHandler = (e) => {
        e.preventDefault();
        submitComplete(`/follow-ups/${followUp.id}/complete`, {
            onSuccess: () => {
                setShowCompleteForm(false);
            }
        });
    };

    const handleReschedule: FormEventHandler = (e) => {
        e.preventDefault();
        submitReschedule(`/follow-ups/${followUp.id}/reschedule`, {
            onSuccess: () => {
                setShowRescheduleForm(false);
            }
        });
    };

    const availableStatuses = ['WARM', 'HOT', 'CUSTOMER', 'EXIT', 'COLD', 'CROSS_SELLING'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Follow-up ${followUp.leads.nama_pelanggan} - Leads Aladdin`} />
            
            <div className=" space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-brand-primary">
                            Follow-up: {followUp.stage}
                        </h1>
                        <p className="text-gray-600">
                            {followUp.leads.sapaan} {followUp.leads.nama_pelanggan} - Percobaan #{followUp.attempt}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Badge className={statusColors[followUp.leads.status as keyof typeof statusColors]}>
                            {followUp.leads.status}
                        </Badge>
                        {followUp.auto_scheduled && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                Auto-scheduled
                            </Badge>
                        )}
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
                                    {followUp.leads.sapaan} {followUp.leads.nama_pelanggan}
                                </span>
                            </div>

                            {followUp.leads.nama_masjid_instansi && (
                                <div className="flex items-center gap-3">
                                    <Building className="h-4 w-4 text-gray-400" />
                                    <span>{followUp.leads.nama_masjid_instansi}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <div className="flex gap-2">
                                    <a 
                                        href={`tel:${followUp.leads.no_whatsapp}`}
                                        className="text-brand-primary hover:underline font-medium"
                                    >
                                        {formatPhoneNumber(followUp.leads.no_whatsapp)}
                                    </a>
                                    <span className="text-gray-400">|</span>
                                    <a 
                                        href={`https://wa.me/${followUp.leads.no_whatsapp}`}
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
                                    {followUp.leads.cabang.nama_cabang} ({followUp.leads.cabang.lokasi})
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>Dijadwalkan: {formatDateTime(followUp.scheduled_at_jakarta)}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-gray-400" />
                                <span>PIC: {followUp.user.name}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Follow-up Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Detail Follow-up
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="font-medium text-gray-700">Tahap:</span>
                                <p className="text-gray-600">{followUp.stage}</p>
                                {config.followUpStages[followUp.stage] && (
                                    <p className="text-sm text-gray-500">{config.followUpStages[followUp.stage]}</p>
                                )}
                            </div>

                            <div>
                                <span className="font-medium text-gray-700">Percobaan:</span>
                                <p className="text-gray-600">#{followUp.attempt} dari maksimal 3 percobaan</p>
                            </div>

                            {/* Excel-like Progress Tracking */}
                            <div>
                                <span className="font-medium text-gray-700">Progress Tracking:</span>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1">
                                        {followUp.attempt_1_completed ? (
                                            <CheckCircle className="w-5 h-5 text-green-600" title={`Attempt 1: ${followUp.attempt_1_completed_at ? new Date(followUp.attempt_1_completed_at).toLocaleDateString('id-ID') : 'Completed'}`} />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-300" title="Attempt 1: Not completed" />
                                        )}
                                        {followUp.attempt_2_completed ? (
                                            <CheckCircle className="w-5 h-5 text-green-600" title={`Attempt 2: ${followUp.attempt_2_completed_at ? new Date(followUp.attempt_2_completed_at).toLocaleDateString('id-ID') : 'Completed'}`} />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-300" title="Attempt 2: Not completed" />
                                        )}
                                        {followUp.attempt_3_completed ? (
                                            <CheckCircle className="w-5 h-5 text-green-600" title={`Attempt 3: ${followUp.attempt_3_completed_at ? new Date(followUp.attempt_3_completed_at).toLocaleDateString('id-ID') : 'Completed'}`} />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-300" title="Attempt 3: Not completed" />
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        ({followUp.completed_attempts_count}/3 selesai)
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Attempt berikutnya: #{followUp.next_attempt_number}
                                </p>
                            </div>

                            <div>
                                <span className="font-medium text-gray-700">Status:</span>
                                <Badge className="ml-2">
                                    {followUp.status === 'scheduled' ? 'Dijadwalkan' : followUp.status}
                                </Badge>
                            </div>

                            {followUp.catatan && (
                                <div>
                                    <span className="font-medium text-gray-700">Catatan Sebelumnya:</span>
                                    <p className="text-gray-600">{followUp.catatan}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons - Only for Marketing users who can edit */}
                {followUp.status === 'scheduled' && canEdit && (
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={() => setShowCompleteForm(true)}
                            className="bg-[#2B5235] hover:bg-[#1e3d26] flex-1"
                            disabled={showCompleteForm || showRescheduleForm}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Selesaikan Follow-up
                        </Button>
                        <Button
                            onClick={() => setShowRescheduleForm(true)}
                            variant="outline"
                            className="flex-1"
                            disabled={showCompleteForm || showRescheduleForm}
                        >
                            <Calendar className="h-4 w-4 mr-2" />
                            Ubah Jadwal
                        </Button>
                    </div>
                )}

                {/* Read-only message for supervisors and super users */}
                {!canEdit && (
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="pt-6">
                            <div className="text-center text-blue-800">
                                <p className="font-medium">Mode Tampilan Saja</p>
                                <p className="text-sm text-blue-600 mt-1">
                                    Anda dapat melihat detail follow-up ini, tetapi tidak dapat melakukan perubahan.
                                    {auth.user.role === 'supervisor' && ' Hanya marketing yang dapat mengelola follow-up.'}
                                    {auth.user.role === 'super_user' && ' Hanya marketing yang dapat mengelola follow-up.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Complete Follow-up Form - Only for users who can edit */}
                {showCompleteForm && canEdit && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Selesaikan Follow-up</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleComplete} className="space-y-4">
                                <div>
                                    <Label>Apakah ada respon dari pelanggan?</Label>
                                    <div className="flex gap-4 mt-2">
                                        <Button
                                            type="button"
                                            variant={completeData.ada_respon ? "default" : "outline"}
                                            onClick={() => setCompleteData('ada_respon', true)}
                                            className={completeData.ada_respon ? "bg-[#2B5235] hover:bg-[#1e3d26]" : ""}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Ada Respon
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={!completeData.ada_respon ? "default" : "outline"}
                                            onClick={() => setCompleteData('ada_respon', false)}
                                            className={!completeData.ada_respon ? "bg-red-600 hover:bg-red-700" : ""}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Tidak Ada Respon
                                        </Button>
                                    </div>
                                    {completeErrors.ada_respon && (
                                        <p className="text-sm text-red-500 mt-1">{completeErrors.ada_respon}</p>
                                    )}
                                </div>

                                {completeData.ada_respon && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="lead_status">Update Status Lead</Label>
                                            <Select value={completeData.lead_status} onValueChange={(value) => setCompleteData('lead_status', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableStatuses.map((status) => (
                                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {completeErrors.lead_status && (
                                                <p className="text-sm text-red-500 mt-1">{completeErrors.lead_status}</p>
                                            )}
                                        </div>

                                        {/* Closing Reason for CUSTOMER status */}
                                        {completeData.lead_status === 'CUSTOMER' && (
                                            <div>
                                                <Label htmlFor="alasan_closing">Alasan Closing *</Label>
                                                <Select value={completeData.alasan_closing} onValueChange={(value) => setCompleteData('alasan_closing', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih alasan closing..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(config.alasanClosing).map(([key, value]) => (
                                                            <SelectItem key={key} value={key}>{value}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {completeErrors.alasan_closing && (
                                                    <p className="text-sm text-red-500 mt-1">{completeErrors.alasan_closing}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Not Closing Reason for EXIT status */}
                                        {completeData.lead_status === 'EXIT' && (
                                            <div>
                                                <Label htmlFor="alasan_tidak_closing">Alasan Tidak Closing *</Label>
                                                <Select value={completeData.alasan_tidak_closing} onValueChange={(value) => setCompleteData('alasan_tidak_closing', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih alasan tidak closing..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(config.alasanTidakClosing).map(([key, value]) => (
                                                            <SelectItem key={key} value={key}>{value}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {completeErrors.alasan_tidak_closing && (
                                                    <p className="text-sm text-red-500 mt-1">{completeErrors.alasan_tidak_closing}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Stage Progression Option */}
                                        <div>
                                            <Label>Apakah pelanggan menunjukkan minat untuk lanjut ke tahap berikutnya?</Label>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <Checkbox
                                                    id="progress_to_next_stage"
                                                    checked={completeData.progress_to_next_stage}
                                                    onCheckedChange={(checked) => setCompleteData('progress_to_next_stage', checked)}
                                                />
                                                <Label htmlFor="progress_to_next_stage" className="text-sm">
                                                    Ya, pelanggan siap untuk tahap berikutnya
                                                </Label>
                                            </div>
                                            {completeErrors.progress_to_next_stage && (
                                                <p className="text-sm text-red-500 mt-1">{completeErrors.progress_to_next_stage}</p>
                                            )}
                                        </div>

                                        {/* Next Stage Selection */}
                                        {completeData.progress_to_next_stage && (
                                            <div>
                                                <Label htmlFor="next_stage">Pilih Tahap Berikutnya</Label>
                                                <Select value={completeData.next_stage} onValueChange={(value) => setCompleteData('next_stage', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih tahap untuk follow-up berikutnya..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(config.followUpStages).map(([key, value]) => (
                                                            <SelectItem key={key} value={key}>{value}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {completeErrors.next_stage && (
                                                    <p className="text-sm text-red-500 mt-1">{completeErrors.next_stage}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Tahap bisa dilewati sesuai dengan kebutuhan dan respon pelanggan
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="catatan">Catatan Follow-up</Label>
                                    <Textarea
                                        id="catatan"
                                        value={completeData.catatan}
                                        onChange={(e) => setCompleteData('catatan', e.target.value)}
                                        placeholder="Tuliskan hasil follow-up, respon pelanggan, atau informasi penting lainnya..."
                                        rows={4}
                                    />
                                    {completeErrors.catatan && (
                                        <p className="text-sm text-red-500 mt-1">{completeErrors.catatan}</p>
                                    )}
                                </div>

                                {/* Auto-schedule next stage option */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="auto_schedule_next"
                                        checked={completeData.auto_schedule_next}
                                        onCheckedChange={(checked) => setCompleteData('auto_schedule_next', checked)}
                                    />
                                    <Label htmlFor="auto_schedule_next" className="text-sm">
                                        Jadwalkan tahap follow-up berikutnya secara otomatis
                                    </Label>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={completing} className="bg-[#2B5235] hover:bg-[#1e3d26]">
                                        {completing ? 'Menyimpan...' : 'Selesaikan Follow-up'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowCompleteForm(false)}
                                        disabled={completing}
                                    >
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Reschedule Form - Only for users who can edit */}
                {showRescheduleForm && canEdit && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Ubah Jadwal Follow-up</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleReschedule} className="space-y-4">
                                <div>
                                    <Label htmlFor="scheduled_at">Jadwal Baru</Label>
                                    <DateTimePicker
                                        value={rescheduleData.scheduled_at}
                                        onValueChange={(value) => setRescheduleData('scheduled_at', value || '')}
                                        placeholder="Pilih tanggal dan waktu baru"
                                        hasError={!!rescheduleErrors.scheduled_at}
                                    />
                                    {rescheduleErrors.scheduled_at && (
                                        <p className="text-sm text-red-500 mt-1">{rescheduleErrors.scheduled_at}</p>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={rescheduling}>
                                        {rescheduling ? 'Menyimpan...' : 'Ubah Jadwal'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowRescheduleForm(false)}
                                        disabled={rescheduling}
                                    >
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}