<?php

namespace App\Service;
use App\Dto;
use App\Service\EmailService;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;
use Random\RandomException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use DateTimeImmutable;
readonly class UserRegistrationService
{
    public function __construct(
        private UserRepository              $userRepository,
        private EntityManagerInterface      $entityManager,
        private UserPasswordHasherInterface $userPasswordHasher,
        private EmailService               $emailService,
    ){

    }

    /**
     * @throws RandomException
     * @throws TransportExceptionInterface
     */
    public function register(Dto\RegisterUserDto $dto): User
    {
        if ($this->userRepository->findOneBy(['email' => $dto->email])) {
            throw new InvalidArgumentException("Inscription en cours de traitement.");
        }

        $user = new User();
        $user->setEmail($dto->email);
        $user->setFirstName($dto->firstName);
        $user->setLastName($dto->lastName);
        $user->setRole('customer');
        $user->setEmailVerified(false);
        $user->setCreatedAt(new DateTimeImmutable());
        $user->setUpdatedAt(new DateTimeImmutable());

        $hashedPassword = $this->userPasswordHasher->hashPassword($user, $dto->password);
        $user->setPasswordHash($hashedPassword);
        $token = bin2hex(random_bytes(32));
        $user->setVerificationToken($token);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $this->emailService->sendVerificationEmail($user);

        return $user;

    }

    public function verifyEmail(string $token): User{
        $user = $this->userRepository->findOneBy(['verificationToken' => $token]);
        if (null === $user) {
            throw new InvalidArgumentException("Ce token est invalide.");
        }
        $user->setEmailVerified(true);
        $user->setVerificationToken(null);
        $this->entityManager->flush();
        return $user;

    }


}
