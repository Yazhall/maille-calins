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
        return [UserFixtures::class, AddressFixtures::class];
    }
    public function load(ObjectManager $manager): void{
        $products = $this->documentManager->getRepository(Product::class)->findAll();

        $ordersData = [
            ['userRef' => 'user_0', 'addressRef' => 'address_0', 'status' => 'delivered', 'itemCount' => 2],
            ['userRef' => 'user_1', 'addressRef' => 'address_1', 'status' => 'delivered', 'itemCount' => 1],
            ['userRef' => 'user_3', 'addressRef' => 'address_3', 'status' => 'shipped', 'itemCount' => 3],
            ['userRef' => 'user_4', 'addressRef' => 'address_4', 'status' => 'confirmed', 'itemCount' => 1],
            ['userRef' => 'user_5', 'addressRef' => 'address_5', 'status' => 'pending', 'itemCount' => 2],
            ['userRef' => 'user_6', 'addressRef' => 'address_6', 'status' => 'delivered', 'itemCount' => 1],
            ['userRef' => 'user_7', 'addressRef' => 'address_7', 'status' => 'cancelled', 'itemCount' => 1],
            ['userRef' => 'user_8', 'addressRef' => 'address_8', 'status' => 'shipped', 'itemCount' => 2],
            ['userRef' => 'user_9', 'addressRef' => 'address_9', 'status' => 'pending', 'itemCount' => 1],
            ['userRef' => 'user_0', 'addressRef' => 'address_0', 'status' => 'confirmed', 'itemCount' => 2],
        ];

        foreach ($ordersData as $i => $data) {
            $customer = $this->getReference($data['userRef'], User::class);
            $address = $this->getReference($data['addressRef'], Address::class);

            $order = new Order();
            $order->setOrderNumber('CMD-2026-' . str_pad((string) ($i + 1), 5, '0', STR_PAD_LEFT));
            $order->setStatus($data['status']);
            $order->setCreatedAt(new DateTimeImmutable());
            $order->setUpdatedAt(new DateTimeImmutable());
            $order->setCustomer($customer);
            $order->setShippingAddress($address);
            $order->setBillingAddress($address);

            $manager->persist($order);

            $totalAmount = 0.0;
            $selectedProducts = (array) array_rand($products, $data['itemCount']);


            foreach ($selectedProducts as $productIndex) {
                $product = $products[$productIndex];
                $quantity = random_int(1, 3);

                $orderItem = new OrderItem();
                $orderItem->setProductId((string) $product->getId());
                $orderItem->setProductNameSnapshot($product->getName());
                $orderItem->setProductPriceSnapshot((string) $product->getPrice());
                $orderItem->setQuantity($quantity);
                $orderItem->setParentOrder($order);

                $manager->persist($orderItem);

                $totalAmount += $product->getPrice() * $quantity;
            }

            $order->setTotalAmount((string) $totalAmount);

            $payment = new Payment();
            $payment->setProvider('simulated');
            $payment->setStatus('success');
            $payment->setAmount((string) $totalAmount);
            $payment->setTransactionId('sim_' . uniqid());
            $payment->setPaidAt(new DateTimeImmutable());
            $payment->setParentOrder($order);

            $manager->persist($payment);
        }

        $manager->flush();

    }

}
