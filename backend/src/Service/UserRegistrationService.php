<?php

namespace App\Service;
use App\Dto;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use DateTimeImmutable;
readonly class UserRegistrationService
{
    public function __construct(
        private UserRepository              $userRepository,
        private EntityManagerInterface      $entityManager,
        private UserPasswordHasherInterface $userPasswordHasher,
    ){

    }
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

        $this->entityManager->persist($user);
        $this->entityManager->flush();
        return $user;

    }

}
