<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;

class AddWishlistItemDto
{
    #[Assert\NotBlank]
    public string $productId = '';

}
