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
        Schema::create('rental_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained()->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('duration'); // بالأيام أو الأشهر حسب النوع
            $table->enum('duration_type', ['daily', 'monthly']); // نوع المدة
            $table->string('item_code');
            $table->string('item_description');
            $table->decimal('daily_rate', 10, 2);
            $table->decimal('monthly_rate', 10, 2);
            $table->integer('quantity');
            $table->decimal('total', 15, 2);
            $table->timestamps();
            
            $table->index('contract_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rental_details');
    }
};
