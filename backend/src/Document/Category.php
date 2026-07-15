<?php

namespace App\Document;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;


#[MongoDB\Document(collection: "categories")]
#[MongoDB\Index(keys: ['slug'=>1], options: ['unique'=>true] )]
class Category
{

    #[MongoDB\Id]
    private ?string $id = null;
    #[MongoDB\Field(name: "name",type: "string")]
    private ?string $name = null;
    #[MongoDB\Field(name: "slug", type: "string")]
    private ?string $slug = null;
    #[MongoDB\Field(name: "description", type: "string")]
    private ?string $description = null;
    #[MongoDB\Field(name: "image", type: "string")]
    private ?string $image = null;
    #[MongoDB\Field(name: "order", type: "int")]
    private int $order = 0;

    public function getId(): ?string
    {
        return $this->id;
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
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

    public function getOrder(): int
    {
        return $this->order;
    }

    public function setOrder(int $order): self
    {
        $this->order = $order;
        return $this;
    }

}
