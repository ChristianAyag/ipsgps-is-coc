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
            // Primary Identifiers
            $table->string('controlID')->primary();
            $table->string('trackerID')->unique();
            $table->string('userID');
            
            // Applicant Information
            $table->string('IPLeaderName');
            $table->string('IPLeaderRegion')->nullable();
            $table->string('IPLeaderProvince')->nullable();
            $table->string('IPLeaderDistrict')->nullable();
            $table->string('IPLeaderMunicipality')->nullable();
            $table->string('IPLeaderBarangay')->nullable();
            
            // Family Information
            $table->string('FatherName')->nullable();
            $table->string('FatherEthnicity')->nullable();
            $table->string('FatherOrigin')->nullable();
            $table->string('MotherName')->nullable();
            $table->string('MotherEthnicity')->nullable();
            $table->string('MotherOrigin')->nullable();
            
            // Status & Tracking
            $table->string('currentStatus')->default('pending');
            $table->string('previousControlID')->nullable();
            $table->string('applicationType')->default('new');
            
            // Review Fields
            $table->string('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_remarks')->nullable();
            
            // Approval Fields
            $table->string('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            
            // Release Fields
            $table->string('released_by')->nullable();
            $table->string('released_to')->nullable();
            $table->string('released_to_relationship')->nullable();
            $table->timestamp('release_date')->nullable();
            
            // Timestamps
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('last_updated')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('userID');
            $table->index('currentStatus');
            $table->index('trackerID');
            $table->index('created_at');
        });
        
        // Add foreign keys after table is created
        Schema::table('application_newCOC', function (Blueprint $table) {
            $table->foreign('userID')
                  ->references('userID')
                  ->on('login_users')
                  ->onDelete('cascade');
                  
            $table->foreign('previousControlID')
                  ->references('controlID')
                  ->on('application_newCOC')
                  ->onDelete('set null');
                  
            $table->foreign('reviewed_by')
                  ->references('userID')
                  ->on('login_users')
                  ->onDelete('set null');
                  
            $table->foreign('approved_by')
                  ->references('userID')
                  ->on('login_users')
                  ->onDelete('set null');
                  
            $table->foreign('released_by')
                  ->references('userID')
                  ->on('login_users')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_newCOC');
    }
};