<?php

namespace App\Controller\Admin;
use App\Dto\CreateOrderDto;
use App\Entity\Order;
use App\Entity\User;
use App\Service\OrderService;
use App\Dto\UpdateOrderStatusDto;
use DateTimeImmutable;
use InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Throwable;

#[IsGranted('ROLE_ADMIN')]
class OrderController extends AbstractController
{
    #[Route('/api/admin/orders', name: 'api_all_order_list', methods: ['GET'])]
    public function displayAllOrders(
        OrderService $orderService,
    ): JsonResponse {
        $orders = $orderService->listAllOrders();

        $data = array_map(
            fn(Order $order) => $this->formatOrder($order),
            $orders
        );
        return $this->json($data);

    }
    private function formatOrder(Order $order): array{
        return [
            'id' =>(string)$order->getId(),
            'status' => $order->getStatus(),
            'orderNumber' => $order->getOrderNumber(),
            'totalAmount' => $order->getTotalAmount(),
            'createdAt' => $order->getCreatedAt()->format('Y-m-d H:i:s'),
        ];
    }

    #[Route('/api/admin/orders/{id}/status', name: 'api_change_status_order_list', methods: ['PATCH'])]
    public function changeStatus(
        string $id,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        Request $request,
        OrderService $orderService,
    ): JsonResponse{

        try{
            $updateOrderStatusDto = $serializer->deserialize($request->getContent(), UpdateOrderStatusDto::class, 'json');
        }catch (ExceptionInterface ){
            return $this->json(['errors'=> 'le corps de la requete est invalide'],400);
        }
        $errors = $validator->validate($updateOrderStatusDto);
        if(count($errors) > 0){
            return $this->json(['errors'=>(string) $errors],400);
        }
        try {
            $orderAtModify = $orderService->updateOrderStatus($id, $updateOrderStatusDto->status);
        }catch (InvalidArgumentException $exception){
            return $this->json(['errors'=> $exception->getMessage()],404);
        }
        return $this->json($this->formatOrder($orderAtModify));
    }

}
