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
        Schema::create('supplier_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('supplier_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->enum('status', ['PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED'])->default('PENDING');
            $table->date('due_date');
            $table->date('payment_date')->nullable();
            $table->enum('payment_method', ['CASH', 'BANK_TRANSFER', 'CHECK', 'CREDIT_CARD'])->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->index(['supplier_id', 'status']);
            $table->index('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supplier_invoices');
    }
};
