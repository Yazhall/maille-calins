<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;
class CreateOrderDto
{
    #[Assert\Uuid]
    public ?string $shippingAddressId = null ;
    #[Assert\Uuid]
    public ?string $billingAddressId = null ;

}
