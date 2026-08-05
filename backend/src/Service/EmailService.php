<?php

namespace App\Service;
use App\Entity\User;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
readonly class EmailService
{
    public function __construct(
        private MailerInterface $mailer,
    ) {
    }

    /**
     * @throws TransportExceptionInterface
     */
    public function sendVerificationEmail(User $user): void{
        $email = new Email()
        ->from('no-reply@maille-calins.fr')
        ->to($user->getEmail())
            ->subject('Confirmation de votre compte')
            ->text("Bonjour {$user->getFirstName()},\n\nCliquez sur ce lien pour valider votre compte : http://localhost:8080/api/verify-email?token={$user->getVerificationToken()}");
        $this->mailer->send($email);
    }

}
