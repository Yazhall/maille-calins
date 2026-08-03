<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;
class CreateCategoryDto
{
    #[Assert\NotBlank]
    public string $name='';
    #[Assert\NotBlank]
    public string $description='';
    #[Assert\NotBlank]
    public string $slug='';
    #[Assert\NotBlank]
    public int $order = 0;
    #[Assert\NotBlank]
    public string $image='';
}
