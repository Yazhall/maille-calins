<?php

namespace App\Controller;
use App\Dto\CreateOrderDto;
use App\Entity\Order;
use App\Entity\User;
use App\Service\OrderService;
use InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Throwable;

class OrderController extends AbstractController
{
    /**
     * @throws Throwable
     */
    #[Route('/api/orders', name: 'api_order_create', methods: ['POST'])]
public function createOrder(
        OrderService $orderService,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        Request $request,



    ): JsonResponse{
        /** @var User $user */
    $user = $this->getUser();
    try{
        $createOrderDto = $serializer->deserialize($request->getContent(), CreateOrderDto::class, 'json');

    }catch(ExceptionInterface){
        return $this->json(['error' => 'Corps de requête invalide'], 400);
    }
    $errors = $validator->validate($createOrderDto);
    if (count($errors) > 0) {
        return $this->json(['errors' => (string) $errors], 400);
    }

    try{
        $order = $orderService->createOrder(
            $user,
            $createOrderDto->shippingAddressId,
            $createOrderDto->billingAddressId);
    }catch(InvalidArgumentException $exception){
        return $this->json(['error' => $exception->getMessage()], 400);

    }
    $data = $this->formatOrder($order);
    return $this->json($data,201);
}

private function formatOrder(Order $order): array{
        return [
            'id' =>(string)$order->getId(),
            'status' => $order->getStatus(),
            'orderNumber' => $order->getOrderNumber(),
            'totalAmount' => $order->getTotalAmount(),
            'createdAt' => $order->getCreatedAt()->format('Y-m-d H:i:s'),
            'items' => array_map(fn($item) => [
                'productId' => $item->getProductId(),
                'name' => $item->getProductNameSnapshot(),
                'quantity' => $item->getQuantity(),
                'price' => $item->getProductPriceSnapshot(),
            ], $order->getOrderItems()->toArray()),
        ];
}

    #[Route('/api/orders', name: 'api_order_list', methods: ['GET'])]
    public function listOrder(
        OrderService $orderService,
    ): JsonResponse{
        /** @var User $user */
        $user = $this->getUser();


        $orders = $orderService->listOrders($user);
        $data = array_map(
            fn (Order $data) => $this->formatOrder($data),
            $orders
        );
        return $this->json($data, 200);

    }
    #[Route('/api/orders/{id}', name: 'api_order_detail', methods: ['GET'])]
    public function orderDetail(
        string $id,
        OrderService $orderService,
        ): JsonResponse{
        /** @var User $user */
        $user = $this->getUser();
        try{
            $order = $orderService->getOrderDetail($user,$id);
        }catch(InvalidArgumentException $exception){
            return $this->json(['error' => $exception->getMessage()], 404);
        }
        $data = $this->formatOrder($order);
        return $this->json($data, 200);

    }




}
