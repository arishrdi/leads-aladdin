import { cn } from '@/lib/utils';

interface ChartPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}

interface ChartProps {
  data: ChartPoint[];
  type?: 'line' | 'bar' | 'area' | 'donut';
  width?: number;
  height?: number;
  className?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  colors?: string[];
  title?: string;
  subtitle?: string;
}

export function Chart({
  data,
  type = 'line',
  width = 400,
  height = 200,
  className,
  showGrid = true,
  showTooltip = true,
  colors = ['var(--brand-primary)', 'var(--brand-secondary)', '#059669', '#dc2626', '#7c3aed'],
  title,
  subtitle,
}: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center border border-dashed border-border rounded-lg", className)} style={{ width, height }}>
        <div className="text-center">
          <div className="text-2xl text-muted-foreground mb-2">📊</div>
          <p className="text-sm text-muted-foreground">Tidak ada data</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.y));
  const minValue = Math.min(...data.map(d => d.y));
  const range = maxValue - minValue || 1;
  
  const padding = 40;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);

  const getPointX = (index: number) => {
    return padding + (index / Math.max(data.length - 1, 1)) * chartWidth;
  };

  const getPointY = (value: number) => {
    return padding + chartHeight - ((value - minValue) / range) * chartHeight;
  };

  if (type === 'donut') {
    const total = data.reduce((sum, item) => sum + item.y, 0);
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(centerX, centerY) - 20;
    const innerRadius = outerRadius * 0.6;
    
    let currentAngle = -90;

    return (
      <div className={cn("relative", className)}>
        {title && <h3 className="text-lg font-semibold text-brand-primary mb-2">{title}</h3>}
        {subtitle && <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>}
        
        <svg width={width} height={height} className="overflow-visible">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.y / total) * 100 : 0;
            const angle = (percentage / 100) * 360;
            const color = item.color || colors[index % colors.length];
            
            const startAngle = (currentAngle * Math.PI) / 180;
            const endAngle = ((currentAngle + angle) * Math.PI) / 180;
            
            const x1 = centerX + outerRadius * Math.cos(startAngle);
            const y1 = centerY + outerRadius * Math.sin(startAngle);
            const x2 = centerX + outerRadius * Math.cos(endAngle);
            const y2 = centerY + outerRadius * Math.sin(endAngle);
            
            const x3 = centerX + innerRadius * Math.cos(endAngle);
            const y3 = centerY + innerRadius * Math.sin(endAngle);
            const x4 = centerX + innerRadius * Math.cos(startAngle);
            const y4 = centerY + innerRadius * Math.sin(startAngle);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${x1} ${y1}`,
              `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `L ${x3} ${y3}`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={color}
                  className="transition-all duration-300 hover:opacity-80"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                />
                {showTooltip && (
                  <title>{`${item.label || item.x}: ${item.y} (${percentage.toFixed(1)}%)`}</title>
                )}
              </g>
            );
          })}
          
          {/* Center text */}
          <text x={centerX} y={centerY - 10} textAnchor="middle" className="text-2xl font-bold fill-brand-primary">
            {total}
          </text>
          <text x={centerX} y={centerY + 15} textAnchor="middle" className="text-sm fill-muted-foreground">
            Total
          </text>
        </svg>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          {data.map((item, index) => {
            const percentage = total > 0 ? ((item.y / total) * 100).toFixed(1) : '0';
            const color = item.color || colors[index % colors.length];
            
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span className="font-medium">{item.label || item.x}</span>
                <span className="text-muted-foreground">({percentage}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {title && <h3 className="text-lg font-semibold text-brand-primary mb-2">{title}</h3>}
      {subtitle && <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>}
      
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid */}
        {showGrid && (
          <g>
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = padding + chartHeight * ratio;
              return (
                <line
                  key={`h-${index}`}
                  x1={padding}
                  y1={y}
                  x2={padding + chartWidth}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border opacity-50"
                />
              );
            })}
            
            {/* Vertical grid lines */}
            {data.map((_, index) => {
              const x = getPointX(index);
              return (
                <line
                  key={`v-${index}`}
                  x1={x}
                  y1={padding}
                  x2={x}
                  y2={padding + chartHeight}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border opacity-30"
                />
              );
            })}
          </g>
        )}

        {/* Chart Content */}
        {type === 'bar' && (
          <g>
            {data.map((point, index) => {
              const x = getPointX(index);
              const y = getPointY(point.y);
              const barWidth = Math.max(chartWidth / data.length * 0.6, 8);
              const barHeight = Math.max(padding + chartHeight - y, 2);
              const color = point.color || colors[index % colors.length];
              
              return (
                <g key={index}>
                  <rect
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={color}
                    className="transition-all duration-300 hover:opacity-80"
                    rx="2"
                  />
                  {showTooltip && (
                    <title>{`${point.label || point.x}: ${point.y}`}</title>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {(type === 'line' || type === 'area') && (
          <g>
            {/* Area fill */}
            {type === 'area' && (
              <path
                d={`
                  M ${getPointX(0)} ${padding + chartHeight}
                  ${data.map((point, index) => `L ${getPointX(index)} ${getPointY(point.y)}`).join(' ')}
                  L ${getPointX(data.length - 1)} ${padding + chartHeight}
                  Z
                `}
                fill={colors[0]}
                fillOpacity="0.1"
                className="transition-all duration-300"
              />
            )}
            
            {/* Line */}
            <path
              d={`
                M ${getPointX(0)} ${getPointY(data[0].y)}
                ${data.slice(1).map((point, index) => `L ${getPointX(index + 1)} ${getPointY(point.y)}`).join(' ')}
              `}
              fill="none"
              stroke={colors[0]}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            />
            
            {/* Points */}
            {data.map((point, index) => {
              const x = getPointX(index);
              const y = getPointY(point.y);
              
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill={colors[0]}
                    stroke="white"
                    strokeWidth="2"
                    className="transition-all duration-300 hover:r-6"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                  />
                  {showTooltip && (
                    <title>{`${point.label || point.x}: ${point.y}`}</title>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* Axes */}
        <g>
          {/* Y-axis */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={padding + chartHeight}
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
          />
          
          {/* X-axis */}
          <line
            x1={padding}
            y1={padding + chartHeight}
            x2={padding + chartWidth}
            y2={padding + chartHeight}
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
          />
        </g>

        {/* Labels */}
        <g>
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const value = Math.round(minValue + (range * (1 - ratio)));
            const y = padding + chartHeight * ratio;
            
            return (
              <text
                key={`y-${index}`}
                x={padding - 8}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-muted-foreground"
              >
                {value}
              </text>
            );
          })}
          
          {/* X-axis labels */}
          {data.map((point, index) => {
            const x = getPointX(index);
            
            return (
              <text
                key={`x-${index}`}
                x={x}
                y={padding + chartHeight + 20}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
              >
                {String(point.label || point.x)}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

// Preset analytics charts for common use cases
export function LeadTrendChart({ data }: { data: Array<{ period: string; leads: number; customers: number }> }) {
  const chartData = data.map(item => ({ x: item.period, y: item.leads, label: item.period }));
  
  return (
    <Chart
      data={chartData}
      type="area"
      width={400}
      height={200}
      title="Tren Leads"
      subtitle="Jumlah leads dari waktu ke waktu"
      colors={['var(--brand-primary)']}
    />
  );
}

export function ConversionChart({ data }: { data: Array<{ stage: string; count: number }> }) {
  const chartData = data.map(item => ({ x: item.stage, y: item.count, label: item.stage }));
  
  return (
    <Chart
      data={chartData}
      type="bar"
      width={500}
      height={250}
      title="Conversion Funnel"
      subtitle="Jumlah leads per tahap follow-up"
      colors={['var(--brand-primary)', 'var(--status-warm)', 'var(--status-hot)', 'var(--status-customer)']}
    />
  );
}

export function StatusDistributionChart({ data }: { data: Array<{ status: string; count: number; color?: string }> }) {
  const chartData = data.map(item => ({ 
    x: item.status, 
    y: item.count, 
    label: item.status,
    color: item.color 
  }));
  
  return (
    <Chart
      data={chartData}
      type="donut"
      width={300}
      height={300}
      title="Distribusi Status"
      subtitle="Persentase leads berdasarkan status"
    />
  );
}