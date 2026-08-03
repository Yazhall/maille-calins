<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;

class UpdateProductDto
{

    public ?string $name= null;

    public ?string $slug= null;

    public ?string $description = null;

    public ?float $price= null;


    public ?int $stock= null;

    public ?string $status = null;

    public ?array $categoryIds= null;

}
