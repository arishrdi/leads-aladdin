<?php

namespace Database\Seeders;

use App\Models\FollowUpStage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FollowUpStageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get stages from config to migrate to database
        $configStages = config('leads.follow_up_stages', []);
        $stageProgression = config('leads.follow_up.auto_scheduling.stage_progression', []);
        
        $order = 1;
        foreach ($configStages as $key => $name) {
            FollowUpStage::updateOrCreate(
                ['key' => $key],
                [
                    'name' => $name,
                    'display_order' => $order,
                    'next_stage_key' => $stageProgression[$key] ?? null,
                    'is_active' => true,
                ]
            );
            $order++;
        }

        $this->command->info('Follow-up stages seeded successfully!');
    }
}
