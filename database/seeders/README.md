# Database Seeders

This directory contains seeders to populate the Leads Aladdin database with sample data for development and testing.

## Usage

Run all seeders:
```bash
php artisan db:seed
```

Run specific seeder:
```bash
php artisan db:seed --class=UserSeeder
```

Refresh database and run seeders:
```bash
php artisan migrate:fresh --seed
```

## Seeder Overview

### 1. UserSeeder
Creates system users with different roles:
- **Super User**: admin@leadsaladdin.com (password: password)
- **Supervisor**: supervisor@leadsaladdin.com (password: password)  
- **Marketing Users**: 5 marketing staff with realistic Indonesian names

### 2. CabangSeeder
Creates 5 branch offices:
- Jakarta Pusat, Jakarta Timur, Bogor, Tangerang, Bekasi
- Each with complete contact information and PIC

### 3. SumberLeadsSeeder
Creates lead sources:
- Google Ads, Facebook Ads, Referral, Website
- WhatsApp Business, Marketplace, Pameran, Cold Call

### 4. TipeKarpetSeeder
Creates carpet types:
- Karpet Masjid (Premium & Standard)
- Karpet Musholla, Sajadah, Roll, Tile, Custom

### 5. UserCabangSeeder
Assigns users to branches:
- Marketing users: 1-2 branches each
- Supervisor: All branches

### 6. LeadsSeeder
Creates 28 realistic leads:
- 8 handcrafted leads with realistic scenarios
- 20 random leads using Faker
- Various statuses: NEW, QUALIFIED, WARM, HOT, COLD, CONVERTED
- Realistic budgets, mosque/institution names, contact details

### 7. FollowUpSeeder
Creates follow-ups for all leads:
- Follow-up count based on lead status
- 10 progressive stages (kontak_awal → closing)
- Realistic notes and outcomes
- Future follow-ups for active leads

### 8. DokumenSeeder
Creates documents for qualified+ leads:
- **Penawaran**: Price quotes, catalogs, brochures
- **Sketsa Survey**: Survey results, layout sketches, calculations
- **Lainnya**: Certificates, maintenance guides, contracts
- Additional completion documents for converted leads

## Sample Login Credentials

**Super User:**
- Email: admin@leadsaladdin.com
- Password: password

**Supervisor:**
- Email: supervisor@leadsaladdin.com  
- Password: password

**Marketing (examples):**
- Email: ahmad@leadsaladdin.com
- Email: siti@leadsaladdin.com
- Password: password

## Data Statistics

After running seeders, you'll have:
- 7 users (1 super_user, 1 supervisor, 5 marketing)
- 5 branches across Jakarta area
- 8 lead sources
- 7 carpet types
- 28 leads with various statuses
- 100+ follow-ups across all stages
- 50+ documents in 3 categories

## Reset Data

To completely reset and reseed:
```bash
php artisan migrate:fresh --seed
```

This will drop all tables, recreate them, run migrations, and populate with fresh sample data.