<?php

namespace App\DataFixtures;
use App\Document\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\MongoDBException;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Throwable;

class CategoryFixtures extends Fixture
{
    public function __construct(
        private readonly DocumentManager $documentManager,
        #[Autowire('%kernel.project_dir%')] private readonly string $projectDir,
    )
    {

    }

    /**
     * @throws MongoDBException
     * @throws Throwable
     */
    public function load(ObjectManager $manager): void{
        $this->documentManager->getRepository(Category::class)->createQueryBuilder()
            ->remove()
            ->getQuery()
            ->execute();
        ;
        $categories = [
            ['name' => 'Animaux de la forêt', 'slug' => 'animaux-foret', 'order' => 1],
            ['name' => 'Décorations', 'slug' => 'decorations', 'order' => 2],
            ['name' => 'Accessoires', 'slug' => 'accessoires', 'order' => 3],
            ['name' => 'Nouveautés', 'slug' => 'nouveautes', 'order' => 4],
        ];

        $uploadsDir = $this->projectDir . '/public/uploads/categories';
        if (!is_dir($uploadsDir)) {
            mkdir($uploadsDir, 0777, true);
        }
        $seedImagesDir = $this->projectDir . '/assets/seed-images/categories';

        foreach ($categories as $data) {
            $category = new Category();
            $category->setName($data['name']);
            $category->setSlug($data['slug']);
            $category->setOrder($data['order']);
            $category->setDescription('Description de la catégorie'.$data['name']);

            $seedImage = $this->findSeedImage($seedImagesDir, $data['slug']);
            if ($seedImage !== null) {
                $filename = $data['slug'] . '.' . $seedImage['ext'];
                $localPath = $uploadsDir . '/' . $filename;
                copy($seedImage['path'], $localPath);
                $category->setImage('/uploads/categories/' . $filename);
            }

            $this->documentManager->persist($category);


        }
        $this->documentManager->flush();

    }

    /**
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
