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
        activeBranch?.id?.toString() || 'all'
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
        <div className={`px-2 ${className}`}>
            <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-[#2B5235]" />
                <span className="text-sm font-medium text-[#2B5235]">Cabang Aktif</span>
            </div>
            <Select value={selectedBranch} onValueChange={handleBranchChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih cabang" />
                </SelectTrigger>
                <SelectContent>
                    {auth.user.role === 'super_user' && (
                        <SelectItem value="all">Semua Cabang</SelectItem>
                    )}
                    {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.nama_cabang}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}