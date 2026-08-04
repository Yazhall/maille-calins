<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;


class UpdateOrderStatusDto
{
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['pending','confirmed','shipped','delivered', 'cancelled'])]
    public string $status = '';

}
