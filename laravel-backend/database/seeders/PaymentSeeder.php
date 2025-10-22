<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Contract;
use App\Models\User;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $contracts = Contract::all();
        
        if ($contracts->isEmpty()) {
            $this->command->warn('لا يوجد عقود! قم بتشغيل ContractSeeder أولاً.');
            return;
        }

        $user = User::first();
        if (!$user) {
            $this->command->warn('لا يوجد مستخدمين!');
            return;
        }

        $paymentMethods = ['cash', 'check', 'credit_card', 'bank_transfer'];
        $statuses = ['pending', 'completed'];
        $paymentsCount = Payment::count();

        foreach ($contracts->take(20) as $contract) {
            // إنشاء 1-2 دفعات لكل عقد
            $numPayments = rand(1, 2);
            
            for ($i = 0; $i < $numPayments; $i++) {
                $paymentsCount++;
                $amount = $contract->total_after_discount / $numPayments;
                
                Payment::create([
                    'contract_id' => $contract->id,
                    'customer_id' => $contract->customer_id,
                    'amount' => $amount,
                    'payment_date' => now()->subDays(rand(1, 60)),
                    'payment_method' => $paymentMethods[rand(0, count($paymentMethods) - 1)],
                    'status' => $statuses[rand(0, count($statuses) - 1)],
                    'description' => 'دفعة للعقد ' . $contract->contract_number,
                    'created_by' => $user->id,
                ]);
            }
        }

        $this->command->info('تم إنشاء ' . $paymentsCount . ' دفعة جديدة بنجاح!');
    }
}
