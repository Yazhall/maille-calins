<?php

namespace App\DataFixtures;
use App\Entity\Address;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class AddressFixtures extends Fixture implements DependentFixtureInterface
{
    public function getDependencies(): array{
        return [UserFixtures::class];
    }
    public function load(ObjectManager $manager): void
    {
        $adressesData = [
            ['userRef' => 'user_0', 'street' => '12 rue des Lilas', 'city' => 'Clermont-Ferrand', 'postalCode' => '63000', 'type' => 'both', 'isDefault' => true],
            ['userRef' => 'user_1', 'street' => '5 avenue Foch', 'city' => 'Aubière', 'postalCode' => '63170', 'type' => 'shipping', 'isDefault' => true],
            ['userRef' => 'user_1', 'street' => '8 rue de la Paix', 'city' => 'Aubière', 'postalCode' => '63170', 'type' => 'billing', 'isDefault' => false],
        ];
        foreach ($adressesData as $i => $data) {
            $user = $this->getReference( $data['userRef'], User::class);
            $address = new Address();
            $address->setStreet($data['street']);
            $address->setCity($data['city']);
            $address->setCountry('France');
            $address->setPostalCode($data['postalCode']);
            $address->setType($data['type']);
            $address->setIsDefault($data['isDefault']);
            $address->setIsActive(true);
            $address->setOwner($user);
            $manager->persist($address);
            $this->addReference('address_' . $i, $address);


        }
        $manager->flush();
    }

}
