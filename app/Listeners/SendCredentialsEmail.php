<?php

namespace App\Listeners;

use App\Mail\CredentialsEmail;
use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendCredentialsEmail implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
    }

    /**
     * Handle the event.
     */
    public function handle(Verified $event): void
    {
        Mail::to($event->user->userEmail)->send(new CredentialsEmail($event->user));
    }
}
