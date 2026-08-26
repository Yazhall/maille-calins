<?php

namespace App\Service;
use App\Entity\Order;
use App\Entity\Payment;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;

readonly class PaymentService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    )
    {
    }
    public function processPayment(Order $order): Payment{
        $payment = new Payment();
        $payment->setParentOrder($order);
        $payment->setAmount($order->getTotalAmount());
        $payment->setStatus('success');
        $payment->setProvider('simulated');
        $payment->setPaidAt(new DateTimeImmutable());
        $payment->setTransactionId('TRS-'.$order->getOrderNumber());

        $this->entityManager->persist($payment);
        return $payment;
    }
}
