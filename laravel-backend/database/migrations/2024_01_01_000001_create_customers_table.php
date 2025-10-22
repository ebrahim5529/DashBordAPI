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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('customer_number')->unique();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->json('phones')->nullable(); // أرقام هواتف متعددة
            $table->text('address')->nullable();
            $table->string('nationality')->nullable();
            $table->enum('customer_type', ['INDIVIDUAL', 'COMPANY'])->default('INDIVIDUAL');
            $table->string('id_number')->nullable();
            $table->string('commercial_record')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED'])->default('ACTIVE');
            $table->date('registration_date');
            $table->string('guarantor_name')->nullable();
            $table->string('guarantor_phone')->nullable();
            $table->string('guarantor_id')->nullable();
            $table->json('guarantor_data')->nullable(); // بيانات الضامن الكاملة
            $table->text('notes')->nullable();
            $table->text('warnings')->nullable();
            $table->integer('rating')->default(0);
            $table->text('attachments')->nullable(); // JSON string for file paths
            $table->string('id_card_copy')->nullable(); // نسخة البطاقة الشخصية
            $table->string('guarantor_id_card_copy')->nullable(); // نسخة بطاقة الضامن
            $table->timestamps();
            
            $table->index(['customer_type', 'status']);
            $table->index('registration_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
