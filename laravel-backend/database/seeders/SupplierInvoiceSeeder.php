<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SupplierInvoice;
use App\Models\Supplier;
use Carbon\Carbon;

class SupplierInvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = Supplier::all();

        if ($suppliers->isEmpty()) {
            $this->command->warn('No suppliers found. Please run SupplierSeeder first.');
            return;
        }

        // استخدام IDs الموجودة فقط
        $supplierIds = $suppliers->pluck('id')->toArray();
        $maxSuppliers = count($supplierIds);

        if ($maxSuppliers < 1) {
            $this->command->warn('Not enough suppliers found.');
            return;
        }

        $invoices = [
            [
                'invoice_number' => 'INV-2024-0001',
                'supplier_id' => $supplierIds[0] ?? 1,
                'amount' => 15000.00,
                'status' => 'PAID',
                'due_date' => Carbon::now()->subDays(30),
                'payment_date' => Carbon::now()->subDays(25),
                'payment_method' => 'BANK_TRANSFER',
                'description' => 'دفعة سقالات حديدية - 50 قطعة',
            ],
            [
                'invoice_number' => 'INV-2024-0002',
                'supplier_id' => $supplierIds[0] ?? 1,
                'amount' => 8500.00,
                'status' => 'PENDING',
                'due_date' => Carbon::now()->addDays(15),
                'payment_date' => null,
                'payment_method' => null,
                'description' => 'معدات سلامة وحماية',
            ],
            [
                'invoice_number' => 'INV-2024-0003',
                'supplier_id' => $supplierIds[1] ?? 1,
                'amount' => 22000.00,
                'status' => 'PAID',
                'due_date' => Carbon::now()->subDays(45),
                'payment_date' => Carbon::now()->subDays(40),
                'payment_method' => 'CHECK',
                'description' => 'معدات بناء ثقيلة',
            ],
            [
                'invoice_number' => 'INV-2024-0004',
                'supplier_id' => $supplierIds[1] ?? 1,
                'amount' => 12000.00,
                'status' => 'PARTIAL',
                'due_date' => Carbon::now()->addDays(10),
                'payment_date' => null,
                'payment_method' => 'BANK_TRANSFER',
                'description' => 'أدوات ورش - دفعة جزئية مدفوعة',
            ],
            [
                'invoice_number' => 'INV-2024-0005',
                'supplier_id' => $supplierIds[2] ?? 1,
                'amount' => 3500.00,
                'status' => 'OVERDUE',
                'due_date' => Carbon::now()->subDays(10),
                'payment_date' => null,
                'payment_method' => null,
                'description' => 'مواد بناء متنوعة - متأخرة',
            ],
            [
                'invoice_number' => 'INV-2024-0006',
                'supplier_id' => $supplierIds[3] ?? 1,
                'amount' => 18500.00,
                'status' => 'PAID',
                'due_date' => Carbon::now()->subDays(20),
                'payment_date' => Carbon::now()->subDays(18),
                'payment_method' => 'BANK_TRANSFER',
                'description' => 'معدات إلكترونية',
            ],
            [
                'invoice_number' => 'INV-2024-0007',
                'supplier_id' => $supplierIds[3] ?? 1,
                'amount' => 9200.00,
                'status' => 'PENDING',
                'due_date' => Carbon::now()->addDays(20),
                'payment_date' => null,
                'payment_method' => null,
                'description' => 'أجهزة قياس ومعايرة',
            ],
            [
                'invoice_number' => 'INV-2024-0008',
                'supplier_id' => $supplierIds[4] ?? 1,
                'amount' => 25000.00,
                'status' => 'PAID',
                'due_date' => Carbon::now()->subDays(60),
                'payment_date' => Carbon::now()->subDays(55),
                'payment_method' => 'BANK_TRANSFER',
                'description' => 'شحنة مستوردة من الصين',
            ],
            [
                'invoice_number' => 'INV-2024-0009',
                'supplier_id' => $supplierIds[4] ?? 1,
                'amount' => 16000.00,
                'status' => 'PENDING',
                'due_date' => Carbon::now()->addDays(25),
                'payment_date' => null,
                'payment_method' => null,
                'description' => 'معدات مستوردة من الهند',
            ],
            [
                'invoice_number' => 'INV-2024-0010',
                'supplier_id' => $supplierIds[0] ?? 1,
                'amount' => 4200.00,
                'status' => 'OVERDUE',
                'due_date' => Carbon::now()->subDays(15),
                'payment_date' => null,
                'payment_method' => null,
                'description' => 'مواد بناء محلية - متأخرة',
            ],
            [
                'invoice_number' => 'INV-2024-0011',
                'supplier_id' => $supplierIds[1] ?? 1,
                'amount' => 19800.00,
                'status' => 'PAID',
                'due_date' => Carbon::now()->subDays(35),
                'payment_date' => Carbon::now()->subDays(30),
                'payment_method' => 'BANK_TRANSFER',
                'description' => 'معدات حديثة - جودة عالية',
            ],
            [
                'invoice_number' => 'INV-2024-0012',
                'supplier_id' => $supplierIds[1] ?? 1,
                'amount' => 11500.00,
                'status' => 'PENDING',
                'due_date' => Carbon::now()->addDays(18),
                'payment_date' => null,
                'payment_method' => null,
                'description' => 'خدمات صيانة وقطع غيار',
            ],
            [
                'invoice_number' => 'INV-2024-0013',
                'supplier_id' => $supplierIds[2] ?? 1,
                'amount' => 7800.00,
                'status' => 'CANCELLED',
                'due_date' => Carbon::now()->addDays(5),
                'payment_date' => null,
                'payment_method' => null,
                'description' => 'طلب ملغي - مشاكل في التوريد',
            ],
            [
                'invoice_number' => 'INV-2024-0014',
                'supplier_id' => $supplierIds[3] ?? 1,
                'amount' => 2800.00,
                'status' => 'PAID',
                'due_date' => Carbon::now()->subDays(12),
                'payment_date' => Carbon::now()->subDays(10),
                'payment_method' => 'CASH',
                'description' => 'مواد بناء صغيرة',
            ],
            [
                'invoice_number' => 'INV-2024-0015',
                'supplier_id' => $supplierIds[3] ?? 1,
                'amount' => 3100.00,
                'status' => 'PENDING',
                'due_date' => Carbon::now()->addDays(12),
                'payment_date' => null,
                'payment_method' => null,
                'description' => 'أدوات يدوية متنوعة',
            ],
            [
                'invoice_number' => 'INV-2024-0016',
                'supplier_id' => $supplierIds[4] ?? 1,
                'amount' => 21000.00,
                'status' => 'PAID',
                'due_date' => Carbon::now()->subDays(50),
                'payment_date' => Carbon::now()->subDays(48),
                'payment_method' => 'BANK_TRANSFER',
                'description' => 'شحنة كاملة - جميع الاحتياجات',
            ],
            [
                'invoice_number' => 'INV-2024-0017',
                'supplier_id' => $supplierIds[4] ?? 1,
                'amount' => 14500.00,
                'status' => 'PARTIAL',
                'due_date' => Carbon::now()->addDays(8),
                'payment_date' => null,
                'payment_method' => 'BANK_TRANSFER',
                'description' => 'طلب كبير - دفعة جزئية',
            ],
            [
                'invoice_number' => 'INV-2024-0018',
                'supplier_id' => 1,
                'amount' => 10200.00,
                'status' => 'PENDING',
                'due_date' => Carbon::now()->addDays(22),
                'payment_date' => null,
                'payment_method' => null,
                'description' => 'سقالات إضافية',
            ],
            [
                'invoice_number' => 'INV-2024-0019',
                'supplier_id' => 4,
                'amount' => 6700.00,
                'status' => 'OVERDUE',
                'due_date' => Carbon::now()->subDays(5),
                'payment_date' => null,
                'payment_method' => null,
                'description' => 'معدات عاجلة - متأخرة',
            ],
            [
                'invoice_number' => 'INV-2024-0020',
                'supplier_id' => $supplierIds[1] ?? 1,
                'amount' => 13400.00,
                'status' => 'PENDING',
                'due_date' => Carbon::now()->addDays(30),
                'payment_date' => null,
                'payment_method' => null,
                'description' => 'عقد صيانة شهري',
            ],
        ];

        foreach ($invoices as $invoice) {
            SupplierInvoice::create($invoice);
        }
    }
}

