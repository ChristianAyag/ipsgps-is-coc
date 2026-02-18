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
        Schema::create('application_newCOC', function (Blueprint $table) {
            $table->string('controlID', 50)->primary();
            $table->string('userID', 50);
            $table->string('userIPLeaderName', 255);
            $table->string('userIPLeaderRegion', 100);
            $table->string('userIPLeaderProvince', 100);
            $table->string('userIPLeaderDistrict', 100);
            $table->string('userIPLeaderMunicipality', 100);
            $table->string('userIPLeaderBarangay', 100);
            $table->string('userFatherName', 255);
            $table->string('userFatherEthnicity', 100);
            $table->string('userFatherOrigin', 255);
            $table->string('userMotherName', 255);
            $table->string('userMotherEthnicity', 100);
            $table->string('userMotherOrigin', 255);
            $table->string('userCMIDFileName', 255);
            $table->string('userCMIDFilePath', 500);
            $table->string('userPhotoFileName', 255);
            $table->string('userPhotoFilePath', 500);
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
        Schema::dropIfExists('tblNewCOC');
    }
};