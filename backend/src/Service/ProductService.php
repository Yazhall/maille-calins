<?php

namespace App\Service;
use App\Document\Product;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\LockException;
use Doctrine\ODM\MongoDB\Mapping\MappingException;

readonly class ProductService
{
    public function __construct(
        private DocumentManager $documentManager,
    )
    {

    }
    public function findById(string $id): ?Product{
        return $this->documentManager
            ->getRepository(Product::class)
            ->findOneBy(['id' => $id, 'status' => 'published']);

    }

}
