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
        Schema::create('regs_userInformation', function (Blueprint $table) {
            $table->string('userInfoID', 50)->primary();
            $table->string('userID', 50);
            $table->string('birthDate', 20); // Using string for flexibility with date formats
            $table->integer('userAge')->unsigned(); // Unsigned ensures non-negative
            $table->string('userEthnicity', 100);
            $table->string('userProvince', 100);
            $table->string('userMunicipality', 100);
            $table->string('userBarangay', 100);
            $table->string('userPurpose', 255);
            $table->timestamps();
            
            // Index for faster queries
            $table->index('userID');
            
            // Foreign key constraint
            $table->foreign('userID')
                  ->references('userID')
                  ->on('tblUsers')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tblUserInformation');
    }
};