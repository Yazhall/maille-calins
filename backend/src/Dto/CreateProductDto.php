<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;
class CreateProductDto
{
    #[Assert\NotBlank]
    public string $name='';
    #[Assert\NotBlank]
    public string $slug='';
    #[Assert\NotBlank]
    public string $description = '';
    #[Assert\NotBlank]
    public float $price=0.0;


    public int $stock=0;
    #[Assert\NotBlank]
    public string $status ='';
    #[Assert\NotBlank]
    public array $categoryIds= [];



}
