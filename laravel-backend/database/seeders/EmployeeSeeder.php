<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Department;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        // إنشاء أقسام أولاً
        $departments = [
            ['name' => 'الإدارة', 'description' => 'القسم الإداري'],
            ['name' => 'المبيعات', 'description' => 'قسم المبيعات والتسويق'],
            ['name' => 'المحاسبة', 'description' => 'قسم المحاسبة والمالية'],
            ['name' => 'العمليات', 'description' => 'قسم العمليات والتشغيل'],
            ['name' => 'الصيانة', 'description' => 'قسم الصيانة'],
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate(['name' => $dept['name']], $dept);
        }

        $employees = [
            [
                'employee_number' => 'EMP-000001',
                'employee_id' => 'EMP001',
                'name' => 'Mohammed Salem',
                'arabic_name' => 'محمد سالم',
                'email' => 'mohammed.salem@company.om',
                'phone' => '+968 9111 2222',
                'department_id' => 1,
                'position' => 'مدير عام',
                'basic_salary' => 1500.00,
                'total_salary' => 1500.00,
                'hire_date' => now()->subYears(5),
                'status' => 'active',
            ],
            [
                'employee_number' => 'EMP-000002',
                'employee_id' => 'EMP002',
                'name' => 'Fatima Ahmed',
                'arabic_name' => 'فاطمة أحمد',
                'email' => 'fatima.ahmed@company.om',
                'phone' => '+968 9222 3333',
                'department_id' => 2,
                'position' => 'مدير مبيعات',
                'basic_salary' => 1200.00,
                'total_salary' => 1200.00,
                'hire_date' => now()->subYears(3),
                'status' => 'active',
            ],
            [
                'employee_number' => 'EMP-000003',
                'employee_id' => 'EMP003',
                'name' => 'Khaled Abdullah',
                'arabic_name' => 'خالد عبدالله',
                'email' => 'khaled.abdullah@company.om',
                'phone' => '+968 9333 4444',
                'department_id' => 3,
                'position' => 'محاسب رئيسي',
                'basic_salary' => 1100.00,
                'total_salary' => 1100.00,
                'hire_date' => now()->subYears(2),
                'status' => 'active',
            ],
            [
                'employee_number' => 'EMP-000004',
                'employee_id' => 'EMP004',
                'name' => 'Sara Mohammed',
                'arabic_name' => 'سارة محمد',
                'email' => 'sara.mohammed@company.om',
                'phone' => '+968 9444 5555',
                'department_id' => 2,
                'position' => 'موظفة مبيعات',
                'basic_salary' => 800.00,
                'total_salary' => 800.00,
                'hire_date' => now()->subYear(),
                'status' => 'active',
            ],
            [
                'employee_number' => 'EMP-000005',
                'employee_id' => 'EMP005',
                'name' => 'Ali Hassan',
                'arabic_name' => 'علي حسن',
                'email' => 'ali.hassan@company.om',
                'phone' => '+968 9555 6666',
                'department_id' => 4,
                'position' => 'مشرف عمليات',
                'basic_salary' => 900.00,
                'total_salary' => 900.00,
                'hire_date' => now()->subMonths(8),
                'status' => 'active',
            ],
            [
                'employee_number' => 'EMP-000006',
                'employee_id' => 'EMP006',
                'name' => 'Mariam Said',
                'arabic_name' => 'مريم سعيد',
                'email' => 'mariam.said@company.om',
                'phone' => '+968 9666 7777',
                'department_id' => 3,
                'position' => 'محاسبة',
                'basic_salary' => 700.00,
                'total_salary' => 700.00,
                'hire_date' => now()->subMonths(6),
                'status' => 'active',
            ],
            [
                'employee_number' => 'EMP-000007',
                'employee_id' => 'EMP007',
                'name' => 'Ahmed Ali',
                'arabic_name' => 'أحمد علي',
                'email' => 'ahmed.ali@company.om',
                'phone' => '+968 9777 8888',
                'department_id' => 5,
                'position' => 'فني صيانة',
                'basic_salary' => 650.00,
                'total_salary' => 650.00,
                'hire_date' => now()->subMonths(4),
                'status' => 'active',
            ],
            [
                'employee_number' => 'EMP-000008',
                'employee_id' => 'EMP008',
                'name' => 'Noura Khamis',
                'arabic_name' => 'نورة خميس',
                'email' => 'noura.khamis@company.om',
                'phone' => '+968 9888 9999',
                'department_id' => 1,
                'position' => 'موظفة إدارية',
                'basic_salary' => 600.00,
                'total_salary' => 600.00,
                'hire_date' => now()->subMonths(3),
                'status' => 'active',
            ],
            [
                'employee_number' => 'EMP-000009',
                'employee_id' => 'EMP009',
                'name' => 'Said Nasser',
                'arabic_name' => 'سعيد ناصر',
                'email' => 'said.nasser@company.om',
                'phone' => '+968 9999 0000',
                'department_id' => 4,
                'position' => 'عامل',
                'basic_salary' => 500.00,
                'total_salary' => 500.00,
                'hire_date' => now()->subMonths(2),
                'status' => 'active',
            ],
            [
                'employee_number' => 'EMP-000010',
                'employee_id' => 'EMP010',
                'name' => 'Aisha Mahmoud',
                'arabic_name' => 'عائشة محمود',
                'email' => 'aisha.mahmoud@company.om',
                'phone' => '+968 9000 1111',
                'department_id' => 2,
                'position' => 'مساعدة مبيعات',
                'basic_salary' => 550.00,
                'total_salary' => 550.00,
                'hire_date' => now()->subMonth(),
                'status' => 'active',
            ],
        ];

        foreach ($employees as $employeeData) {
            Employee::firstOrCreate(
                ['employee_number' => $employeeData['employee_number']],
                $employeeData
            );
        }

        $this->command->info('تم إنشاء ' . count($employees) . ' موظف و 5 أقسام بنجاح!');
    }
}
