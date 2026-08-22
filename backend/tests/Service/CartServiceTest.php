<?php

namespace App\Tests\Service;

use App\Document\Product;
use App\Dto\AddCartItemDto;
use App\Dto\UpdateCartItemDto;
use App\Entity\Cart;
use App\Entity\CartItem;
use App\Entity\User;
use App\Repository\CartRepository;
use App\Service\CartService;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ObjectRepository;
use InvalidArgumentException;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Uid\Uuid;

/**
 * Tests unitaires ciblés pour CartService.
 *
 * Toutes les dépendances (Doctrine ORM/ODM, repository) sont mockées : ces
 * tests ne nécessitent aucune base de données et se concentrent sur la
 * logique métier du panier (création, ajout/fusion d'articles, mise à jour
 * de quantité, suppression, vidage).
 *
 * Convention utilisée : createStub() pour les dépendances dont on configure
 * juste une valeur de retour, createMock() uniquement quand on vérifie
 * réellement qu'une méthode a été appelée via expects().
 */
class CartServiceTest extends TestCase
{
    private DocumentManager $documentManager;
    private CartRepository $cartRepository;
    private EntityManagerInterface $entityManager;
    private CartService $cartService;

    protected function setUp(): void
    {
        $this->documentManager = $this->createStub(DocumentManager::class);
        $this->cartRepository = $this->createStub(CartRepository::class);
        $this->entityManager = $this->createStub(EntityManagerInterface::class);

        $this->cartService = new CartService(
            $this->documentManager,
            $this->cartRepository,
            $this->entityManager,
        );
    }

    private function makeAddDto(string $productId, int $quantity): AddCartItemDto
    {
        $dto = new AddCartItemDto();
        $dto->productId = $productId;
        $dto->quantity = $quantity;
        return $dto;
    }

    private function makeUpdateDto(int $quantity): UpdateCartItemDto
    {
        $dto = new UpdateCartItemDto();
        $dto->quantity = $quantity;
        return $dto;
    }

    /**
     * Vérifie que getOrCreateCart() renvoie directement le panier existant de
     * l'utilisateur sans créer de nouveau panier ni appeler persist()/flush().
     */
    public function testGetOrCreateCartReturnsExistingCartWithoutPersisting(): void
    {
        $user = $this->createStub(User::class);
        $existingCart = $this->createStub(Cart::class);

        $this->cartRepository->method('findOneBy')->willReturn($existingCart);

        /** @var EntityManagerInterface&MockObject $entityManager */
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects($this->never())->method('persist');
        $entityManager->expects($this->never())->method('flush');
        $this->entityManager = $entityManager;
        $this->cartService = new CartService($this->documentManager, $this->cartRepository, $this->entityManager);

        $result = $this->cartService->getOrCreateCart($user);

        $this->assertSame($existingCart, $result);
    }

    /**
     * Vérifie que getOrCreateCart() crée un nouveau panier (persisté et flush)
     * quand l'utilisateur n'en a encore aucun.
     */
    public function testGetOrCreateCartCreatesNewCartWhenNoneExists(): void
    {
        $user = $this->createStub(User::class);
        $this->cartRepository->method('findOneBy')->willReturn(null);

        /** @var EntityManagerInterface&MockObject $entityManager */
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects($this->once())->method('persist')->with($this->isInstanceOf(Cart::class));
        $entityManager->expects($this->once())->method('flush');
        $this->entityManager = $entityManager;
        $this->cartService = new CartService($this->documentManager, $this->cartRepository, $this->entityManager);

        $result = $this->cartService->getOrCreateCart($user);

        $this->assertInstanceOf(Cart::class, $result);
    }

