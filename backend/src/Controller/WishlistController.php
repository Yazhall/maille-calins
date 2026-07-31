<?php

namespace App\Controller;
use App\Document\Wishlist;
use App\Service\WishlistService;
use Doctrine\ODM\MongoDB\MongoDBException;
use InvalidArgumentException;
use App\Dto\AddWishlistItemDto;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class WishlistController extends AbstractController
{

    /**
     * @throws Throwable
     * @throws MongoDBException
     */
    #[Route('/api/wishlist', name: 'api_wishlist_list', methods: ['GET'])]
    public function listWishlist( WishlistService $wishlistService): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $wishlist = $wishlistService->getOrCreateWishlist($user);

        $data = $this->formatWishlist($wishlist);
        return $this->json($data);

    }
    #[Route('/api/wishlist/items', name: 'api_wishlist_items', methods: ['POST'])]
    public function addItem(Request $request, SerializerInterface $serializer, WishlistService $wishlistService, ValidatorInterface  $validator): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        try{
            $dto = $serializer->deserialize($request->getContent(), AddWishlistItemDto::class, 'json');
        }catch (ExceptionInterface ){
            return $this->json(['error' => 'coprs de la requete invalide '], 400);
        }
        $errors = $validator->validate($dto);
        if (count($errors) > 0) {
            return $this->json(['error' =>(string) $errors], 400);
        }
        $productId = $dto->productId;
        try{
            $product = $wishlistService->addProduct($user,$productId);
        }catch (InvalidArgumentException $exception ){
            return $this->json(['error' => $exception->getMessage()], 400);
        }
        $data = $this->formatWishlist($product);
        return $this->json($data,201);

    }
    #[Route('/api/wishlist/items/{productId}', name: 'api_wishlist_items_remove', methods: ['DELETE'])]
    public function removeItem(string $productId, WishlistService $wishlistService):Response{
        /** @var User $user */
        $user = $this->getUser();

        try{
            $wishlistService->removeProduct($user,$productId);
        }catch (InvalidArgumentException $exception ){
            return $this->json(['error' => $exception->getMessage()], 400);
        }
        return new Response(null, 204);
    }

    private function formatWishlist (Wishlist $wishlist): array{
        return [
            'id' => $wishlist->getId(),
            'productIds' => $wishlist->getProductIds(),
            'updatedAt' => $wishlist->getUpdatedAt()->format('Y-m-d H:i:s'),

        ];
    }


}
