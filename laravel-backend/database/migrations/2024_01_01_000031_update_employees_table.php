<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            if (!Schema::hasColumn('employees', 'employee_number')) {
                $table->string('employee_number')->unique()->after('id');
            }
            if (!Schema::hasColumn('employees', 'salary')) {
                $table->decimal('salary', 10, 2)->default(0);
            }
            if (!Schema::hasColumn('employees', 'status')) {
                $table->enum('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED'])->default('ACTIVE');
            }
            if (!Schema::hasColumn('employees', 'hire_date')) {
                $table->date('hire_date')->nullable();
            }
            if (!Schema::hasColumn('employees', 'id_number')) {
                $table->string('id_number')->nullable();
            }
            if (!Schema::hasColumn('employees', 'address')) {
                $table->text('address')->nullable();
            }
            if (!Schema::hasColumn('employees', 'emergency_contact')) {
                $table->string('emergency_contact')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['employee_number', 'salary', 'status', 'hire_date', 'id_number', 'address', 'emergency_contact']);
        });
    }
};

