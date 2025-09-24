import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Cabang {
    id: number;
    nama_cabang: string;
}

interface User {
    id: number;
    role: string;
    cabangs?: Cabang[];
}

interface BranchSelectorProps {
    className?: string;
}

export function BranchSelector({ className = '' }: BranchSelectorProps) {
    const { auth, activeBranch, availableBranches } = usePage().props as {
        auth: { user: User };
        activeBranch?: Cabang;
        availableBranches?: Cabang[];
    };

    const [selectedBranch, setSelectedBranch] = useState<string>(
        // activeBranch?.id?.toString() || 'all'
        activeBranch?.id?.toString() || availableBranches?.[0]?.id?.toString() || 'all'
    );

    // Update selected branch when page props change
    useEffect(() => {
        setSelectedBranch(activeBranch?.id?.toString() || 'all');
    }, [activeBranch]);

    const handleBranchChange = (value: string) => {
        const url = new URL(window.location.href);
        
        if (value === 'all') {
            url.searchParams.delete('active_branch');
        } else {
            url.searchParams.set('active_branch', value);
        }
        
        // Navigate to the same page with the new branch parameter
        router.get(url.pathname + url.search, {}, {
            preserveState: false,
            replace: true,
        });
    };

    // Don't show branch selector for marketing users (they only have one branch)
    if (auth.user.role === 'marketing') {
        return null;
    }

    const branches = availableBranches || auth.user.cabangs || [];
    
    // Don't show if no branches available
    if (branches.length === 0) {
        return null;
    }

    return (
        <div className={className}>
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1 rounded bg-brand-primary/10">
                    <Building className="h-4 w-4 text-brand-primary" />
                </div>
                <span className="text-sm font-medium text-brand-primary">Cabang Aktif</span>
            </div>
            <Select value={selectedBranch} onValueChange={handleBranchChange}>
                <SelectTrigger className="w-full touch-target border-brand-primary/20 hover:border-brand-primary/40 transition-colors">
                    <SelectValue placeholder="Pilih cabang" />
                </SelectTrigger>
                <SelectContent>
                    {auth.user.role === 'super_user' && (
                        <SelectItem value="all" className="font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                                Semua Cabang
                            </div>
                        </SelectItem>
                    )}
                    {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-brand-secondary"></div>
                                {branch.nama_cabang}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}