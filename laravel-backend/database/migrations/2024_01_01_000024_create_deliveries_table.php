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
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_number')->unique();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->string('customer_name');
            $table->string('customer_phone')->nullable();
            $table->date('delivery_date');
            $table->text('delivery_address');
            $table->foreignId('driver_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->string('driver_name');
            $table->string('driver_phone')->nullable();
            $table->integer('items_count')->default(0);
            $table->integer('total_items')->default(0);
            $table->decimal('value', 15, 2)->default(0);
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->date('completed_date')->nullable();
            $table->string('receiver_name')->nullable();
            $table->string('receiver_phone')->nullable();
            $table->longText('receiver_signature')->nullable();
            $table->longText('deliverer_signature')->nullable();
            $table->longText('signature')->nullable();
            $table->json('images')->nullable();
            $table->json('related_orders')->nullable();
            $table->timestamps();
            
            $table->index(['customer_id', 'status']);
            $table->index(['driver_id', 'status']);
            $table->index('delivery_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};
