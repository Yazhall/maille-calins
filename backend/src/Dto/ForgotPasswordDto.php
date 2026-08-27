<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;
class ForgotPasswordDto
{
    #[Assert\NotBlank]
    public string  $email = '';

}
