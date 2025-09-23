<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Leads Aladdin</title>
    <style>
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2B5235;
            padding-bottom: 15px;
        }
        .header h1 {
            color: #2B5235;
            margin: 0;
            font-size: 24px;
        }
        .header .period {
            color: #666;
            margin-top: 5px;
        }
        .summary-grid {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .summary-row {
            display: table-row;
        }
        .summary-cell {
            display: table-cell;
            width: 33.33%;
            padding: 10px;
            vertical-align: top;
        }
        .summary-box {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            text-align: center;
        }
        .summary-value {
            font-size: 20px;
            font-weight: bold;
            color: #2B5235;
            margin-bottom: 5px;
        }
        .summary-label {
            color: #666;
            font-size: 11px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            color: #2B5235;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 1px solid #2B5235;
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #2B5235;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .status-badges {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }
        .status-row {
            display: table-row;
        }
        .status-cell {
            display: table-cell;
            width: 16.67%;
            padding: 5px;
        }
        .status-badge {
            background-color: #f0f0f0;
            border-radius: 5px;
            padding: 10px;
            text-align: center;
            font-size: 11px;
        }
        .status-badge.warm { background-color: #fef3cd; }
        .status-badge.hot { background-color: #fed7aa; }
        .status-badge.customer { background-color: #d1fae5; }
        .status-badge.exit { background-color: #fecaca; }
        .status-badge.cold { background-color: #f3f4f6; }
        .status-badge.cross-selling { background-color: #e9d5ff; }
        .status-number {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 3px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 10px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .currency {
            color: #2B5235;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Leads Aladdin</h1>
        <div class="period">Periode: {{ date('d/m/Y', strtotime($date_from)) }} - {{ date('d/m/Y', strtotime($date_to)) }}</div>
    </div>

    <!-- Summary Statistics -->
    <div class="summary-grid">
        <div class="summary-row">
            <div class="summary-cell">
                <div class="summary-box">
                    <div class="summary-value">{{ number_format($summary['total_leads']) }}</div>
                    <div class="summary-label">Total Leads</div>
                </div>
            </div>
            <div class="summary-cell">
                <div class="summary-box">
                    <div class="summary-value">{{ number_format($summary['customer_leads']) }}</div>
                    <div class="summary-label">Customer</div>
                </div>
            </div>
            <div class="summary-cell">
                <div class="summary-box">
                    <div class="summary-value">{{ number_format($summary['conversion_rate'], 1) }}%</div>
                    <div class="summary-label">Tingkat Konversi</div>
                </div>
            </div>
        </div>
        <div class="summary-row">
            <div class="summary-cell">
                <div class="summary-box">
                    <div class="summary-value currency">{{ 'Rp ' . number_format($summary['total_revenue'], 0, ',', '.') }}</div>
                    <div class="summary-label">Total Pendapatan</div>
                </div>
            </div>
            <div class="summary-cell">
                <div class="summary-box">
                    <div class="summary-value currency">{{ 'Rp ' . number_format($summary['average_deal'], 0, ',', '.') }}</div>
                    <div class="summary-label">Rata-rata Deal</div>
                </div>
            </div>
            <div class="summary-cell">
                <div class="summary-box">
                    <div class="summary-value">{{ now()->format('d/m/Y H:i') }}</div>
                    <div class="summary-label">Waktu Laporan</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Status Breakdown -->
    <div class="section">
        <div class="section-title">Breakdown Status Leads</div>
        <div class="status-badges">
            <div class="status-row">
                <div class="status-cell">
                    <div class="status-badge warm">
                        <div class="status-number">{{ $summary['warm_leads'] }}</div>
                        <div>WARM</div>
                    </div>
                </div>
                <div class="status-cell">
                    <div class="status-badge hot">
                        <div class="status-number">{{ $summary['hot_leads'] }}</div>
                        <div>HOT</div>
                    </div>
                </div>
                <div class="status-cell">
                    <div class="status-badge customer">
                        <div class="status-number">{{ $summary['customer_leads'] }}</div>
                        <div>CUSTOMER</div>
                    </div>
                </div>
                <div class="status-cell">
                    <div class="status-badge exit">
                        <div class="status-number">{{ $summary['exit_leads'] }}</div>
                        <div>EXIT</div>
                    </div>
                </div>
                <div class="status-cell">
                    <div class="status-badge cold">
                        <div class="status-number">{{ $summary['cold_leads'] }}</div>
                        <div>COLD</div>
                    </div>
                </div>
                <div class="status-cell">
                    <div class="status-badge cross-selling">
                        <div class="status-number">{{ $summary['cross_selling_leads'] }}</div>
                        <div>CROSS_SELLING</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Top Performers -->
    @if(count($performance['top_performers']) > 0)
    <div class="section">
        <div class="section-title">Marketing Terbaik</div>
        <table>
            <thead>
                <tr>
                    <th>Ranking</th>
                    <th>Nama Marketing</th>
                    <th>Total Leads</th>
                    <th>Konversi</th>
                    <th>Total Pendapatan</th>
                </tr>
            </thead>
            <tbody>
                @foreach($performance['top_performers'] as $index => $performer)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $performer->name }}</td>
                    <td>{{ number_format($performer->total_leads) }}</td>
                    <td>{{ number_format($performer->converted_leads) }}</td>
                    <td class="currency">Rp {{ number_format($performer->total_revenue, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <!-- Branch Performance -->
    @if(count($performance['branch_performance']) > 0)
    <div class="section">
        <div class="section-title">Performa Cabang</div>
        <table>
            <thead>
                <tr>
                    <th>Ranking</th>
                    <th>Nama Cabang</th>
                    <th>Total Leads</th>
                    <th>Konversi</th>
                    <th>Total Pendapatan</th>
                </tr>
            </thead>
            <tbody>
                @foreach($performance['branch_performance'] as $index => $branch)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $branch->nama_cabang }}</td>
                    <td>{{ number_format($branch->total_leads) }}</td>
                    <td>{{ number_format($branch->converted_leads) }}</td>
                    <td class="currency">Rp {{ number_format($branch->total_revenue, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <!-- Lead Sources -->
    @if(count($charts['lead_sources']) > 0)
    <div class="section">
        <div class="section-title">Sumber Leads Terbaik</div>
        <table>
            <thead>
                <tr>
                    <th>Ranking</th>
                    <th>Sumber Leads</th>
                    <th>Total Leads</th>
                    <th>Persentase</th>
                </tr>
            </thead>
            <tbody>
                @foreach($charts['lead_sources'] as $index => $source)
                @php
                    $percentage = $summary['total_leads'] > 0 ? ($source->total / $summary['total_leads']) * 100 : 0;
                @endphp
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $source->nama }}</td>
                    <td>{{ number_format($source->total) }}</td>
                    <td>{{ number_format($percentage, 1) }}%</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <div class="footer">
        <p>Laporan digenerate pada {{ now()->format('d/m/Y H:i:s') }} WIB</p>
        <p>© {{ date('Y') }} Leads Aladdin - Sistem Manajemen Leads</p>
    </div>
</body>
</html>