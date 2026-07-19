<?php

namespace App\DataFixtures;
use App\Entity\Order;
use App\Entity\OrderItem;
use App\Entity\User;
use App\Entity\Address;
use App\Entity\Payment;
use App\Document\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\ODM\MongoDB\DocumentManager;
use DateTimeImmutable;

class OrderFixtures extends Fixture implements DependentFixtureInterface
{
    public function __construct(private readonly DocumentManager $documentManager){

    }
    public function getDependencies(): array{
        return [UserFixtures::class,AddressFixtures::class];
    }
    public function load(ObjectManager $manager): void{
        $customer = $this->getReference('user_0', User::class);

        $address = $this->getReference('address_0', Address::class);
        $product = $this->documentManager->getRepository(Product::class)->findAll();
        $product = $product[array_rand($product)];

        $order = new Order();
        $order->setOrderNumber('CMD-2026-00001');
        $order->setStatus('paid');
        $order->setTotalAmount((string)$product->getPrice());
        $order->setCreatedAt(new DateTimeImmutable());
        $order->setUpdatedAt(new DateTimeImmutable());
        $order->setCustomer($customer);
        $order->setShippingAddress($address);
        $order->setBillingAddress($address);

        $manager->persist($order);

        $orderItem = new OrderItem();
        $orderItem->setProductId((string)$product->getId());
        $orderItem->setProductNameSnapshot($product->getName());
        $orderItem->setProductPriceSnapshot((string)$product->getPrice());
        $orderItem->setQuantity(1);
        $orderItem->setParentOrder($order);

        $manager->persist($orderItem);

        $payment = new Payment();
        $payment->setProvider('stripe');
        $payment->setStatus('succeeded');
        $payment->setAmount((string)$product->getPrice());
        $payment->setTransactionId('pi_teste'.uniqid());
        $payment->setPaidAt(new DateTimeImmutable());
        $payment->setParentOrder($order);

        $manager->persist($payment);

        $manager->flush();

    }

}
