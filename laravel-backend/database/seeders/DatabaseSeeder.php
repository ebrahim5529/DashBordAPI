<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // إنشاء مستخدم مدير للاختبار
        User::firstOrCreate(
            ['email' => 'admin@easyloman.com'],
            [
                'name' => 'مدير النظام',
                'phone' => '+968501234567',
                'password' => Hash::make('123456'),
                'role' => 'ADMIN',
                'is_active' => true,
            ]
        );

        // إنشاء مستخدم عادي للاختبار
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'phone' => '+968507654321',
                'password' => Hash::make('password'),
                'role' => 'USER',
                'is_active' => true,
            ]
        );

        // تشغيل Seeders الأخرى
        $this->call([
            CustomerSeeder::class,
            EmployeeSeeder::class,
            SupplierSeeder::class,
            SupplierInvoiceSeeder::class,
            SupplierPurchaseSeeder::class,
            PurchaseItemSeeder::class,
            // ScaffoldSeeder::class, // تم بالفعل
            ContractSeeder::class,
            PaymentSeeder::class,
        ]);
    }
}
