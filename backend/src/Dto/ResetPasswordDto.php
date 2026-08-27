<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;
class ResetPasswordDto
{
    #[Assert\NotBlank]
    public string $token ='';
    #[Assert\NotBlank]
    #[Assert\Length(min: 8, minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.')]
    public string $newPassword= '';


}
