<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;
class CreateAddressDto
{
    #[Assert\NotBlank]
    public string $street ='';
    #[Assert\NotBlank]
    public string $city ='';
    #[Assert\NotBlank]
    public string $postalCode ='';
    #[Assert\NotBlank]
    public string $country ='';
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['shipping', 'billing', 'both'])]
    public string $type = '';
    public bool $isDefault = false;

}
