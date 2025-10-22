<?php

namespace Database\Seeders;

use App\Models\Scaffold;
use Illuminate\Database\Seeder;

class ScaffoldSeeder extends Seeder
{
    public function run(): void
    {
        $types = ['STANDARD', 'HEAVY_DUTY', 'LIGHT_DUTY', 'MOBILE'];
        $materials = ['STEEL', 'ALUMINUM', 'WOOD', 'COMPOSITE'];
        $statuses = ['AVAILABLE', 'RENTED', 'MAINTENANCE', 'RESERVED'];
        $conditions = ['NEW', 'USED', 'GOOD', 'FAIR', 'POOR'];
        
        for ($i = 1; $i <= 50; $i++) {
            $height = rand(2, 10);
            $width = rand(1, 3);
            $length = rand(2, 6);
            
            Scaffold::create([
                'scaffold_number' => 'SCF-' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'type' => $types[rand(0, count($types) - 1)],
                'size' => json_encode(['height' => $height, 'width' => $width, 'length' => $length]),
                'material' => $materials[rand(0, count($materials) - 1)],
                'condition' => $conditions[rand(0, count($conditions) - 1)],
                'status' => $statuses[rand(0, count($statuses) - 1)],
                'quantity' => rand(1, 10),
                'available_quantity' => rand(0, 5),
                'location' => 'مسقط',
                'warehouse_location' => 'مخزن ' . rand(1, 5),
                'selling_price' => rand(100, 500),
                'daily_rental_price' => rand(5, 20),
                'monthly_rental_price' => rand(100, 500),
                'entry_date' => now()->subMonths(rand(1, 24)),
                'notes' => 'سقالة تجريبية رقم ' . $i,
            ]);
        }

        $this->command->info('تم إنشاء 50 سقالة بنجاح!');
    }
}
