<?php

namespace App\DataFixtures;
use App\Document\Category;
use App\Document\Product;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\ODM\MongoDB\MongoDBException;
use Doctrine\Persistence\ObjectManager;
use DateTimeImmutable;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class ProductFixtures extends Fixture
{
    public function __construct(
        private readonly DocumentManager $documentManager,
        #[Autowire('%kernel.project_dir%')] private readonly string $projectDir,
    )
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
            ['name' => 'Hibou câlin', 'slug' => 'hibou-calin', 'price' => 26.50, 'stock' => 9],
            ['name' => 'Coussin étoile', 'slug' => 'coussin-etoile', 'price' => 21.00, 'stock' => 14],
            ['name' => 'Guirlande fanions', 'slug' => 'guirlande-fanions', 'price' => 12.90, 'stock' => 18],
            ['name' => 'Chaussons bébé', 'slug' => 'chaussons-bebe', 'price' => 14.50, 'stock' => 22],
            ['name' => 'Sac à main crochet', 'slug' => 'sac-main-crochet', 'price' => 34.90, 'stock' => 7],
            ['name' => 'Chouette porte-clés', 'slug' => 'chouette-porte-cles', 'price' => 9.90, 'stock' => 25],
            ['name' => 'Couverture bébé', 'slug' => 'couverture-bebe', 'price' => 38.00, 'stock' => 6],
            ['name' => 'Mitaines laine', 'slug' => 'mitaines-laine', 'price' => 16.90, 'stock' => 11],
            ['name' => 'Panda amigurumi', 'slug' => 'panda-amigurumi', 'price' => 27.90, 'stock' => 10],
        ];

        $uploadsDir = $this->projectDir . '/public/uploads/products';
        if (!is_dir($uploadsDir)) {
            mkdir($uploadsDir, 0777, true);
        }
        $seedImagesDir = $this->projectDir . '/assets/seed-images/products';

        foreach ($productData as $data) {
            $product = new Product();
            $product->setName($data['name']);
            $product->setSlug($data['slug']);
            $product->setDescription('Description du produit '.$data['name']);
            $product->setPrice($data['price']);
            $product->setStock($data['stock']);
            $product->setStatus('published');
            $product->setCreatedAt(new DateTimeImmutable());
            $product->setUpdatedAt(new DateTimeImmutable());

            $seedImage = $this->findSeedImage($seedImagesDir, $data['slug']);
            if ($seedImage !== null) {
                $filename = $data['slug'] . '.' . $seedImage['ext'];
                $localPath = $uploadsDir . '/' . $filename;
                copy($seedImage['path'], $localPath);
                $product->setImage('/uploads/products/' . $filename);
            }
            // Si aucune image seed n'existe pour ce produit (ex: nouveau produit sans photo
            // encore fournie), le champ image reste simplement non renseigné.

            $randomCategory = $categories[array_rand($categories)];
            $product->setCategoryIds([$randomCategory->getId()]);
            $this->documentManager->persist($product);


        }
        $this->documentManager->flush();
    }

    /**
     * Cherche une image seed pour le slug donné parmi les extensions courantes.
     * Retourne le chemin absolu et l'extension trouvée, ou null si aucune image
     * n'existe pour ce produit.
     *
     * @return array{path: string, ext: string}|null
     */
    private function findSeedImage(string $dir, string $slug): ?array
    {
        foreach (['jpg', 'jpeg', 'png', 'webp'] as $ext) {
            $path = $dir . '/' . $slug . '.' . $ext;
            if (is_file($path)) {
                return ['path' => $path, 'ext' => $ext];
            }
        }
        return null;
    }

}
