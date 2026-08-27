<?php

namespace App\Controller;

use App\Dto\UpdateUserDto;
use App\Entity\User;

use App\Service\UserRegistrationService;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\HttpFoundation\Request;
class SecurityController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(): void
    {
        throw new \LogicException('Cette méthode ne doit jamais être appelée directement, elle est interceptée par le firewall JWT.');
    }

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        return $this->json([
            'email' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
            'lastName' => $user->getLastname(),
            'firstName' => $user->getFirstname(),
        ]);
    }
    #[Route('/api/me', name: 'api_me_patch', methods: ['PATCH'])]
    public function patchMe(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        UserRegistrationService $userRegistrationService,
    ): JsonResponse{
        /** @var User $user */
        $user = $this->getUser();
        try{
            $dto = $serializer->deserialize($request->getContent(), UpdateUserDto::class, 'json');
        }catch (ExceptionInterface){
            return $this->json(['errors' => 'le corps de la requete est invalide'], 400);
        }
        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return $this->json(['errors' => $errors], 400);
        }
        $userRegistrationService->updateProfile($user,$dto);
        return $this->json([
            'firstName' => $user->getFirstname(),
            'lastName' => $user->getLastname(),
            'phone' => $user->getPhone(),
        ]);

    }
}
