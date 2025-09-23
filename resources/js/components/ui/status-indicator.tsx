import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const statusVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        warm: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700",
        hot: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-700",
        customer: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700",
        cold: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700",
        exit: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700",
        crossSelling: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700",
        active: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700",
        inactive: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700",
        pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700",
        success: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700",
        warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700",
        error: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700",
      },
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1",
        lg: "text-base px-4 py-2",
      },
      withPulse: {
        true: "relative",
        false: "",
      },
    },
    defaultVariants: {
      variant: "pending",
      size: "md",
      withPulse: false,
    },
  }
);

interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  children: React.ReactNode;
  withDot?: boolean;
}

export function StatusIndicator({
  className,
  variant,
  size,
  withPulse,
  withDot = true,
  children,
  ...props
}: StatusIndicatorProps) {
  return (
    <div
      className={cn(statusVariants({ variant, size, withPulse, className }))}
      {...props}
    >
      {withDot && (
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-current opacity-60" />
          {withPulse && (
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-current animate-ping opacity-40" />
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// Helper function to map lead statuses to variants
export function getLeadStatusVariant(status: string): VariantProps<typeof statusVariants>['variant'] {
  const statusMap: Record<string, VariantProps<typeof statusVariants>['variant']> = {
    'WARM': 'warm',
    'HOT': 'hot',
    'CUSTOMER': 'customer',
    'COLD': 'cold',
    'EXIT': 'exit',
    'CROSS_SELLING': 'crossSelling',
  };
  
  return statusMap[status] || 'pending';
}

// Priority indicator
export function PriorityIndicator({ priority }: { priority: string }) {
  const priorityMap: Record<string, { variant: VariantProps<typeof statusVariants>['variant'], text: string }> = {
    'fasttrack': { variant: 'error', text: 'Fasttrack' },
    'normal': { variant: 'warning', text: 'Normal' },
    'rendah': { variant: 'success', text: 'Rendah' },
  };

  const config = priorityMap[priority] || { variant: 'pending', text: priority };

  return (
    <StatusIndicator variant={config.variant} size="sm" withDot={false}>
      {config.text}
    </StatusIndicator>
  );
}