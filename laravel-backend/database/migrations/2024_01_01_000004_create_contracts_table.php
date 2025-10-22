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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('contract_number')->unique();
            $table->date('contract_date');
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->string('customer_name');
            $table->text('delivery_address');
            $table->string('location_map_link')->nullable();
            $table->decimal('total_contract_value', 15, 2);
            $table->decimal('transport_installation_cost', 15, 2)->default(0);
            $table->decimal('total_discount', 15, 2)->default(0);
            $table->decimal('total_after_discount', 15, 2);
            $table->decimal('total_payments', 15, 2)->default(0);
            $table->text('contract_notes')->nullable();
            $table->enum('contract_type', ['RENTAL', 'SALE'])->default('RENTAL');
            $table->enum('status', ['ACTIVE', 'EXPIRED', 'CANCELLED', 'COMPLETED'])->default('ACTIVE');
            $table->date('start_date');
            $table->date('end_date');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            
            $table->index(['customer_id', 'status']);
            $table->index(['contract_type', 'status']);
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
