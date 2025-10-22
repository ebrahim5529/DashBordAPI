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
        Schema::create('claims', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->integer('total_contracts')->default(0);
            $table->integer('total_payments')->default(0);
            $table->decimal('pending_amount', 15, 2)->default(0);
            $table->text('comments')->nullable();
            $table->enum('status', ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'])->default('PENDING');
            $table->date('last_payment_date')->nullable();
            $table->date('next_due_date')->nullable();
            $table->date('last_contact_date')->nullable();
            $table->date('next_contact_date')->nullable();
            $table->enum('priority', ['LOW', 'NORMAL', 'HIGH', 'URGENT'])->default('NORMAL');
            $table->timestamps();
            
            $table->index(['customer_id', 'status']);
            $table->index(['priority', 'status']);
            $table->index('next_due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};
