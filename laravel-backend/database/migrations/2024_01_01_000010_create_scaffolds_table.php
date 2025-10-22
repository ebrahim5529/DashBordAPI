<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('scaffolds', function (Blueprint $table) {
            $table->id();
            $table->string('scaffold_number')->unique();
            $table->enum('type', ['STANDARD', 'HEAVY_DUTY', 'LIGHT_DUTY', 'MOBILE'])->default('STANDARD');
            $table->json('size'); // {height, width, length}
            $table->enum('material', ['STEEL', 'ALUMINUM', 'WOOD', 'COMPOSITE'])->default('STEEL');
            $table->enum('condition', ['NEW', 'USED', 'GOOD', 'FAIR', 'POOR'])->default('NEW');
            $table->enum('status', ['AVAILABLE', 'RENTED', 'SOLD', 'MAINTENANCE', 'RESERVED'])->default('AVAILABLE');
            $table->integer('quantity')->default(1);
            $table->integer('available_quantity')->default(1);
            $table->string('location');
            $table->string('warehouse_location');
            $table->decimal('selling_price', 15, 2)->default(0);
            $table->decimal('daily_rental_price', 10, 2)->default(0);
            $table->decimal('monthly_rental_price', 10, 2)->default(0);
            $table->date('entry_date');
            $table->date('last_maintenance_date')->nullable();
            $table->date('next_maintenance_date')->nullable();
            $table->json('images')->nullable(); // مسارات الصور
            $table->json('attachments')->nullable(); // مسارات المرفقات
            $table->text('notes')->nullable();
            $table->foreignId('supplier_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
            
            $table->index(['type', 'status']);
            $table->index(['condition', 'status']);
            $table->index('entry_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scaffolds');
    }
};
