<?php

namespace App\Tests\Service;

use App\Document\Product;
use App\Entity\Address;
use App\Entity\Cart;
use App\Entity\CartItem;
use App\Entity\Order;
use App\Entity\User;
use App\Repository\OrderRepository;
use App\Service\AddressService;
use App\Service\CartService;
use App\Service\OrderService;
use App\Service\PaymentService;
use App\Service\ProductService;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

/**
 * Tests unitaires ciblés pour OrderService.
 *
 * Toutes les dépendances (Doctrine ORM/ODM, services métier, repository) sont
 * mockées : ces tests ne nécessitent aucune base de données et se concentrent
 * sur la logique métier du tunnel de commande (calcul du total, décrément de
 * stock, gestion des adresses, statuts, historique d'achat).
 *
 * Convention utilisée : createStub() pour les dépendances dont on configure
 * juste une valeur de retour, createMock() uniquement quand on vérifie
 * réellement qu'une méthode a été appelée via expects().
 */
class OrderServiceTest extends TestCase
{
    private EntityManagerInterface $entityManager;
    private DocumentManager $documentManager;
    private AddressService $addressService;
    private CartService $cartService;
    private ProductService $productService;
    private PaymentService $paymentService;
    private OrderRepository $orderRepository;
    private OrderService $orderService;

    protected function setUp(): void
    {
        $this->entityManager = $this->createStub(EntityManagerInterface::class);
        $this->documentManager = $this->createStub(DocumentManager::class);
        $this->addressService = $this->createStub(AddressService::class);
        $this->cartService = $this->createStub(CartService::class);
        $this->productService = $this->createStub(ProductService::class);
        $this->paymentService = $this->createStub(PaymentService::class);
        $this->orderRepository = $this->createStub(OrderRepository::class);

        // wrapInTransaction exécute simplement la closure passée, comme le ferait la vraie transaction
        $this->entityManager
            ->method('wrapInTransaction')
            ->willReturnCallback(fn(callable $func) => $func());

        $this->orderService = new OrderService(
            $this->entityManager,
            $this->documentManager,
            $this->addressService,
            $this->cartService,
            $this->productService,
            $this->paymentService,
            $this->orderRepository,
        );
    }

    private function makeCartItem(string $productId, int $quantity): CartItem
    {
        $item = $this->createStub(CartItem::class);
        $item->method('getProductId')->willReturn($productId);
        $item->method('getQuantity')->willReturn($quantity);
        return $item;
    }

    private function makeProductStub(string $id, string $name, float $price, int $stock): Product
    {
        $product = $this->createStub(Product::class);
        $product->method('getId')->willReturn($id);
        $product->method('getName')->willReturn($name);
        $product->method('getPrice')->willReturn($price);
        $product->method('getStock')->willReturn($stock);
        return $product;
    }

    /**
     * Vérifie que createOrder() rejette la création de commande quand le panier
     * de l'utilisateur est vide, avec le message d'erreur exact attendu.
     */
    public function testCreateOrderThrowsWhenCartIsEmpty(): void
    {
        $user = $this->createStub(User::class);
        $cart = $this->createStub(Cart::class);
        $cart->method('getCartItems')->willReturn(new ArrayCollection());

        $this->cartService->method('getOrCreateCart')->willReturn($cart);

        try {
            $this->orderService->createOrder($user, null, null);
            $this->fail('InvalidArgumentException attendue non levée.');
        } catch (InvalidArgumentException $e) {
            $this->assertSame('Cart is empty', $e->getMessage());
        }
    }

    /**
     * Vérifie que createOrder() rejette la commande si un produit présent dans
     * le panier n'existe plus (findById renvoie null), avant tout calcul de total.
     */
    public function testCreateOrderThrowsWhenProductNotFound(): void
    {
        $user = $this->createStub(User::class);
        $address = $this->createStub(Address::class);
        $cartItem = $this->makeCartItem('prod-1', 2);

        $cart = $this->createStub(Cart::class);
        $cart->method('getCartItems')->willReturn(new ArrayCollection([$cartItem]));

        $this->cartService->method('getOrCreateCart')->willReturn($cart);
        $this->addressService->method('findDefaultAddress')->willReturn($address);
        $this->productService->method('findById')->willReturn(null);

        try {
            $this->orderService->createOrder($user, null, null);
            $this->fail('InvalidArgumentException attendue non levée.');
        } catch (InvalidArgumentException $e) {
            $this->assertSame('produit introuvable', $e->getMessage());
        }
    }

    /**
     * Vérifie que createOrder() rejette la commande quand la quantité demandée
     * dépasse le stock disponible du produit (5 demandés, seulement 2 en stock).
     */
    public function testCreateOrderThrowsWhenStockIsInsufficient(): void
    {
        $user = $this->createStub(User::class);
        $address = $this->createStub(Address::class);
        $cartItem = $this->makeCartItem('prod-1', 5);
        $product = $this->makeProductStub('prod-1', 'Lapin en laine', 19.90, 2);

        $cart = $this->createStub(Cart::class);
        $cart->method('getCartItems')->willReturn(new ArrayCollection([$cartItem]));

        $this->cartService->method('getOrCreateCart')->willReturn($cart);
        $this->addressService->method('findDefaultAddress')->willReturn($address);
        $this->productService->method('findById')->willReturn($product);

        $this->expectException(InvalidArgumentException::class);

        $this->orderService->createOrder($user, null, null);
    }

