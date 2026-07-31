<?php

namespace App\Service;
use App\Entity\Order;
use App\Entity\OrderItem;
use App\Entity\Address;
use App\Repository\OrderRepository;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;
use Throwable;

readonly class OrderService
{

    public function __construct(
        private EntityManagerInterface $entityManager,
        private AddressService         $addressService,
        private CartService            $cartService,
        private ProductService         $productService,
        private PaymentService         $paymentService,
        private OrderRepository        $orderRepository,
    ){
    }

    /**
     * @throws Throwable
     */
    public function createOrder(User $user, ?string $shippingAddressId, ?string $billingAddressId): Order
    {
        return $this->entityManager->wrapInTransaction(function ()use($user, $shippingAddressId, $billingAddressId): Order {
        $cart = $this->cartService->getOrCreateCart($user);


        $items = $cart->getCartItems();
        if ($items->isEmpty()){
            throw new InvalidArgumentException('Cart is empty');
        }
        $billingAddress = $this->resolveAddress($user,$billingAddressId);
        $shippingAddress = $this->resolveAddress($user,$shippingAddressId);

        $order = new Order();
        $order->setCreatedAt(new DateTimeImmutable());
        $order->setUpdatedAt(new DateTimeImmutable());
        $order->setOrderNumber('CMD-'.$order->getCreatedAt()->format('Ymd').'-'.substr((string)$order->getId(), 0,8));
        $order->setStatus('pending');
        $order->setCustomer($user);
        $order->setShippingAddress($shippingAddress);
        $order->setBillingAddress($billingAddress);

        $totalAmount = 0;

        foreach ($cart->getCartItems() as $item){
           $product= $this->productService->findById($item->getProductId());
            if ($product == null){
                throw new InvalidArgumentException('Item not found');
            }
            $orderItem = new OrderItem();
            $orderItem->setProductId($product->getId());
            $orderItem->setQuantity($item->getQuantity());
            $orderItem->setParentOrder($order);
            $orderItem->setProductNameSnapshot($product->getName());
            $orderItem->setProductPriceSnapshot((string)$product->getPrice());
            $this->entityManager->persist($orderItem);
            $totalAmount += $item->getQuantity() * $product->getPrice();
        }
        $order->setTotalAmount((string)$totalAmount);
        $this->entityManager->persist($order);
        $this->paymentService->processPayment($order);

        $this ->cartService->clearCart($user);
        $this->entityManager->flush();

        return $order;
        });
    }
    private function resolveAddress (User $user, ?string $addressId): Address
    {
        if ($addressId !== null){
            $currentAddress =$this->addressService->getAddress($user,$addressId);

        }else{
            $currentAddress = $this ->addressService->findDefaultAddress($user);
        }

        if ($currentAddress === null){
            throw new InvalidArgumentException('Aucune address enregister');
        }
        return $currentAddress;
    }
    public function listOrders(User $user): array
    {
        return $this->orderRepository->findBy(['customer'=>$user ],['createdAt'=>'DESC']);


    }
    public function getOrderDetail(User $user, string $orderId): Order{

        $orderdetail = $this->orderRepository->findOneBy(['customer'=>$user,'id'=>$orderId ]);

        if ($orderdetail === null){
            throw new InvalidArgumentException('cette commande n\'existe pas');
        }
        return $orderdetail;
    }

    public function hasUserPurchasedProduct(User $user, string $productId): bool{
        $orders = $this->listOrders($user);
        foreach ($orders as $order){
            foreach ($order->getOrderItems() as $orderItem){
                if ($orderItem->getProductId() === $productId){
                    return true;
                }

            }
        }
        return false;
    }

}