    /**
     * Vérifie que addItem() rejette l'ajout si le produit référencé n'existe
     * pas dans le catalogue (MongoDB).
     */
    public function testAddItemThrowsWhenProductNotFound(): void
    {
        $user = $this->createStub(User::class);
        $dto = $this->makeAddDto('prod-1', 2);

        $productRepository = $this->createStub(ObjectRepository::class);
        $productRepository->method('find')->willReturn(null);
        $this->documentManager->method('getRepository')->willReturn($productRepository);

        try {
            $this->cartService->addItem($user, $dto);
            $this->fail('InvalidArgumentException attendue non levée.');
        } catch (InvalidArgumentException $e) {
            $this->assertSame('Product not found', $e->getMessage());
        }
    }

    /**
     * Vérifie que addItem() fusionne les quantités (au lieu de créer une
     * seconde ligne) quand le produit est déjà présent dans le panier.
     */
    public function testAddItemIncrementsQuantityWhenProductAlreadyInCart(): void
    {
        $user = $this->createStub(User::class);
        $dto = $this->makeAddDto('prod-1', 3);
        $product = $this->createStub(Product::class);

        $productRepository = $this->createStub(ObjectRepository::class);
        $productRepository->method('find')->willReturn($product);
        $this->documentManager->method('getRepository')->willReturn($productRepository);

        /** @var CartItem&MockObject $existingItem */
        $existingItem = $this->createMock(CartItem::class);
        $existingItem->method('getProductId')->willReturn('prod-1');
        $existingItem->method('getQuantity')->willReturn(2);
        // la quantité existante (2) doit être augmentée de la quantité ajoutée (3) => 5
        $existingItem->expects($this->once())->method('setQuantity')->with(5);

        $cart = $this->createStub(Cart::class);
        $cart->method('getCartItems')->willReturn(new ArrayCollection([$existingItem]));
        $this->cartRepository->method('findOneBy')->willReturn($cart);

        /** @var EntityManagerInterface&MockObject $entityManager */
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects($this->never())->method('persist');
        $entityManager->expects($this->once())->method('flush');
        $this->entityManager = $entityManager;
        $this->cartService = new CartService($this->documentManager, $this->cartRepository, $this->entityManager);

        $result = $this->cartService->addItem($user, $dto);

        $this->assertSame($existingItem, $result);
    }

    /**
     * Vérifie que addItem() crée une nouvelle ligne de panier (persistée et
     * flush) quand le produit n'est pas déjà présent dans le panier.
     */
    public function testAddItemCreatesNewLineWhenProductNotAlreadyInCart(): void
    {
        $user = $this->createStub(User::class);
        $dto = $this->makeAddDto('prod-2', 1);
        $product = $this->createStub(Product::class);

        $productRepository = $this->createStub(ObjectRepository::class);
        $productRepository->method('find')->willReturn($product);
        $this->documentManager->method('getRepository')->willReturn($productRepository);

        $cart = $this->createStub(Cart::class);
        $cart->method('getCartItems')->willReturn(new ArrayCollection());
        $this->cartRepository->method('findOneBy')->willReturn($cart);

        /** @var EntityManagerInterface&MockObject $entityManager */
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects($this->once())->method('persist')->with($this->isInstanceOf(CartItem::class));
        $entityManager->expects($this->once())->method('flush');
        $this->entityManager = $entityManager;
        $this->cartService = new CartService($this->documentManager, $this->cartRepository, $this->entityManager);

        $result = $this->cartService->addItem($user, $dto);

        $this->assertInstanceOf(CartItem::class, $result);
        $this->assertSame('prod-2', $result->getProductId());
        $this->assertSame(1, $result->getQuantity());
    }

