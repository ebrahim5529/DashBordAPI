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
        Schema::create('scaffold_maintenance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scaffold_id')->constrained()->onDelete('cascade');
            $table->date('maintenance_date');
            $table->text('description');
            $table->decimal('cost', 10, 2)->default(0);
            $table->string('technician_name');
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled');
            $table->date('next_maintenance_date')->nullable();
            $table->timestamps();
            
            $table->index(['scaffold_id', 'maintenance_date']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scaffold_maintenance');
    }
};
