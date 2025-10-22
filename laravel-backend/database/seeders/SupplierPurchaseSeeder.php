<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SupplierPurchase;
use App\Models\Supplier;
use App\Models\SupplierInvoice;
use Carbon\Carbon;

class SupplierPurchaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = Supplier::all();
        $invoices = SupplierInvoice::all();

        if ($suppliers->isEmpty()) {
            $this->command->warn('No suppliers found. Please run SupplierSeeder first.');
            return;
        }

        $purchases = [
            [
                'purchase_number' => 'PUR-2024-0001',
                'supplier_id' => 1,
                'purchase_date' => Carbon::now()->subDays(35),
                'delivery_date' => Carbon::now()->subDays(28),
                'status' => 'DELIVERED',
                'total_amount' => 15000.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0001')->first()?->id,
                'notes' => 'تم التسليم في الموعد المحدد',
            ],
            [
                'purchase_number' => 'PUR-2024-0002',
                'supplier_id' => 1,
                'purchase_date' => Carbon::now()->subDays(5),
                'delivery_date' => Carbon::now()->addDays(10),
                'status' => 'CONFIRMED',
                'total_amount' => 8500.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0002')->first()?->id,
                'notes' => 'في انتظار التسليم',
            ],
            [
                'purchase_number' => 'PUR-2024-0003',
                'supplier_id' => 2,
                'purchase_date' => Carbon::now()->subDays(50),
                'delivery_date' => Carbon::now()->subDays(42),
                'status' => 'DELIVERED',
                'total_amount' => 22000.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0003')->first()?->id,
                'notes' => 'معدات ثقيلة - تم الاستلام',
            ],
            [
                'purchase_number' => 'PUR-2024-0004',
                'supplier_id' => 2,
                'purchase_date' => Carbon::now()->subDays(8),
                'delivery_date' => Carbon::now()->addDays(7),
                'status' => 'CONFIRMED',
                'total_amount' => 12000.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0004')->first()?->id,
                'notes' => 'قيد التجهيز',
            ],
            [
                'purchase_number' => 'PUR-2024-0005',
                'supplier_id' => 3,
                'purchase_date' => Carbon::now()->subDays(25),
                'delivery_date' => Carbon::now()->subDays(15),
                'status' => 'DELIVERED',
                'total_amount' => 3500.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0005')->first()?->id,
                'notes' => 'تم الاستلام بتأخير بسيط',
            ],
            [
                'purchase_number' => 'PUR-2024-0006',
                'supplier_id' => 4,
                'purchase_date' => Carbon::now()->subDays(25),
                'delivery_date' => Carbon::now()->subDays(20),
                'status' => 'DELIVERED',
                'total_amount' => 18500.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0006')->first()?->id,
                'notes' => 'معدات إلكترونية عالية الجودة',
            ],
            [
                'purchase_number' => 'PUR-2024-0007',
                'supplier_id' => 4,
                'purchase_date' => Carbon::now()->subDays(3),
                'delivery_date' => Carbon::now()->addDays(17),
                'status' => 'PENDING',
                'total_amount' => 9200.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0007')->first()?->id,
                'notes' => 'قيد المعالجة',
            ],
            [
                'purchase_number' => 'PUR-2024-0008',
                'supplier_id' => 5,
                'purchase_date' => Carbon::now()->subDays(70),
                'delivery_date' => Carbon::now()->subDays(58),
                'status' => 'DELIVERED',
                'total_amount' => 25000.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0008')->first()?->id,
                'notes' => 'شحنة دولية - تم الاستلام',
            ],
            [
                'purchase_number' => 'PUR-2024-0009',
                'supplier_id' => 5,
                'purchase_date' => Carbon::now()->subDays(10),
                'delivery_date' => Carbon::now()->addDays(15),
                'status' => 'CONFIRMED',
                'total_amount' => 16000.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0009')->first()?->id,
                'notes' => 'في الطريق من الهند',
            ],
            [
                'purchase_number' => 'PUR-2024-0010',
                'supplier_id' => 7,
                'purchase_date' => Carbon::now()->subDays(40),
                'delivery_date' => Carbon::now()->subDays(32),
                'status' => 'DELIVERED',
                'total_amount' => 19800.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0011')->first()?->id,
                'notes' => 'معدات ممتازة',
            ],
            [
                'purchase_number' => 'PUR-2024-0011',
                'supplier_id' => 7,
                'purchase_date' => Carbon::now()->subDays(2),
                'delivery_date' => Carbon::now()->addDays(16),
                'status' => 'PENDING',
                'total_amount' => 11500.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0012')->first()?->id,
                'notes' => 'خدمة صيانة شهرية',
            ],
            [
                'purchase_number' => 'PUR-2024-0012',
                'supplier_id' => 8,
                'purchase_date' => Carbon::now()->subDays(20),
                'delivery_date' => null,
                'status' => 'CANCELLED',
                'total_amount' => 7800.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0013')->first()?->id,
                'notes' => 'تم الإلغاء بسبب التأخير',
            ],
            [
                'purchase_number' => 'PUR-2024-0013',
                'supplier_id' => 9,
                'purchase_date' => Carbon::now()->subDays(15),
                'delivery_date' => Carbon::now()->subDays(12),
                'status' => 'DELIVERED',
                'total_amount' => 2800.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0014')->first()?->id,
                'notes' => 'تسليم سريع',
            ],
            [
                'purchase_number' => 'PUR-2024-0014',
                'supplier_id' => 9,
                'purchase_date' => Carbon::now()->subDays(4),
                'delivery_date' => Carbon::now()->addDays(8),
                'status' => 'CONFIRMED',
                'total_amount' => 3100.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0015')->first()?->id,
                'notes' => 'جاري التجهيز',
            ],
            [
                'purchase_number' => 'PUR-2024-0015',
                'supplier_id' => 10,
                'purchase_date' => Carbon::now()->subDays(55),
                'delivery_date' => Carbon::now()->subDays(50),
                'status' => 'DELIVERED',
                'total_amount' => 21000.00,
                'invoice_id' => $invoices->where('invoice_number', 'INV-2024-0016')->first()?->id,
                'notes' => 'شحنة كبيرة - تمت بنجاح',
            ],
        ];

        foreach ($purchases as $purchase) {
            SupplierPurchase::create($purchase);
        }
    }
}