    /**
     * Vérifie que updateItemQuantity() met à jour la quantité de la bonne
     * ligne de panier (identifiée par son ID) et déclenche un flush.
     */
    public function testUpdateItemQuantityUpdatesMatchingItem(): void
    {
        $user = $this->createStub(User::class);
        $itemId = Uuid::v4();

        /** @var CartItem&MockObject $item */
        $item = $this->createMock(CartItem::class);
        $item->method('getId')->willReturn($itemId);
        $item->expects($this->once())->method('setQuantity')->with(7);

        $cart = $this->createStub(Cart::class);
        $cart->method('getCartItems')->willReturn(new ArrayCollection([$item]));
        $this->cartRepository->method('findOneBy')->willReturn($cart);

        /** @var EntityManagerInterface&MockObject $entityManager */
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects($this->once())->method('flush');
        $this->entityManager = $entityManager;
        $this->cartService = new CartService($this->documentManager, $this->cartRepository, $this->entityManager);

        $result = $this->cartService->updateItemQuantity($user, (string) $itemId, $this->makeUpdateDto(7));

        $this->assertSame($item, $result);
    }

    /**
     * Vérifie que updateItemQuantity() rejette la mise à jour si aucune ligne
     * de panier ne correspond à l'ID fourni.
     */
    public function testUpdateItemQuantityThrowsWhenItemNotFound(): void
    {
        $user = $this->createStub(User::class);
        $cart = $this->createStub(Cart::class);
        $cart->method('getCartItems')->willReturn(new ArrayCollection());
        $this->cartRepository->method('findOneBy')->willReturn($cart);

        try {
            $this->cartService->updateItemQuantity($user, 'unknown-id', $this->makeUpdateDto(1));
            $this->fail('InvalidArgumentException attendue non levée.');
        } catch (InvalidArgumentException $e) {
            $this->assertSame('Cette ligne de panier n\'existe pas', $e->getMessage());
        }
    }

    /**
     * Vérifie que removeItem() supprime bien la ligne de panier correspondant
     * à l'ID fourni et déclenche un flush.
     */
    public function testRemoveItemRemovesMatchingItem(): void
    {
        $user = $this->createStub(User::class);
        $itemId = Uuid::v4();
        $item = $this->createStub(CartItem::class);
        $item->method('getId')->willReturn($itemId);

        $cart = $this->createStub(Cart::class);
        $cart->method('getCartItems')->willReturn(new ArrayCollection([$item]));
        $this->cartRepository->method('findOneBy')->willReturn($cart);

        /** @var EntityManagerInterface&MockObject $entityManager */
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects($this->once())->method('remove')->with($item);
        $entityManager->expects($this->once())->method('flush');
        $this->entityManager = $entityManager;
        $this->cartService = new CartService($this->documentManager, $this->cartRepository, $this->entityManager);

        $this->cartService->removeItem($user, (string) $itemId);
    }

    /**
     * Vérifie que removeItem() rejette la suppression si aucune ligne de
     * panier ne correspond à l'ID fourni.
     */
    public function testRemoveItemThrowsWhenItemNotFound(): void
    {
        $user = $this->createStub(User::class);
        $cart = $this->createStub(Cart::class);
        $cart->method('getCartItems')->willReturn(new ArrayCollection());
        $this->cartRepository->method('findOneBy')->willReturn($cart);

        $this->expectException(InvalidArgumentException::class);

        $this->cartService->removeItem($user, 'unknown-id');
    }

    /**
     * Vérifie que clearCart() vide bien la collection d'articles du panier
     * et déclenche un flush.
     */
    public function testClearCartEmptiesItemsAndFlushes(): void
    {
        $user = $this->createStub(User::class);
        $item = $this->createStub(CartItem::class);

        $items = new ArrayCollection([$item]);
        $cart = $this->createStub(Cart::class);
        $cart->method('getCartItems')->willReturn($items);
        $this->cartRepository->method('findOneBy')->willReturn($cart);

        /** @var EntityManagerInterface&MockObject $entityManager */
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects($this->once())->method('flush');
        $this->entityManager = $entityManager;
        $this->cartService = new CartService($this->documentManager, $this->cartRepository, $this->entityManager);

        $this->cartService->clearCart($user);

        $this->assertTrue($items->isEmpty());
    }
}
