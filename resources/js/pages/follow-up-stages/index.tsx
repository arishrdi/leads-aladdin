import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Settings, Eye, Edit, Trash2, Plus, ArrowUpDown, Grid, List, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kelola Tahap Follow-up', href: '#' },
];

interface FollowUpStageData {
    id: number;
    key: string;
    name: string;
    display_order: number;
    next_stage_key: string | null;
    is_active: boolean;
    followup_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    stages: FollowUpStageData[];
    availableStageKeys: string[];
}

export default function FollowUpStagesIndex() {
    const { stages, availableStageKeys } = usePage<Props>().props;
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; stage: FollowUpStageData | null }>({
        open: false,
        stage: null,
    });

    const handleDelete = (stage: FollowUpStageData) => {
        if (stage.followup_count > 0) {
            alert('Tidak dapat menghapus tahap yang sudah memiliki follow-up.');
            return;
        }
        setDeleteDialog({ open: true, stage });
    };

    const confirmDelete = () => {
        if (deleteDialog.stage) {
            router.delete(`/follow-up-stages/${deleteDialog.stage.id}`);
            setDeleteDialog({ open: false, stage: null });
        }
    };

    const getStatusBadge = (stage: FollowUpStageData) => {
        if (!stage.is_active) {
            return <Badge variant="secondary">Tidak Aktif</Badge>;
        }
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
    };

    const activeStages = stages.filter(stage => stage.is_active);
    const inactiveStages = stages.filter(stage => !stage.is_active);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Tahap Follow-up" />

            <div className="space-y-6">
                <div className="flex gap-4 lg:gap-0 lg:items-center justify-start lg:justify-between lg:flex-row flex-col">
                    <div className='w-full'>
                        <h1 className="text-2xl font-bold text-brand-primary">Kelola Tahap Follow-up</h1>
                        <p className="text-gray-600 mt-1">
                            Kelola tahapan follow-up yang digunakan dalam sistem leads
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full justify-between lg:justify-end">
                        <div className="flex border rounded-lg">
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
                            <Link href="/follow-up-stages/create">
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Tahap
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tahap</CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stages.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tahap Aktif</CardTitle>
                            <Settings className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{activeStages.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tahap Tidak Aktif</CardTitle>
                            <Settings className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">{inactiveStages.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Follow-up</CardTitle>
                            <ArrowUpDown className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {stages.reduce((sum, stage) => sum + stage.followup_count, 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stages List */}
                {viewMode === 'list' ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Tahap Follow-up</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Urutan</TableHead>
                                        <TableHead>Key</TableHead>
                                        <TableHead>Nama Tahap</TableHead>
                                        <TableHead>Tahap Selanjutnya</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Follow-up</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stages.map((stage) => (
                                        <TableRow key={stage.id}>
                                            <TableCell>
                                                <Badge variant="outline" className="font-mono">
                                                    {stage.display_order}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                    {stage.key}
                                                </code>
                                            </TableCell>
                                            <TableCell className="font-medium">{stage.name}</TableCell>
                                            <TableCell>
                                                {stage.next_stage_key ? (
                                                    <code className="text-sm bg-blue-100 px-2 py-1 rounded">
                                                        {stage.next_stage_key}
                                                    </code>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(stage)}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {stage.followup_count} follow-up
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/follow-up-stages/${stage.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/follow-up-stages/${stage.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        onClick={() => handleDelete(stage)}
                                                        disabled={stage.followup_count > 0}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stages.map((stage) => (
                            <Card key={stage.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{stage.name}</CardTitle>
                                        {getStatusBadge(stage)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono">
                                            #{stage.display_order}
                                        </Badge>
                                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                            {stage.key}
                                        </code>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Tahap Selanjutnya:</p>
                                        {stage.next_stage_key ? (
                                            <code className="text-sm bg-blue-100 px-2 py-1 rounded">
                                                {stage.next_stage_key}
                                            </code>
                                        ) : (
                                            <span className="text-gray-400">Tidak ada</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Follow-up:</p>
                                        <Badge variant="outline">
                                            {stage.followup_count} follow-up
                                        </Badge>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/follow-up-stages/${stage.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/follow-up-stages/${stage.id}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleDelete(stage)}
                                            disabled={stage.followup_count > 0}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, stage: null })}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Konfirmasi Hapus Tahap
                            </DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus tahap "{deleteDialog.stage?.name}"?
                                <br />
                                Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                onClick={() => setDeleteDialog({ open: false, stage: null })}
                            >
                                Batal
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Ya, Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}