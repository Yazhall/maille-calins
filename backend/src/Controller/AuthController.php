<?php

namespace App\Controller;
use App\Dto\RegisterUserDto;
use App\Service\UserRegistrationService;
use InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController extends AbstractController
{
    /**
     * @throws ExceptionInterface
     */
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        UserRegistrationService $userRegistrationService,
    ): JsonResponse{
        $dto = $serializer->deserialize($request->getContent(), RegisterUserDto::class, 'json');
        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return $this->json(['errors' => $errors], 400);
        }
        try {
            $user = $userRegistrationService->register($dto);
        }catch (InvalidArgumentException $exception){
            return $this->json(['errors' => $exception->getMessage()], 400);
        }
        return $this->json([
            'id' => (string) $user->getId(),
            'email' => $user->getEmail(),
        ], 201);

    }

}
