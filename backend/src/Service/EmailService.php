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
            ->text("Bonjour {$user->getFirstName()},\n\nCliquez sur ce lien pour valider votre compte : http://localhost:5173/verify-email?token={$user->getVerificationToken()}");
        $this->mailer->send($email);
    }

    /**
     * @throws TransportExceptionInterface
     */
    public function sendPasswordResetEmail(User $user): void{
        $email = new Email()
            ->from('no-reply@maille-calins.fr')
            ->to($user->getEmail())
                ->subject('Lien de changement de mots de passe')
                ->text("Bonjour {$user->getFirstName()},\n\nCliquez sur ce lien pour etre redirigé sur la page de changement de mots de passe  : http://localhost:5173/reset-password?token={$user->getResetPasswordToken()}");
        $this->mailer->send($email);
    }

}
