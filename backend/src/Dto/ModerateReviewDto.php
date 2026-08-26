<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;
class ModerateReviewDto
{
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['pending','published','rejected'])]
    public string $status ='';

}
