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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('supplier_number')->unique();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->text('address');
            $table->string('nationality');
            $table->enum('supplier_type', ['INDIVIDUAL', 'COMPANY'])->default('INDIVIDUAL');
            $table->string('commercial_record')->nullable();
            $table->string('tax_number')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED'])->default('ACTIVE');
            $table->date('registration_date');
            $table->string('contact_person');
            $table->string('contact_person_phone');
            $table->string('contact_person_email');
            $table->string('bank_name')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('iban')->nullable();
            $table->string('swift_code')->nullable();
            $table->text('notes')->nullable();
            $table->integer('rating')->default(0);
            $table->timestamps();
            
            $table->index(['supplier_type', 'status']);
            $table->index('registration_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
