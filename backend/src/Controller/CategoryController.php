<?php

namespace App\Controller;
use App\Document\Category;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class CategoryController extends AbstractController
{
    #[Route('/api/categories', name: 'api_category_list', methods: ['GET'])]
    public function list(DocumentManager $documentManager): JsonResponse
    {
        $categories = $documentManager->getRepository(Category::class)
            ->findBy([], ['order' => 'ASC']);

        $data = array_map(static fn (Category $category) => [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'description' => $category->getDescription(),
            'image' => $category->getImage(),
        ], $categories);
        return $this->json($data);
    }

}

