<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sessions', function (Blueprint $table) {
            // Change user_id to string to accommodate your custom userID
            $table->string('user_id', 255)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('sessions', function (Blueprint $table) {
            // Revert back to integer (may cause data loss)
            $table->integer('user_id')->nullable()->change();
        });
    }
};