<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;
class AddCartItemDto
{
    #[Assert\NotBlank]
    private string $productId = '';
    #[Assert\NotBlank]
    #[Assert\Positive]
    private int $quantity = 1;

}
