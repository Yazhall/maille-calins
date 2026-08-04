<?php

namespace App\Document;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use DateTimeImmutable;
#[MongoDB\Document(collection: "products")]
#[MongoDB\Index(keys: ['slug' => 1], options: ['unique' => true])]
class Product
{
    #[MongoDB\Id]
    private ?string $id = null;
    #[MongoDB\Field(name: "name", type: "string")]
    private ?string $name = null;
    #[MongoDB\Field(name: "slug", type: "string")]
    private ?string $slug = null;
    #[MongoDB\Field(name: "price", type: "float")]
    private ?float $price = null;
    #[MongoDB\Field(name: "description", type: "string")]
    private ?string $description = null;
    #[MongoDB\Field(name: "image", type: "string")]
    private  ?string $image = null ;
    #[MongoDB\Field(name: "status", type: "string")]
    private ?string $status = null;
    #[MongoDB\Field(name: "stock", type: "int")]
    private ?int $stock = null;
    #[MongoDB\Field(name: "categoryIds", type: "collection")]
    private array $categoryIds = [];
    #[MongoDB\Field(name: "createdAt", type: "date_immutable")]
    private ? DateTimeImmutable $createdAt = null;
    #[MongoDB\Field(name: "updatedAt", type: "date_immutable")]
    private ? DateTimeImmutable $updatedAt = null;
    #[MongoDB\Field(name: "ratingAverage", type: "float")]
    private float $ratingAverage = 0.0;
    #[MongoDB\Field(name: "ratingCount", type: "int")]
    private int $ratingCount = 0;

    public function getId(): ?string{
        return $this->id;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): self
    {
        $this->image = $image;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): self
    {
        $this->slug = $slug;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): self
    {
        $this->price = $price;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
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

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(?int $stock): self
    {
        $this->stock = $stock;
        return $this;
    }

    public function getCategoryIds(): array
    {
        return $this->categoryIds;
    }

    public function setCategoryIds(array $categoryIds): self
    {
        $this->categoryIds = $categoryIds;
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

    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    public function getRatingAverage(): float
    {
        return $this->ratingAverage;
    }

    public function setRatingAverage(float $ratingAverage): self
    {
        $this->ratingAverage = $ratingAverage;
        return $this;
    }

    public function getRatingCount(): int
    {
        return $this->ratingCount;
    }

    public function setRatingCount(int $ratingCount): self
    {
        $this->ratingCount = $ratingCount;
        return $this;
    }

}
