<?php

namespace App\Service;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Dto\ResetPasswordDto;
use Doctrine\ORM\EntityManagerInterface;
use DateTimeImmutable;
use InvalidArgumentException;
use Random\RandomException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

readonly class PasswordResetService
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private EmailService $emailService,
        private UserPasswordHasherInterface $userPasswordHasher,
    ){

    }

    /**
     * @throws RandomException
     * @throws TransportExceptionInterface
     */
    public function requestReset(string $email): void
    {

        $user = $this->userRepository->findOneBy(['email' => $email]);
        if ($user !== null){
            $token = bin2hex(random_bytes(32));
            $user->setResetPasswordToken($token);
            $user->setResetPasswordTokenExpiresAt(new DateTimeImmutable('+1 hour'));
            $this->entityManager->persist($user);
            $this->entityManager->flush();
            $this->emailService->sendPasswordResetEmail($user);
        }
    }

    public function resetPassword(ResetPasswordDto $dto): void
    {
        $user = $this->userRepository->findOneBy(['resetPasswordToken' => $dto->token]);
        if ($user === null){
            throw new InvalidArgumentException("Reset password token invalid");
        }
        if ($user->getResetPasswordTokenExpiresAt() < new DateTimeImmutable()){
            throw new InvalidArgumentException("Reset password token expired");
        }

        $hashedPassword = $this->userPasswordHasher->hashPassword($user, $dto->newPassword);
        $user->setPasswordHash($hashedPassword);
        $user->setResetPasswordToken(null);
        $user->setResetPasswordTokenExpiresAt(null);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

    }

}
