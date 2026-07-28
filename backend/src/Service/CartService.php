<?php

namespace App\Service;
use App\Document\Product;
use App\Dto\AddCartItemDto;
use App\Dto\UpdateCartItemDto;
use App\Entity\Cart;
use App\Entity\CartItem;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\LockException;
use Doctrine\ODM\MongoDB\Mapping\MappingException;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\CartRepository;
use InvalidArgumentException;
readonly class CartService
{
    public function __construct(
        private DocumentManager        $documentManager,
        private CartRepository         $cartRepository,
        private EntityManagerInterface $entityManager
    ){}
        public function getOrCreateCart(User $user): Cart{
            $cart = $this->cartRepository->findOneBy(['owner' => $user]);
            if ($cart !== null){
                return $cart;
            }else{

                $cart = new Cart();
                $cart->setOwner($user);
                $cart->setUpdatedAt(new DateTimeImmutable);
                $cart->setCreatedAt(new DateTimeImmutable);
                $this->entityManager->persist($cart);
                $this->entityManager->flush();

            }
            return $cart;
        }

    /**
     * @throws MappingException
     * @throws LockException
     */
    public function addItem(User $user, AddCartItemDto $dto): CartItem{

             $product = $this->documentManager->getRepository(Product::class)->find($dto->productId);

             if ($product === null){
                 throw new InvalidArgumentException('Product not found');
             }
             $cart = $this->getOrCreateCart($user);

             $existingItem = null;
             foreach ($cart->getCartItems() as $item){
                 if ($item->getProductId() === $dto->productId){
                     $existingItem = $item;
                     break;
                 }
             }
             if ($existingItem !== null){
                 $existingItem->setQuantity($existingItem->getQuantity() + $dto->quantity);
                 $this->entityManager->flush();
                 return $existingItem;
            }
             $cartItem = new CartItem();
             $cartItem->setProductId($dto->productId);
             $cartItem->setQuantity($dto->quantity);
             $cartItem->setAddedAt(new DateTimeImmutable);
             $cartItem->setCart($cart);


             $this->entityManager->persist($cartItem);
             $this->entityManager->flush();


             return $cartItem;
        }
        public function updateItemQuantity(User $user, string $itemId, UpdateCartItemDto $dto): CartItem{
            $item = $this->findItemOrFail($user,$itemId);
            $item->setQuantity( $dto->quantity);
            $this->entityManager->flush();
            return $item;
        }
        public function removeItem(User $user, string $itemId): void{
        $item = $this->findItemOrFail($user,$itemId);
        $this->entityManager->remove($item);
        $this->entityManager->flush();
        }
        private function findItemOrFail(User $user, string $itemId): CartItem{
            $cart = $this->getOrCreateCart($user);

            foreach ($cart->getCartItems() as $item){
                if ((string) $item->getId() === $itemId){
                    return $item;
                }

            }
            throw new InvalidArgumentException('Cette ligne de panier n\'existe pas');

        }

        public function clearCart(User $user): void{
        $cart = $this->getOrCreateCart($user);
        $cart->getCartItems()->clear();
        $this->entityManager->flush();
        }




}
