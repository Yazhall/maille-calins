<?php

namespace App\Document;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use DateTimeImmutable;
#[MongoDB\Document(collection: "reviews")]
#[MongoDB\Index(keys: ['productId'=>1 ,'userId'=>1], options: ['unique' => true])]
class Review
{
    #[MongoDB\Id]
private ?string $id = null;
    #[MongoDB\Field(name: "productId", type: "string")]
private ?string $productId = null;
    #[MongoDB\Field(name: "userId", type: "string")]
private ?string $userId = null;
    #[MongoDB\Field(name: "userNameSnapshot", type: "string")]
private ?string $userNameSnapshot = null;
    #[MongoDB\Field(name: "rating", type: "int")]
private ?int $rating = null;
    #[MongoDB\Field(name: "comment", type: "string")]
private ?string $comment = null;
    #[MongoDB\Field(name: "status", type: "string")]
private ?string $status = null;
    #[MongoDB\Field(name: "createdAt", type: "date_immutable")]
private ?\DateTimeImmutable $createdAt = null;

    public function getId(): ?string
    {
        return $this->id;
    }
    public function getProductId(): ?string
    {
        return $this->productId;
    }

    public function setProductId(?string $productId): self
    {
        $this->productId = $productId;
        return $this;
    }

    public function getUserId(): ?string
    {
        return $this->userId;
    }

    public function setUserId(?string $userId): self
    {
        $this->userId = $userId;
        return $this;
    }

    public function getUserNameSnapshot(): ?string
    {
        return $this->userNameSnapshot;
    }

    public function setUserNameSnapshot(?string $userNameSnapshot): self
    {
        $this->userNameSnapshot = $userNameSnapshot;
        return $this;
    }

    public function getRating(): ?int
    {
        return $this->rating;
    }

    public function setRating(?int $rating): self
    {
        $this->rating = $rating;
        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): self
    {
        $this->comment = $comment;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(?string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }


}
