import { cn } from '@/lib/utils';

interface DataPoint {
  value: number;
  label?: string;
  color?: string;
}

interface MiniChartProps {
  data: DataPoint[];
  type?: 'bar' | 'line' | 'area';
  height?: number;
  className?: string;
  showLabels?: boolean;
  showGrid?: boolean;
}

export function MiniChart({
  data,
  type = 'bar',
  height = 60,
  className,
  showLabels = false,
  showGrid = false,
}: MiniChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/20 rounded", className)} style={{ height }}>
        <span className="text-xs text-muted-foreground">No data</span>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const getBarHeight = (value: number) => {
    return ((value - minValue) / range) * (height - 20);
  };

  const getLinePoints = () => {
    const width = 200;
    const stepX = width / (data.length - 1 || 1);
    
    return data.map((point, index) => {
      const x = index * stepX;
      const y = height - 10 - getBarHeight(point.value);
      return `${x},${y}`;
    }).join(' ');
  };

  if (type === 'bar') {
    return (
      <div className={cn("flex items-end gap-1 p-2", className)} style={{ height }}>
        {data.map((point, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={cn(
                "w-full rounded-sm transition-all duration-300",
                point.color || "bg-brand-primary"
              )}
              style={{
                height: Math.max(getBarHeight(point.value), 2),
                backgroundColor: point.color || "var(--brand-primary)",
              }}
            />
            {showLabels && point.label && (
              <span className="text-xs text-muted-foreground mt-1">{point.label}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'line' || type === 'area') {
    return (
      <div className={cn("relative", className)} style={{ height }}>
        <svg width="100%" height={height} className="overflow-visible">
          {showGrid && (
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted/20"/>
              </pattern>
            </defs>
          )}
          
          {showGrid && (
            <rect width="100%" height="100%" fill="url(#grid)" />
          )}
          
          {type === 'area' && (
            <path
              d={`M 0,${height} L ${getLinePoints()} L 100%,${height} Z`}
              fill="var(--brand-primary)"
              fillOpacity="0.1"
              className="transition-all duration-300"
            />
          )}
          
          <polyline
            points={getLinePoints()}
            fill="none"
            stroke="var(--brand-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />
          
          {data.map((_, index) => {
            const width = 200;
            const stepX = width / (data.length - 1 || 1);
            const x = (index * stepX / 200) * 100;
            const y = height - 10 - getBarHeight(data[index].value);
            
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={y}
                r="3"
                fill="var(--brand-primary)"
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  return null;
}

// Preset chart types for common dashboard needs
export function TrendChart({ data, trend }: { data: number[]; trend: 'up' | 'down' | 'stable' }) {
  const chartData = data.map((value, index) => ({ value, label: `${index + 1}` }));
  
  const trendColors = {
    up: '#059669',
    down: '#dc2626',
    stable: '#6b7280',
  };

  return (
    <div className="flex items-center gap-2">
      <MiniChart 
        data={chartData} 
        type="line" 
        height={30} 
        className="flex-1"
      />
      <div className={`text-xs font-medium`} style={{ color: trendColors[trend] }}>
        {trend === 'up' && '↗'}
        {trend === 'down' && '↘'}
        {trend === 'stable' && '→'}
      </div>
    </div>
  );
}

export function StatusDistribution({ 
  data 
}: { 
  data: Array<{ status: string; count: number; color: string }> 
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="flex w-full h-2 rounded-full overflow-hidden bg-muted/20">
      {data.map((item, index) => {
        const percentage = total > 0 ? (item.count / total) * 100 : 0;
        return (
          <div
            key={index}
            className="transition-all duration-300"
            style={{
              width: `${percentage}%`,
              backgroundColor: item.color,
            }}
            title={`${item.status}: ${item.count} (${percentage.toFixed(1)}%)`}
          />
        );
      })}
    </div>
  );
}