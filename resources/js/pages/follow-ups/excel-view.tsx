import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Plus, CheckCircle, Circle, Filter, RotateCcw, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Follow-ups', href: '/follow-ups' },
    { title: 'Excel View', href: '#' },
];

interface Lead {
    id: number;
    nama_pelanggan: string;
    no_whatsapp: string;
    status: string;
    nama_masjid_instansi?: string;
    user: {
        name: string;
    };
    cabang: {
        nama_cabang: string;
    };
}

interface FollowUp {
    id: number;
    stage: string;
    attempt: number;
    attempt_1_completed: boolean;
    attempt_2_completed: boolean;
    attempt_3_completed: boolean;
    attempt_1_completed_at?: string;
    attempt_2_completed_at?: string;
    attempt_3_completed_at?: string;
    status: string;
    scheduled_at: string;
    leads: Lead;
}

interface PageProps {
    leads: Lead[];
    followUps: FollowUp[];
    config: {
        followUpStages: Record<string, string>;
    };
}

export default function ExcelViewFollowUps() {
    const { leads, followUps, config } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeads = leads.filter(lead =>
        lead.nama_pelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.no_whatsapp.includes(searchTerm) ||
        lead.nama_masjid_instansi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ''
    );

    const getLeadFollowUps = (leadId: number) => {
        return followUps.filter(fu => fu.leads.id === leadId);
    };

    const getStageFollowUps = (leadId: number, stage: string) => {
        const leadFollowUps = getLeadFollowUps(leadId);
        return leadFollowUps.filter(fu => fu.stage === stage);
    };

    const renderStageProgress = (leadId: number, stage: string) => {
        const stageFollowUps = getStageFollowUps(leadId, stage);
        if (stageFollowUps.length === 0) {
            return (
                <div className="flex items-center gap-1">
                    <Circle className="w-4 h-4 text-gray-300" />
                    <Circle className="w-4 h-4 text-gray-300" />
                    <Circle className="w-4 h-4 text-gray-300" />
                </div>
            );
        }

        // Aggregate attempts across all follow-ups for this stage
        // eslint-disable-next-line prefer-const
        let attempts = [false, false, false];
        // eslint-disable-next-line prefer-const
        let attemptDates: (string | null)[] = [null, null, null];

        // Sort follow-ups by attempt number to ensure correct order
        const sortedFollowUps = stageFollowUps.sort((a, b) => a.attempt - b.attempt);

        sortedFollowUps.forEach((followUp, index) => {
            // Each follow-up represents one attempt - mark it as completed if it has any completion
            if (index < 3) { // Only show up to 3 attempts
                const isCompleted = followUp.attempt_1_completed || followUp.attempt_2_completed || followUp.attempt_3_completed;
                attempts[index] = isCompleted;
                
                // Get the completion date from the completed attempt
                if (followUp.attempt_1_completed) {
                    attemptDates[index] = followUp.attempt_1_completed_at;
                } else if (followUp.attempt_2_completed) {
                    attemptDates[index] = followUp.attempt_2_completed_at;
                } else if (followUp.attempt_3_completed) {
                    attemptDates[index] = followUp.attempt_3_completed_at;
                }
            }
        });

        return (
            <div className="flex items-center gap-1">
                <div title={attempts[0] && attemptDates[0] ? new Date(attemptDates[0]).toLocaleDateString('id-ID') : 'Attempt 1'}>
                    {attempts[0] ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                        <Circle className="w-4 h-4 text-gray-300" />
                    )}
                </div>
                <div title={attempts[1] && attemptDates[1] ? new Date(attemptDates[1]).toLocaleDateString('id-ID') : 'Attempt 2'}>
                    {attempts[1] ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                        <Circle className="w-4 h-4 text-gray-300" />
                    )}
                </div>
                <div title={attempts[2] && attemptDates[2] ? new Date(attemptDates[2]).toLocaleDateString('id-ID') : 'Attempt 3'}>
                    {attempts[2] ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                        <Circle className="w-4 h-4 text-gray-300" />
                    )}
                </div>
            </div>
        );
    };

    const statusColors = {
        WARM: 'bg-blue-100 text-blue-800',
        HOT: 'bg-orange-100 text-orange-800',
        CUSTOMER: 'bg-green-100 text-green-800',
        EXIT: 'bg-red-100 text-red-800',
        COLD: 'bg-gray-100 text-gray-800',
        CROSS_SELLING: 'bg-purple-100 text-purple-800',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Excel View Follow-ups - Leads Aladdin" />
            
            <div className="max-w-full mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-2">
                            <FileSpreadsheet className="h-6 w-6" />
                            Excel View Follow-ups
                        </h1>
                        <p className="text-gray-600">
                            Tampilan seperti Excel untuk tracking progress follow-up
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/follow-ups">
                            <Button variant="outline">
                                Kembali ke List
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Cari nama pelanggan, nomor WhatsApp, atau instansi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Excel-like Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Progress Follow-up Semua Lead</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-300 px-2 py-2 text-left font-medium sticky left-0 bg-gray-50 z-10">
                                            Lead Info
                                        </th>
                                        {Object.entries(config.followUpStages).map(([stageKey, stageName]) => (
                                            <th key={stageKey} className="border border-gray-300 px-2 py-2 text-center font-medium min-w-[80px]">
                                                <div className="text-xs">{stageName}</div>
                                                <div className="text-xs text-gray-500">1 2 3</div>
                                            </th>
                                        ))}
                                        <th className="border border-gray-300 px-2 py-2 text-center font-medium">
                                            Status
                                        </th>
                                        <th className="border border-gray-300 px-2 py-2 text-center font-medium">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-2 py-2 sticky left-0 bg-white z-10">
                                                <div className="min-w-[200px]">
                                                    <div className="font-medium text-brand-primary">
                                                        {lead.nama_pelanggan}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {lead.no_whatsapp}
                                                    </div>
                                                    {lead.nama_masjid_instansi && (
                                                        <div className="text-xs text-gray-500">
                                                            {lead.nama_masjid_instansi}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-gray-500">
                                                        PIC: {lead.user.name}
                                                    </div>
                                                </div>
                                            </td>
                                            {Object.entries(config.followUpStages).map(([stageKey]) => (
                                                <td key={stageKey} className="border border-gray-300 px-2 py-2 text-center">
                                                    {renderStageProgress(lead.id, stageKey)}
                                                </td>
                                            ))}
                                            <td className="border border-gray-300 px-2 py-2 text-center">
                                                <Badge className={statusColors[lead.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
                                                    {lead.status}
                                                </Badge>
                                            </td>
                                            <td className="border border-gray-300 px-2 py-2 text-center">
                                                <Link href={`/leads/${lead.id}`}>
                                                    <Button size="sm" variant="outline" className="text-xs">
                                                        Detail
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>Follow-up Selesai</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Circle className="w-4 h-4 text-gray-300" />
                                    <span>Belum Follow-up</span>
                                </div>
                            </div>
                            <p className="text-xs text-blue-800 mt-2">
                                <strong>Catatan:</strong> Setiap kolom menunjukkan 3 attempt untuk setiap tahap follow-up. 
                                Klik "Detail" untuk melihat informasi lengkap dan melakukan follow-up.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-brand-primary">
                                {filteredLeads.length}
                            </div>
                            <div className="text-sm text-gray-500">Total Leads</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {filteredLeads.filter(lead => lead.status === 'CUSTOMER').length}
                            </div>
                            <div className="text-sm text-gray-500">Customer</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {filteredLeads.filter(lead => lead.status === 'HOT').length}
                            </div>
                            <div className="text-sm text-gray-500">Hot Leads</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-gray-600">
                                {filteredLeads.filter(lead => lead.status === 'COLD').length}
                            </div>
                            <div className="text-sm text-gray-500">Cold Leads</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}