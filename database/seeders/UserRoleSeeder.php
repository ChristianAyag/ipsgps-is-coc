<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        
        $roles = [
            [
                'roleID' => 'admin', // Short, readable ID
                'roleName' => 'System Admin',
                'roleDescription' => 'Full system access and control. Can manage users, applications, and system settings.',
                'permissions' => json_encode([
                    'can_apply' => true,
                    'can_review' => true,
                    'can_approve' => true,
                    'can_release' => true,
                    'can_manage_users' => true,
                    'can_manage_roles' => true,
                    'can_view_reports' => true,
                    'can_manage_system' => true,
                    'can_audit_logs' => true,
                ]),
                'is_default' => false,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'roleID' => 'regional', // Short, readable ID
                'roleName' => 'Regional Office',
                'roleDescription' => 'Regional office staff. Can review and approve applications from their region.',
                'permissions' => json_encode([
                    'can_apply' => false,
                    'can_review' => true,
                    'can_approve' => true,
                    'can_release' => false,
                    'can_manage_users' => false,
                    'can_manage_roles' => false,
                    'can_view_reports' => true,
                    'can_manage_system' => false,
                    'can_audit_logs' => false,
                    'can_view_regional_applications' => true,
                ]),
                'is_default' => false,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'roleID' => 'provincial', // Short, readable ID
                'roleName' => 'Provincial Office',
                'roleDescription' => 'Provincial office staff. Can review applications from their province.',
                'permissions' => json_encode([
                    'can_apply' => false,
                    'can_review' => true,
                    'can_approve' => false,
                    'can_release' => false,
                    'can_manage_users' => false,
                    'can_manage_roles' => false,
                    'can_view_reports' => true,
                    'can_manage_system' => false,
                    'can_audit_logs' => false,
                    'can_view_provincial_applications' => true,
                ]),
                'is_default' => false,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'roleID' => 'applicant', // Short, readable ID
                'roleName' => 'Applicant',
                'roleDescription' => 'Regular user who can apply for Certificate of Confirmation (COC).',
                'permissions' => json_encode([
                    'can_apply' => true,
                    'can_review' => false,
                    'can_approve' => false,
                    'can_release' => false,
                    'can_manage_users' => false,
                    'can_manage_roles' => false,
                    'can_view_reports' => false,
                    'can_manage_system' => false,
                    'can_audit_logs' => false,
                    'can_track_application' => true,
                ]),
                'is_default' => true, // Default role for new registrations
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        // Insert the roles
        DB::table('user_roles')->insert($roles);

        // Optional: Display info about created roles
        $this->command->info('User roles seeded successfully!');
        $this->command->table(
            ['Role ID', 'Role Name', 'Description', 'Default'],
            array_map(function ($role) {
                return [
                    $role['roleID'],
                    $role['roleName'],
                    substr($role['roleDescription'], 0, 50) . '...',
                    $role['is_default'] ? 'Yes' : 'No'
                ];
            }, $roles)
        );
    }
}