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
