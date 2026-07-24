<?php

namespace App\Controller;

use App\Dto\AddCartItemDto;
use App\Dto\UpdateCartItemDto;
use App\Entity\CartItem;
use App\Entity\User;
use App\Service\CartService;
use Doctrine\ODM\MongoDB\LockException;
use Doctrine\ODM\MongoDB\Mapping\MappingException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\Response;
class CartController extends AbstractController
{
    #[Route('/api/cart', name: 'api_cart_get', methods: ['GET'])]
    public function getCart(CartService $cartService): JsonResponse
    {

        /** @var User $user */
        $user = $this->getUser();


        $cart = $cartService->getOrCreateCart($user);


        $data = $this->formatCart($cart);
        return $this->json($data);

    }

    /**

     * @throws MappingException
     * @throws LockException
     */
    #[Route('/api/cart/items', name: 'api_cart_add_item', methods: ['POST'])]
    public function addItem(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        CartService $cartService,
    ): JsonResponse {
        /** @var User $user */
        $user = $this->getUser();
        try{
            $dto = $serializer->deserialize($request->getContent(), AddCartItemDto::class, 'json');
        }catch(ExceptionInterface ){
            return $this->json(['error' => 'Corps de requête invalide'], 400);
        }



        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], 400);
        }


        try{
            $item = $cartService->addItem($user, $dto);
        }catch( \InvalidArgumentException $exception){
            return $this->json(['error' => $exception->getMessage()], 400);
        }
        $data = $this->formatItem($item);
        return $this->json($data, 201);


    }


    #[Route('/api/cart/items/{id}', name: 'api_cart_update_item', methods: ['PATCH'])]
    public function updateItem(
        string $id,
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        CartService $cartService,
    ): JsonResponse {

        /** @var User $user */
        $user = $this->getUser();
        try{
            $dto = $serializer->deserialize($request->getContent(), UpdateCartItemDto::class, 'json');
        }catch(ExceptionInterface ){
            return $this->json(['error' =>'Corps de requête invalide' ], 400);
        }

        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], 400);
        }


        try {
            $item = $cartService->updateItemQuantity( $user,$id,  $dto);
        }catch(\InvalidArgumentException $exception){
            return $this->json(['error' => $exception->getMessage()], 404);
        }
        $data = $this->formatItem($item);
        return $this->json($data);

    }

    #[Route('/api/cart/items/{id}', name: 'api_cart_remove_item', methods: ['DELETE'])]
    public function removeItem(string $id, CartService $cartService): Response
    {
        /** @var User $user */

        $user = $this->getUser();


        try{
            $cartService->removeItem($user,$id);
        }catch( \InvalidArgumentException $exception){
            return $this->json(['error' => $exception->getMessage()], 404);
        }
        return new Response(null, 204);
    }

    private function formatCart($cart): array
    {
        $items = array_map(
            fn (CartItem $item) => $this->formatItem($item),
            $cart->getCartItems()->toArray()
        );

       return [
           'id' =>(string) $cart->getId(),
           'items' => $items,
       ];

    }

    private function formatItem(CartItem $item): array
    {
        return  [
            'id' =>(string) $item->getId(),
            'productId' => $item->getProductId(),
            'quantity' => $item->getQuantity(),
        ];

    }
}
