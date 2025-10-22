<?php

namespace Database\Seeders;

use App\Models\Contract;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContractSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Customer::all();
        
        if ($customers->isEmpty()) {
            $this->command->warn('لا يوجد عملاء! قم بتشغيل CustomerSeeder أولاً.');
            return;
        }

        $user = User::first();
        if (!$user) {
            $this->command->warn('لا يوجد مستخدمين!');
            return;
        }

        $statuses = ['ACTIVE', 'EXPIRED', 'CANCELLED', 'COMPLETED'];
        $contractTypes = ['RENTAL', 'SALE'];
        $contractsCount = Contract::count();

        foreach ($customers->take(8) as $customer) {
            // إنشاء 2-3 عقود لكل عميل
            $numContracts = rand(2, 3);
            
            for ($i = 0; $i < $numContracts; $i++) {
                $contractsCount++;
                $startDate = now()->subMonths(rand(1, 12));
                $endDate = $startDate->copy()->addMonths(rand(6, 24));
                
                $totalValue = rand(1000, 10000);
                $discount = rand(0, 1000);
                $totalAfterDiscount = $totalValue - $discount;

                Contract::create([
                    'contract_number' => 'CONT-' . str_pad($contractsCount, 6, '0', STR_PAD_LEFT),
                    'contract_date' => $startDate,
                    'customer_id' => $customer->id,
                    'customer_name' => $customer->name,
                    'delivery_address' => $customer->address ?? 'مسقط، عمان',
                    'total_contract_value' => $totalValue,
                    'total_discount' => $discount,
                    'total_after_discount' => $totalAfterDiscount,
                    'total_payments' => rand(0, $totalAfterDiscount),
                    'contract_type' => $contractTypes[rand(0, count($contractTypes) - 1)],
                    'status' => $statuses[rand(0, count($statuses) - 1)],
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'created_by' => $user->id,
                    'contract_notes' => 'عقد تجريبي رقم ' . $contractsCount,
                ]);
            }
        }

        $this->command->info('تم إنشاء ' . $contractsCount . ' عقد جديد بنجاح!');
    }
}
