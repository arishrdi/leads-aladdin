<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CreateApiToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'api:create-token {email} {name=API Token}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create an API token for a user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $tokenName = $this->argument('name');

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email {$email} not found.");
            return 1;
        }

        $token = $user->createToken($tokenName);

        $this->info("API token created for {$user->name} ({$user->email})");
        $this->info("Token Name: {$tokenName}");
        $this->info("Token: {$token->plainTextToken}");
        $this->warn("⚠️  Make sure to copy this token now. You won't be able to see it again!");

        return 0;
    }
}
