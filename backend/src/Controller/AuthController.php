<?php

namespace App\Controller;
use App\Dto\RegisterUserDto;
use App\Dto\ForgotPasswordDto;
use App\Dto\ResetPasswordDto;
use App\Service\UserRegistrationService;
use App\Service\PasswordResetService;
use InvalidArgumentException;
use Random\RandomException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
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

    #[Route('/api/verify-email', name: 'api_verify_email', methods: ['GET'])]
    public function emailVerifyAccount(
        Request $request,
        UserRegistrationService $userRegistrationService,
    ): JsonResponse
    {
        $token = $request->query->get('token');
        if (empty($token)) {
            return $this->json(['errors' => ["token invalide"]], 400);
        }
        try{
            $user = $userRegistrationService->verifyEmail($token);
        }catch (InvalidArgumentException ){
            return $this->json(['errors' => ['le token ne correspond à aucun utilisateur']], 400);
        }

        return $this->json([
            'email' => $user->getEmail(),
            'message'=> 'le compte a bien etait vérifié'

        ]);
    }

    /**
     * @throws ExceptionInterface
     * @throws TransportExceptionInterface
     * @throws RandomException
     */
    #[Route('/api/forgot-password', name: 'api_forgot_password', methods: ['POST']  )]
    public function ForgetPassword(
        Request $request,
        PasswordResetService $passwordResetService,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
    ): JsonResponse
    {
        $dto = $serializer->deserialize($request->getContent(), ForgotPasswordDto::class, 'json');
        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return $this->json(['errors' => $errors], 400);
        }
        $passwordResetService->requestReset($dto->email);
        return $this->json([
            'message' => 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
        ]);
    }
    #[Route('/api/reset-password', name: 'api_reset_password', methods: ['POST'])]
    public function ResetPassword(
        Request $request,
        PasswordResetService $passwordResetService,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
    ): JsonResponse{
        $dto = $serializer->deserialize($request->getContent(), ResetPasswordDto::class, 'json');
        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return $this->json(['errors' => $errors], 400);
        }
        try{
            $passwordResetService->resetPassword($dto);
        }catch (InvalidArgumentException $exception){
            return $this->json(['errors' => $exception->getMessage()], 400);
        }
        return $this->json([
            'message' => 'Votre mot de passe a été réinitialisé avec succès.',
        ]);
    }

}
