<?php

namespace App\Document;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use DateTimeImmutable;
#[MongoDB\Document(collection: "wishlists")]
#[MongoDB\Index(keys: ["userId" => 1], options: ["unique" => true])]
class Wishlist
{
    #[MongoDB\Id]
    private ?string $id = null;
    #[MongoDB\Field(name: "userId", type: "string")]
    private ?string $userId = null;
    #[MongoDB\Field(name: "productIds", type: "collection")]
    private array $productIds = [];
    #[MongoDB\Field(name: "updatedAt", type: "date_immutable")]
    private ?DateTimeImmutable $updatedAt = null;

    public function getId(): ?string
    {
        return $this->id;
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

    public function getProductIds(): array
    {
        return $this->productIds;
    }

    public function setProductIds(array $productIds): self
    {
        $this->productIds = $productIds;
        return $this;
    }

    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }




}
