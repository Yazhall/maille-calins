<?php

namespace App\Controller;
use App\Dto\CreateAddressDto;
use App\Entity\Address;
use App\Service\AddressService;
use InvalidArgumentException;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\Response;
class AddressController extends AbstractController
{

    #[Route('/api/addresses', name: 'api_address_list', methods: ['GET'])]
    public function listAddress(AddressService $addressService): JsonResponse{
        /** @var User $user */
        $user = $this->getUser();

        $address = $addressService->listAddresses($user);

        $datas = array_map(
            fn(Address $data) => $this->formatAddress($data),
            $address
        );
        return $this->json($datas);

    }

    private function formatAddress(Address $addresses): array{

      return [
          'id' => (string)$addresses->getId(),
          'street' => $addresses->getStreet(),
          'city' => $addresses->getCity(),
          'postalCode' => $addresses->getPostalCode(),
          'country' => $addresses->getCountry(),
          'type' => $addresses->getType(),
          'isDefault' => $addresses->isDefault()
      ];
    }
    #[Route('/api/addresses', name: 'api_address_add', methods: ['POST'])]
    public function createAddress(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        AddressService $addressService    ): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        try{
            $dto = $serializer->deserialize($request->getContent(), CreateAddressDto::class, 'json');
        }catch(ExceptionInterface ){
            return $this->json(['error' => 'Corps de la requetes invalides'], 400);
        }

        $errors = $validator->validate($dto);
        if (count($errors) > 0){
            return $this->json(['errors' => (string) $errors], 400);
        }

        try{
            $address = $addressService->createAddress($user, $dto);
        }catch(InvalidArgumentException $exception){
            return $this->json(['error' => $exception->getMessage()], 400);
        }
        $data = $this->formatAddress($address);
        return $this->json($data,201);

    }

    #[Route('/api/addresses/{id}/default', name: 'api_address_set_Default', methods: ['PATCH'])]
    public function updateDefaultAddress(
        AddressService $addressService,
        string $id
    ): JsonResponse
    {
        /** @var User $user */

        $user = $this->getUser();

        try{
            $address = $addressService->setDefaultAddress($user, $id);
        }catch(InvalidArgumentException $exception){
            return $this->json(['error' => $exception->getMessage()], 400);
        }
        $data = $this->formatAddress($address);
        return $this->json($data);
    }
    #[Route('/api/addresses/{id}', name: 'api_address_delete', methods: ['DELETE'])]
    public function deleteAddress(AddressService $addressService, string $id): Response{
        /** @var User $user */
        $user = $this->getUser();

        try{
            $addressService->deactivateAddress($user, $id);
        }Catch(\InvalidArgumentException $exception){
            return $this->json(['error' => $exception->getMessage()], 400);
        }

        return new Response(null, 204);

    }
}
