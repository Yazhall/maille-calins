<?php

namespace App\DataFixtures;
use App\Document\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\MongoDBException;
use Doctrine\Persistence\ObjectManager;
use Throwable;

class CategoryFixtures extends Fixture
{
    public function __construct(private DocumentManager $documentManager)
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
        foreach ($categories as $data) {
            $category = new Category();
            $category->setName($data['name']);
            $category->setSlug($data['slug']);
            $category->setOrder($data['order']);
            $category->setDescription('Description de la catégorie'.$data['name']);
            $this->documentManager->persist($category);


        }
        $this->documentManager->flush();

    }

}
