<?php

namespace App\Dto;
use Symfony\Component\Validator\Constraints as Assert;
class CreateReviewDto
{
    #[Assert\NotBlank]
    public string $comment = '';

    #[Assert\NotBlank]
    #[Assert\Choice(choices: [1,2,3,4,5])]
    public int $rating = 0;


}
