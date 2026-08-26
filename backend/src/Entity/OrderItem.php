<?php

namespace App\Entity;

use App\Repository\OrderItemRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Symfony\Bridge\Doctrine\Types\UuidType;

#[ORM\Entity(repositoryClass: OrderItemRepository::class)]
class OrderItem
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    private Uuid $id;

    #[ORM\Column(length: 24)]
    private ?string $productId = null;

    #[ORM\Column(length: 255)]
    private ?string $productNameSnapshot = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $productPriceSnapshot = null;

    #[ORM\Column]
    private ?int $quantity = null;

    #[ORM\ManyToOne(inversedBy: 'orderItems')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Order $parentOrder = null;

    public function __construct()
    {
        $this->id=Uuid::v7();

    }

    public function getId(): Uuid
    {
        return $this->id;
    }

    public function getProductId(): ?string
    {
        return $this->productId;
    }

    public function setProductId(string $productId): static
    {
        $this->productId = $productId;

        return $this;
    }

    public function getProductNameSnapshot(): ?string
    {
        return $this->productNameSnapshot;
    }

    public function setProductNameSnapshot(string $productNameSnapshot): static
    {
        $this->productNameSnapshot = $productNameSnapshot;

        return $this;
    }

    public function getProductPriceSnapshot(): ?string
    {
        return $this->productPriceSnapshot;
    }

    public function setProductPriceSnapshot(string $productPriceSnapshot): static
    {
        $this->productPriceSnapshot = $productPriceSnapshot;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getParentOrder(): ?Order
    {
        return $this->parentOrder;
    }

    public function setParentOrder(?Order $parentOrder): static
    {
        $this->parentOrder = $parentOrder;

        return $this;
    }
}
