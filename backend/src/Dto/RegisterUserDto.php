<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;

class RegisterUserDto
{
    #[Assert\NotBlank]
    #[Assert\Email]
    public string $email ='';

    #[Assert\NotBlank]
    #[Assert\Length(min: 8, minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.')]
    public string $password = '';
    #[Assert\NotBlank]
    public string $firstName ='';
    #[Assert\NotBlank]
    public string $lastName ='';


}
