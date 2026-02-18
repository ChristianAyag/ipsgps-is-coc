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
        // Now add the foreign key constraint in a separate migration
        // This ensures user_roles table already exists
        Schema::table('login_users', function (Blueprint $table) {
            $table->foreign('userAccess')
                  ->references('roleID')
                  ->on('user_roles')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('login_users', function (Blueprint $table) {
            $table->dropForeign(['userAccess']);
        });
    }
};