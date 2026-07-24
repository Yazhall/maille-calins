<?php

namespace App\Service;
use App\Document\Product;
use App\Dto\AddCartItemDto;
use App\Dto\UpdateCartItemDto;
use App\Entity\Cart;
use App\Entity\CartItem;
use App\Entity\User;
use App\Repository\CartItemRepository;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\CartRepository;

class CartService
{
    public function __construct(
        private readonly DocumentManager $documentManager,
        private readonly CartRepository $cartRepository,
        private readonly EntityManagerInterface $entityManager
    ){}
        public function getOrCreateCart(User $user): Cart{

            // TODO
        }
        public function addItem(User $user, AddCartItemDto $dto): CartItem{
            // TODO
        }
        public function updateItemQuantity(User $user, string $itemId, UpdateCartItemDto $dto): CartItem{

        }
        public function removeItem(User $user, string $itemId): void{

        }
        private function findItemOrFail(User $user, string $itemId): CartItem{

        }




}