    /**
     * Vérifie que createOrder() rejette la commande si l'utilisateur n'a aucune
     * adresse par défaut et qu'aucun ID d'adresse n'a été fourni explicitement.
     */
    public function testCreateOrderThrowsWhenNoAddressAvailable(): void
    {
        $user = $this->createStub(User::class);
        $cartItem = $this->makeCartItem('prod-1', 1);

        $cart = $this->createStub(Cart::class);
        $cart->method('getCartItems')->willReturn(new ArrayCollection([$cartItem]));

        $this->cartService->method('getOrCreateCart')->willReturn($cart);
        $this->addressService->method('findDefaultAddress')->willReturn(null);

        try {
            $this->orderService->createOrder($user, null, null);
            $this->fail('InvalidArgumentException attendue non levée.');
        } catch (InvalidArgumentException $e) {
            $this->assertSame('Aucune address enregister', $e->getMessage());
        }
    }

    /**
     * Cas nominal : vérifie qu'une commande valide (1 article, quantité 2, stock
     * suffisant, adresse par défaut disponible) est correctement créée :
     * - le stock du produit est décrémenté de la quantité commandée
     * - le total de la commande est bien calculé (quantité × prix)
     * - le panier est vidé une fois la commande passée
     * - le paiement est déclenché
     * - le statut initial de la commande est "pending"
     *
     * Ce test a besoin de vérifier de vraies invocations (setStock, clearCart,
     * processPayment) : on utilise donc ici de vrais createMock() plutôt que
     * les stubs par défaut, pour pouvoir appeler expects().
     */
    public function testCreateOrderSucceedsAndComputesTotalAndDecrementsStock(): void
    {
        $user = $this->createStub(User::class);
        $address = $this->createStub(Address::class);
        $cartItem = $this->makeCartItem('prod-1', 2);

        /** @var Product&MockObject $product */
        $product = $this->createMock(Product::class);
        $product->method('getId')->willReturn('prod-1');
        $product->method('getName')->willReturn('Lapin en laine');
        $product->method('getPrice')->willReturn(19.90);
        $product->method('getStock')->willReturn(5);
        // le stock doit être décrémenté de la quantité commandée
        $product->expects($this->once())->method('setStock')->with(3);

        $cart = $this->createStub(Cart::class);
        $cart->method('getCartItems')->willReturn(new ArrayCollection([$cartItem]));

        /** @var CartService&MockObject $cartService */
        $cartService = $this->createMock(CartService::class);
        $cartService->method('getOrCreateCart')->willReturn($cart);
        // le panier doit être vidé une fois la commande créée
        $cartService->expects($this->once())->method('clearCart')->with($user);
        $this->cartService = $cartService;

        /** @var PaymentService&MockObject $paymentService */
        $paymentService = $this->createMock(PaymentService::class);
        // le paiement doit être traité une fois la commande créée
        $paymentService->expects($this->once())->method('processPayment');
        $this->paymentService = $paymentService;

        $this->addressService->method('findDefaultAddress')->willReturn($address);
        $this->productService->method('findById')->willReturn($product);

        // on reconstruit le service avec les mocks fraîchement remplacés
        $this->orderService = new OrderService(
            $this->entityManager,
            $this->documentManager,
            $this->addressService,
            $this->cartService,
            $this->productService,
            $this->paymentService,
            $this->orderRepository,
        );

        $order = $this->orderService->createOrder($user, null, null);

        $this->assertSame((string) (2 * 19.90), $order->getTotalAmount());
        $this->assertSame('pending', $order->getStatus());
    }

    /**
     * Vérifie que getOrderDetail() rejette la demande quand aucune commande ne
     * correspond à l'utilisateur et l'ID fournis (protection contre l'accès
     * à la commande d'un autre client).
     */
    public function testGetOrderDetailThrowsWhenOrderNotFound(): void
    {
        $user = $this->createStub(User::class);
        $this->orderRepository->method('findOneBy')->willReturn(null);

        try {
            $this->orderService->getOrderDetail($user, 'unknown-id');
            $this->fail('InvalidArgumentException attendue non levée.');
        } catch (InvalidArgumentException $e) {
            $this->assertSame('cette commande n\'existe pas', $e->getMessage());
        }
    }

    /**
     * Vérifie que updateOrderStatus() rejette la mise à jour si l'ID de commande
     * fourni ne correspond à aucune commande existante.
     */
    public function testUpdateOrderStatusThrowsWhenOrderNotFound(): void
    {
        $this->orderRepository->method('findOneBy')->willReturn(null);

        $this->expectException(InvalidArgumentException::class);

        $this->orderService->updateOrderStatus('unknown-id', 'shipped');
    }

    /**
     * Vérifie que hasUserPurchasedProduct() détecte correctement si un produit
     * donné fait partie des articles déjà commandés par l'utilisateur (true) ou
     * non (false) — logique utilisée pour n'autoriser les avis clients que sur
     * des produits réellement achetés.
     */
    public function testHasUserPurchasedProductReturnsTrueWhenProductFoundInOrders(): void
    {
        $user = $this->createStub(User::class);

        $orderItem = $this->createStub(\App\Entity\OrderItem::class);
        $orderItem->method('getProductId')->willReturn('prod-42');

        $order = $this->createStub(Order::class);
        $order->method('getOrderItems')->willReturn(new ArrayCollection([$orderItem]));

        $this->orderRepository->method('findBy')->willReturn([$order]);

        $this->assertTrue($this->orderService->hasUserPurchasedProduct($user, 'prod-42'));
        $this->assertFalse($this->orderService->hasUserPurchasedProduct($user, 'prod-99'));
    }
}
