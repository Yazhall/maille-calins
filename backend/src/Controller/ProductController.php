<?php

namespace App\Controller;
use App\Document\Product;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
class ProductController extends AbstractController
{
    #[Route('/api/products', name: 'api_product_list', methods: ['GET'])]
    public function list(Request $request, DocumentManager $documentManager): JsonResponse{
        $criteria = ['status' => 'published'];

        $categoryId = $request->query->get('categoryId');
        if ($categoryId !== null) {
            $criteria['categoryIds'] = $categoryId;
        }

        $products = $documentManager->getRepository(Product::class)
            ->findBy($criteria);

        $data = array_map(static fn (Product $product)=> [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'slug' => $product->getSlug(),
            'image' => $product->getImage(),
            'price' => $product->getPrice(),
            'stock' => $product->getStock(),
            'categoryIds' => $product->getCategoryIds(),
            'ratingAverage' => $product->getRatingAverage(),
            'ratingCount' => $product->getRatingCount(),

        ], $products);
        return $this->json($data);
    }

    #[Route('/api/products/by-id/{id}', name: 'api_product_detail_by_id', methods: ['GET'])]
    public function detailById( DocumentManager $documentManager, string $id): JsonResponse{
        $product = $documentManager->getRepository(Product::class)
            ->findOneBy(['id' => $id, 'status' => 'published']);
        if ($product === null) {
            return $this->json(['error' => 'product not found'], 404);
        }
        return $this->json([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'slug' => $product->getSlug(),
            'image' => $product->getImage(),
            'price' => $product->getPrice(),
            'stock' => $product->getStock(),
            'categoryIds' => $product->getCategoryIds(),
            'ratingAverage' => $product->getRatingAverage(),
            'ratingCount' => $product->getRatingCount(),
        ]);
    }
    #[Route('/api/products/{slug}', name: 'api_product_detail', methods: ['GET'])]
    public function detail( DocumentManager $documentManager, string $slug): JsonResponse{
        $product = $documentManager->getRepository(Product::class)
            ->findOneBy(['slug' => $slug, 'status'=> 'published']);

        if ($product === null) {
            return $this->json(['error' => 'product not found'], 404);
        }

        return $this->json([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'slug' => $product->getSlug(),
            'description' => $product->getDescription(),
            'image' => $product->getImage(),
            'price' => $product->getPrice(),
            'stock' => $product->getStock(),
            'categoryIds' => $product->getCategoryIds(),
            'ratingAverage' => $product->getRatingAverage(),
            'ratingCount' => $product->getRatingCount(),
        ]);
    }


}
