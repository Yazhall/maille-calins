<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;
class UpdateCategoryDto
{
    public ?string $name= null;


    public ?string $description=null;

    public ?string $slug=null;

    public ?int $order = null;


    public ?string $image= null;
}
