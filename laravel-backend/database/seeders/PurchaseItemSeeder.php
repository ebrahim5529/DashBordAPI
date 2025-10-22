<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PurchaseItem;
use App\Models\SupplierPurchase;
use Carbon\Carbon;

class PurchaseItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $purchases = SupplierPurchase::all();

        if ($purchases->isEmpty()) {
            $this->command->warn('No purchases found. Please run SupplierPurchaseSeeder first.');
            return;
        }

        $items = [
            // Items for PUR-2024-0001
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0001')->first()?->id ?? 1,
                'name' => 'سقالات حديدية قياس 2 متر',
                'description' => 'سقالات حديد مجلفن عالية الجودة',
                'quantity' => 50,
                'unit_price' => 250.00,
                'total_price' => 12500.00,
                'category' => 'سقالات',
                'unit' => 'قطعة',
                'received_date' => Carbon::now()->subDays(28),
                'status' => 'مستلم',
            ],
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0001')->first()?->id ?? 1,
                'name' => 'عجلات للسقالات',
                'description' => 'عجلات متحركة للسقالات',
                'quantity' => 100,
                'unit_price' => 25.00,
                'total_price' => 2500.00,
                'category' => 'ملحقات',
                'unit' => 'قطعة',
                'received_date' => Carbon::now()->subDays(28),
                'status' => 'مستلم',
            ],
            
            // Items for PUR-2024-0002
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0002')->first()?->id ?? 2,
                'name' => 'خوذات أمان',
                'description' => 'خوذات حماية معتمدة',
                'quantity' => 100,
                'unit_price' => 35.00,
                'total_price' => 3500.00,
                'category' => 'معدات سلامة',
                'unit' => 'قطعة',
                'received_date' => null,
                'status' => 'في الطريق',
            ],
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0002')->first()?->id ?? 2,
                'name' => 'أحزمة أمان',
                'description' => 'أحزمة أمان للعمل على الارتفاعات',
                'quantity' => 50,
                'unit_price' => 100.00,
                'total_price' => 5000.00,
                'category' => 'معدات سلامة',
                'unit' => 'قطعة',
                'received_date' => null,
                'status' => 'في الطريق',
            ],
            
            // Items for PUR-2024-0003
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0003')->first()?->id ?? 3,
                'name' => 'رافعة شوكية كهربائية',
                'description' => 'رافعة شوكية سعة 3 طن',
                'quantity' => 2,
                'unit_price' => 10000.00,
                'total_price' => 20000.00,
                'category' => 'معدات ثقيلة',
                'unit' => 'جهاز',
                'received_date' => Carbon::now()->subDays(42),
                'status' => 'مستلم',
            ],
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0003')->first()?->id ?? 3,
                'name' => 'قطع غيار رافعة',
                'description' => 'مجموعة قطع غيار احتياطية',
                'quantity' => 1,
                'unit_price' => 2000.00,
                'total_price' => 2000.00,
                'category' => 'قطع غيار',
                'unit' => 'مجموعة',
                'received_date' => Carbon::now()->subDays(42),
                'status' => 'مستلم',
            ],
            
            // Items for PUR-2024-0004
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0004')->first()?->id ?? 4,
                'name' => 'مثقاب كهربائي صناعي',
                'description' => 'مثقاب قوة 1200 واط',
                'quantity' => 20,
                'unit_price' => 350.00,
                'total_price' => 7000.00,
                'category' => 'أدوات كهربائية',
                'unit' => 'قطعة',
                'received_date' => null,
                'status' => 'معلق',
            ],
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0004')->first()?->id ?? 4,
                'name' => 'منشار كهربائي',
                'description' => 'منشار دائري 2000 واط',
                'quantity' => 10,
                'unit_price' => 500.00,
                'total_price' => 5000.00,
                'category' => 'أدوات كهربائية',
                'unit' => 'قطعة',
                'received_date' => null,
                'status' => 'معلق',
            ],
            
            // Items for PUR-2024-0005
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0005')->first()?->id ?? 5,
                'name' => 'أسمنت بورتلاندي',
                'description' => 'أكياس أسمنت 50 كجم',
                'quantity' => 50,
                'unit_price' => 45.00,
                'total_price' => 2250.00,
                'category' => 'مواد بناء',
                'unit' => 'كيس',
                'received_date' => Carbon::now()->subDays(15),
                'status' => 'مستلم',
            ],
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0005')->first()?->id ?? 5,
                'name' => 'رمل بناء',
                'description' => 'رمل ناعم للبناء',
                'quantity' => 5,
                'unit_price' => 250.00,
                'total_price' => 1250.00,
                'category' => 'مواد بناء',
                'unit' => 'طن',
                'received_date' => Carbon::now()->subDays(15),
                'status' => 'مستلم',
            ],
            
            // Items for PUR-2024-0006
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0006')->first()?->id ?? 6,
                'name' => 'نظام إنذار حريق',
                'description' => 'نظام إنذار حريق متكامل',
                'quantity' => 5,
                'unit_price' => 2500.00,
                'total_price' => 12500.00,
                'category' => 'معدات سلامة',
                'unit' => 'نظام',
                'received_date' => Carbon::now()->subDays(20),
                'status' => 'مستلم',
            ],
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0006')->first()?->id ?? 6,
                'name' => 'كاميرات مراقبة',
                'description' => 'كاميرات مراقبة عالية الدقة',
                'quantity' => 20,
                'unit_price' => 300.00,
                'total_price' => 6000.00,
                'category' => 'معدات إلكترونية',
                'unit' => 'قطعة',
                'received_date' => Carbon::now()->subDays(20),
                'status' => 'مستلم',
            ],
            
            // Items for PUR-2024-0008
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0008')->first()?->id ?? 8,
                'name' => 'معدات لحام متقدمة',
                'description' => 'أجهزة لحام صناعية عالية القدرة',
                'quantity' => 10,
                'unit_price' => 1800.00,
                'total_price' => 18000.00,
                'category' => 'معدات صناعية',
                'unit' => 'جهاز',
                'received_date' => Carbon::now()->subDays(58),
                'status' => 'مستلم',
            ],
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0008')->first()?->id ?? 8,
                'name' => 'قضبان حديد تسليح',
                'description' => 'حديد تسليح قطر 12 ملم',
                'quantity' => 100,
                'unit_price' => 70.00,
                'total_price' => 7000.00,
                'category' => 'مواد بناء',
                'unit' => 'قضيب',
                'received_date' => Carbon::now()->subDays(58),
                'status' => 'مستلم',
            ],
            
            // Items for PUR-2024-0010
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0010')->first()?->id ?? 10,
                'name' => 'مولدات كهربائية',
                'description' => 'مولدات ديزل قوة 100 كيلو واط',
                'quantity' => 3,
                'unit_price' => 5000.00,
                'total_price' => 15000.00,
                'category' => 'معدات كهربائية',
                'unit' => 'جهاز',
                'received_date' => Carbon::now()->subDays(32),
                'status' => 'مستلم',
            ],
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0010')->first()?->id ?? 10,
                'name' => 'كابلات كهربائية',
                'description' => 'كابلات نحاس معزولة',
                'quantity' => 500,
                'unit_price' => 9.60,
                'total_price' => 4800.00,
                'category' => 'معدات كهربائية',
                'unit' => 'متر',
                'received_date' => Carbon::now()->subDays(32),
                'status' => 'مستلم',
            ],
            
            // Items for PUR-2024-0013
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0013')->first()?->id ?? 13,
                'name' => 'صبغ جدران خارجي',
                'description' => 'صبغ مقاوم للعوامل الجوية',
                'quantity' => 30,
                'unit_price' => 65.00,
                'total_price' => 1950.00,
                'category' => 'مواد تشطيب',
                'unit' => 'غالون',
                'received_date' => Carbon::now()->subDays(12),
                'status' => 'مستلم',
            ],
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0013')->first()?->id ?? 13,
                'name' => 'فرش صبغ وأدوات',
                'description' => 'مجموعة أدوات صبغ كاملة',
                'quantity' => 10,
                'unit_price' => 85.00,
                'total_price' => 850.00,
                'category' => 'أدوات',
                'unit' => 'مجموعة',
                'received_date' => Carbon::now()->subDays(12),
                'status' => 'مستلم',
            ],
            
            // Items for PUR-2024-0015
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0015')->first()?->id ?? 15,
                'name' => 'بلاط سيراميك',
                'description' => 'بلاط سيراميك عالي الجودة',
                'quantity' => 500,
                'unit_price' => 25.00,
                'total_price' => 12500.00,
                'category' => 'مواد تشطيب',
                'unit' => 'متر مربع',
                'received_date' => Carbon::now()->subDays(50),
                'status' => 'مستلم',
            ],
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0015')->first()?->id ?? 15,
                'name' => 'لاصق بلاط',
                'description' => 'لاصق بلاط قوي',
                'quantity' => 100,
                'unit_price' => 45.00,
                'total_price' => 4500.00,
                'category' => 'مواد بناء',
                'unit' => 'كيس',
                'received_date' => Carbon::now()->subDays(50),
                'status' => 'مستلم',
            ],
            [
                'purchase_id' => $purchases->where('purchase_number', 'PUR-2024-0015')->first()?->id ?? 15,
                'name' => 'أدوات تركيب بلاط',
                'description' => 'مجموعة أدوات التركيب',
                'quantity' => 20,
                'unit_price' => 200.00,
                'total_price' => 4000.00,
                'category' => 'أدوات',
                'unit' => 'مجموعة',
                'received_date' => Carbon::now()->subDays(50),
                'status' => 'مستلم',
            ],
        ];

        foreach ($items as $item) {
            if ($item['purchase_id']) {
                PurchaseItem::create($item);
            }
        }

        // إعادة حساب المبلغ الإجمالي لكل مشترى
        foreach ($purchases as $purchase) {
            $purchase->calculateTotalAmount();
        }
    }
}

