<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;
class UpdateCartItemDto
{
    #[Assert\NotBlank]
    #[Assert\Positive]
    public int $quantity = 1;
}
