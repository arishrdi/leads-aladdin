import { cn } from '@/lib/utils';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const [theme, setTheme] = useState<Theme>('system');

    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored) {
            setTheme(stored);
        }
    }, []);

    const updateTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        
        const root = window.document.documentElement;
        
        if (newTheme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.toggle('dark', systemTheme === 'dark');
        } else {
            root.classList.toggle('dark', newTheme === 'dark');
        }
        
        localStorage.setItem('theme', newTheme);
    };

    const tabs: { value: Theme; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Terang' },
        { value: 'dark', icon: Moon, label: 'Gelap' },
        { value: 'system', icon: Monitor, label: 'Sistem' },
    ];

    return (
        <div className={cn('inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800', className)} {...props}>
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateTheme(value)}
                    className={cn(
                        'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                        theme === value
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    <Icon className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">{label}</span>
                </button>
            ))}
        </div>
    );
}
