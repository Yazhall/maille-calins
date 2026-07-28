<?php

namespace App\Service;
use App\Entity\Address;
use App\Entity\User;
use App\Repository\AddressRepository;
use App\Dto\CreateAddressDto;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;
readonly class AddressService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AddressRepository      $addressRepository,

    ){}
    public function setDefaultAddress(User $user,string $addressId): Address{
        $address = $this->findOwnedAddressOrFail($user, $addressId);

        $currentDefault = $this->addressRepository->findBy(['owner'=>$user, 'isDefault'=>true]);
        foreach ($currentDefault as $addres){
            $addres->setIsDefault(false);
        }
        $address->setIsDefault(true);
        $this->entityManager->flush();
        return $address;
    }
    public function createAddress(User $user, CreateAddressDto $dto): Address{
        $existingAddress = $this->addressRepository->findBy(['owner'=>$user]);
        $isFirstAddress = count($existingAddress) === 0;
        $address = new Address();
        $address->setIsActive(true);
        $address->setOwner( $user);
        $address->setCountry($dto->country);
        $address->setCity($dto->city);
        $address->setStreet($dto->street);
        $address->setPostalCode($dto->postalCode);
        $address->setType($dto->type);
        $shouldBeDefault =$isFirstAddress||$dto->isDefault;
        $address->setIsDefault($shouldBeDefault);
        if ($shouldBeDefault){
            foreach ($existingAddress as $addres){
                if($addres->isDefault()){
                    $addres->setIsDefault(false);
                }
            }
        }

        $this->entityManager->persist($address);
        $this->entityManager->flush();

        return $address;

    }


    public function listAddresses(User $user): array{
        return $this->addressRepository->findBy(['owner'=>$user,'isActive'=>true]);
    }

    public function deactivateAddress(User $user, string $addressId): void{
       $address = $this->findOwnedAddressOrFail($user, $addressId);

       $address->setIsActive(false);
       $this->entityManager->flush();
    }

    public function findDefaultAddress(User $user): ?Address{

        return $this->addressRepository->findOneBy(['owner'=>$user, 'isDefault'=>true]);

    }

    private function findOwnedAddressOrFail(User $user, string $addressId): Address
    {
        $address = $this->addressRepository->findOneBy(['id' => $addressId, 'owner' => $user]);

        if ($address === null) {
            throw new InvalidArgumentException('Cette Address n\'existe pas');
        }

        return $address;
    }

    public function getAddress(User $user, string $addressId): Address{
        return $this->findOwnedAddressOrFail($user,$addressId);
    }


}
