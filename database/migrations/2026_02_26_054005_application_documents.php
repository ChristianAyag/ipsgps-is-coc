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
        Schema::create('application_documents', function (Blueprint $table) {
            $table->string('docID')->primary();
            $table->string('controlID')->nullable();
            $table->string('docType')->nullable();  // cmid, photo, birth_certificate, marriage_cert, etc.
            $table->string('fileName')->nullable();
            $table->string('filePath')->nullable();
            $table->timestamp('uploaded_at')->nullable();
            $table->string('uploaded_by')->nullable();
            $table->boolean('isVerified')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->string('verified_by')->nullable();
            $table->text('verification_remarks')->nullable();

            // Indexes
            $table->index(['controlID', 'docType']);
            $table->index(['controlID', 'isVerified']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_documents');
    }
};
