<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'tester@example.com'],
            [
                'name' => 'Tester',
                'password' => Hash::make('password123'), 
            ]
        );
    }
}
