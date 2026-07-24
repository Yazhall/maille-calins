<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;
class AddCartItemDto
{
    #[Assert\NotBlank]
    public string $productId = '';
    #[Assert\NotBlank]
    #[Assert\Positive]
    public int $quantity = 1;

}
