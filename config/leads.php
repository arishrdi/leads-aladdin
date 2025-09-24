<?php

return [
    'statuses' => [
        'WARM' => 'Calon customer yang menghubungi untuk pertama kali',
        'HOT' => 'Sudah minta desain (smarttechno) / survey lokasi (Aladdin Karpet)',
        'CUSTOMER' => 'Memutuskan untuk membeli',
        'EXIT' => 'Memutuskan untuk tidak membeli',
        'COLD' => 'Customer tidak ada kejelasan setelah follow up 3 kali/ tidak ada nomer yg bisa dihubungi',
        'CROSS_SELLING' => 'Testimoni dan penawaran produk lain',
    ],

    // follow_up_stages moved to database - managed via /follow-up-stages (super_user only)

    'prioritas' => [
        'fasttrack' => 'Fasttrack',
        'normal' => 'Normal',
        'rendah' => 'Rendah',
    ],

    'sapaan' => [
        'Bapak' => 'Bapak',
        'Ibu' => 'Ibu',
    ],

    'alasan_closing' => [
        'Promo' => 'Promo',
        'Survei' => 'Survei',
        'Bonus' => 'Bonus',
        'Nawar' => 'Nawar',
        'Rekomendasi' => 'Rekomendasi',
        'Repeat Order' => 'Repeat Order',
    ],

    'alasan_tidak_closing' => [
        'Lokasi jauh' => 'Lokasi jauh',
        'Barang yang dicari tidak ada' => 'Barang yang dicari tidak ada',
        'Harga' => 'Harga',
        'Jasa Pasang Aja' => 'Jasa Pasang Aja',
        'Tidak ada respon' => 'Tidak ada respon',
    ],

    'dokumen_kategori' => [
        'penawaran' => 'Penawaran',
        'sketsa_survey' => 'Sketsa Survey',
        'lainnya' => 'Lainnya',
    ],

    'follow_up' => [
        'max_attempts_per_stage' => 3,
        'default_interval_days' => 3,
        'auto_scheduling' => [
            'enabled' => true,
            'first_followup_days' => 1,
            // stage_progression moved to database - managed via follow_up_stages.next_stage_key
        ],
    ],
];