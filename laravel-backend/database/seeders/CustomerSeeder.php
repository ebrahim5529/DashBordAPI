<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            [
                'customer_number' => 'CUST-000001',
                'name' => 'أحمد محمد علي',
                'email' => 'ahmad@example.com',
                'phone' => '+968 9123 4567',
                'phones' => json_encode(['+968 9123 4567', '+968 9876 5432']),
                'address' => 'مسقط، ولاية بوشر',
                'nationality' => 'عماني',
                'customer_type' => 'INDIVIDUAL',
                'id_number' => '12345678',
                'status' => 'ACTIVE',
                'registration_date' => now()->subMonths(6),
                'rating' => 5,
                'notes' => 'عميل ممتاز، الدفع في الوقت المحدد',
            ],
            [
                'customer_number' => 'CUST-000002',
                'name' => 'شركة البناء الحديث',
                'email' => 'info@modernbuild.om',
                'phone' => '+968 2234 5678',
                'phones' => json_encode(['+968 2234 5678']),
                'address' => 'صلالة، الحافة',
                'nationality' => 'عماني',
                'customer_type' => 'COMPANY',
                'commercial_record' => 'CR-123456',
                'status' => 'ACTIVE',
                'registration_date' => now()->subMonths(3),
                'rating' => 4,
                'notes' => 'شركة كبيرة، مشاريع متعددة',
            ],
            [
                'customer_number' => 'CUST-000003',
                'name' => 'فاطمة سعيد',
                'email' => 'fatima@example.com',
                'phone' => '+968 9234 5678',
                'phones' => json_encode(['+968 9234 5678']),
                'address' => 'نزوى، وادي الكبير',
                'nationality' => 'عماني',
                'customer_type' => 'INDIVIDUAL',
                'id_number' => '87654321',
                'status' => 'ACTIVE',
                'registration_date' => now()->subMonths(1),
                'guarantor_name' => 'سعيد محمد',
                'guarantor_phone' => '+968 9876 1234',
                'guarantor_id' => '11223344',
                'rating' => 5,
            ],
            [
                'customer_number' => 'CUST-000004',
                'name' => 'خالد إبراهيم',
                'email' => 'khaled@example.com',
                'phone' => '+968 9345 6789',
                'phones' => json_encode(['+968 9345 6789']),
                'address' => 'صحار، الطريف',
                'nationality' => 'عماني',
                'customer_type' => 'INDIVIDUAL',
                'id_number' => '11112222',
                'status' => 'INACTIVE',
                'registration_date' => now()->subYear(),
                'rating' => 3,
                'warnings' => 'تأخر في الدفع مرتين',
            ],
            [
                'customer_number' => 'CUST-000005',
                'name' => 'مؤسسة الأعمال المتحدة',
                'email' => 'info@unitedbiz.om',
                'phone' => '+968 2345 6789',
                'phones' => json_encode(['+968 2345 6789', '+968 2345 6780']),
                'address' => 'مسقط، القرم',
                'nationality' => 'عماني',
                'customer_type' => 'COMPANY',
                'commercial_record' => 'CR-789456',
                'status' => 'ACTIVE',
                'registration_date' => now()->subMonths(8),
                'rating' => 5,
                'notes' => 'شريك استراتيجي',
            ],
            [
                'customer_number' => 'CUST-000006',
                'name' => 'محمد عبدالله',
                'email' => 'mohammed@example.com',
                'phone' => '+968 9456 7890',
                'phones' => json_encode(['+968 9456 7890']),
                'address' => 'الرستاق، الحوقين',
                'nationality' => 'عماني',
                'customer_type' => 'INDIVIDUAL',
                'id_number' => '33334444',
                'status' => 'ACTIVE',
                'registration_date' => now()->subMonths(2),
                'rating' => 4,
            ],
            [
                'customer_number' => 'CUST-000007',
                'name' => 'عائشة حسن',
                'email' => 'aisha@example.com',
                'phone' => '+968 9567 8901',
                'phones' => json_encode(['+968 9567 8901']),
                'address' => 'عبري، السليف',
                'nationality' => 'عماني',
                'customer_type' => 'INDIVIDUAL',
                'id_number' => '55556666',
                'status' => 'SUSPENDED',
                'registration_date' => now()->subMonths(10),
                'rating' => 2,
                'warnings' => 'تأخر في الدفع لأكثر من 3 أشهر',
            ],
            [
                'customer_number' => 'CUST-000008',
                'name' => 'شركة التطوير العقاري',
                'email' => 'info@realestate.om',
                'phone' => '+968 2456 7890',
                'phones' => json_encode(['+968 2456 7890']),
                'address' => 'مسقط، الموالح',
                'nationality' => 'عماني',
                'customer_type' => 'COMPANY',
                'commercial_record' => 'CR-321654',
                'status' => 'ACTIVE',
                'registration_date' => now()->subMonths(5),
                'rating' => 5,
            ],
        ];

        foreach ($customers as $customerData) {
            Customer::firstOrCreate(
                ['customer_number' => $customerData['customer_number']],
                $customerData
            );
        }

        $this->command->info('تم إنشاء ' . count($customers) . ' عميل بنجاح!');
    }
}

