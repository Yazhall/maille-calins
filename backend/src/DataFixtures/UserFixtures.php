<?php

namespace App\DataFixtures;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use DateTimeImmutable;
class UserFixtures extends Fixture
{
    public const string USER_REFERENCE_PREFIX = 'user_';
    public function load(ObjectManager $manager): void{
        $userData = [
            ['email' => 'lauryne@example.com', 'firstName' => 'Lauryne', 'lastName' => 'Dubois', 'role' => 'customer'],
            ['email' => 'mael@example.com', 'firstName' => 'Maël', 'lastName' => 'Vigier', 'role' => 'customer'],
            ['email' => 'admin@maille-calins.fr', 'firstName' => 'Admin', 'lastName' => 'Maille & Câlins', 'role' => 'admin'],
            ['email' => 'julien.martin@example.com', 'firstName' => 'Julien', 'lastName' => 'Martin', 'role' => 'customer'],
            ['email' => 'sophie.bernard@example.com', 'firstName' => 'Sophie', 'lastName' => 'Bernard', 'role' => 'customer'],
            ['email' => 'thomas.petit@example.com', 'firstName' => 'Thomas', 'lastName' => 'Petit', 'role' => 'customer'],
            ['email' => 'emma.robert@example.com', 'firstName' => 'Emma', 'lastName' => 'Robert', 'role' => 'customer'],
            ['email' => 'lucas.richard@example.com', 'firstName' => 'Lucas', 'lastName' => 'Richard', 'role' => 'customer'],
            ['email' => 'chloe.durand@example.com', 'firstName' => 'Chloé', 'lastName' => 'Durand', 'role' => 'customer'],
            ['email' => 'hugo.leroy@example.com', 'firstName' => 'Hugo', 'lastName' => 'Leroy', 'role' => 'customer'],
            ['email' => 'lea.moreau@example.com', 'firstName' => 'Léa', 'lastName' => 'Moreau', 'role' => 'customer'],
            ['email' => 'nathan.simon@example.com', 'firstName' => 'Nathan', 'lastName' => 'Simon', 'role' => 'customer'],
            ['email' => 'manon.laurent@example.com', 'firstName' => 'Manon', 'lastName' => 'Laurent', 'role' => 'customer'],
            ['email' => 'louis.michel@example.com', 'firstName' => 'Louis', 'lastName' => 'Michel', 'role' => 'customer'],
            ['email' => 'camille.garcia@example.com', 'firstName' => 'Camille', 'lastName' => 'Garcia', 'role' => 'customer'],
        ];
        foreach ($userData as $i => $data) {
            $user = new User();
            $user->setEmail($data['email']);
            $user->setPasswordHash(password_hash('password123', PASSWORD_BCRYPT));
            $user->setFirstName($data['firstName']);
            $user->setLastName($data['lastName']);
            $user->setRole($data['role']);
            $user->setEmailVerified(true);
            $user->setCreatedAt(new DateTimeImmutable());
            $user->setUpdatedAt(new DateTimeImmutable());
            $manager->persist($user);

            $this->addReference(self::USER_REFERENCE_PREFIX . $i, $user);
        }
        $manager->flush();

    }

}
