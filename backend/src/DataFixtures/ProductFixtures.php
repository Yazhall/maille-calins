<?php

namespace App\DataFixtures;
use App\Document\Category;
use App\Document\Product;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\ODM\MongoDB\MongoDBException;
use Doctrine\Persistence\ObjectManager;
use DateTimeImmutable;
class ProductFixtures extends Fixture
{
    public function __construct(private readonly DocumentManager $documentManager)
    {

    }

    /**
     * @throws \Throwable
     * @throws MongoDBException
     */
    public function load(ObjectManager $manager): void
    {
        $categories = $this->documentManager->getRepository(Category::class)->findAll();
        $this->documentManager->getRepository(Product::class)->createQueryBuilder()
            ->remove()
            ->getQuery()
            ->execute();
        $productData = [
            ['name' => 'Renard amigurumi', 'slug' => 'renard-amigurumi', 'price' => 24.90, 'stock' => 8],
            ['name' => 'Lapin en laine', 'slug' => 'lapin-en-laine', 'price' => 19.90, 'stock' => 12],
            ['name' => 'Plaid en crochet', 'slug' => 'plaid-en-crochet', 'price' => 49.00, 'stock' => 5],
            ['name' => 'Panier de rangement', 'slug' => 'panier-de-rangement', 'price' => 15.50, 'stock' => 20],
            ['name' => 'Écharpe en laine', 'slug' => 'echarpe-en-laine', 'price' => 22.00, 'stock' => 10],
            ['name' => 'Bonnet crochet', 'slug' => 'bonnet-crochet', 'price' => 18.00, 'stock' => 15],
        ];
        foreach ($productData as $data) {
            $product = new Product();
            $product->setName($data['name']);
            $product->setSlug($data['slug']);
            $product->setDescription('Description du produit'.$data['name']);
            $product->setPrice($data['price']);
            $product->setStock($data['stock']);
            $product->setStatus('published');
            $product->setCreatedAt(new DateTimeImmutable());
            $product->setUpdatedAt(new DateTimeImmutable());

            $randomCategory = $categories[array_rand($categories)];
            $product->setCategoryIds([$randomCategory->getId()]);
            $this->documentManager->persist($product);


        }
        $this->documentManager->flush();
    }

}
