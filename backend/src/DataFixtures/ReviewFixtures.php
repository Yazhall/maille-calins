<?php

namespace App\DataFixtures;
use App\Entity\User;
use App\Document\Review;
use App\Document\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\MongoDBException;
use Doctrine\Persistence\ObjectManager;
use DateTimeImmutable;
use Throwable;


class ReviewFixtures extends Fixture implements DependentFixtureInterface
{
    public function __construct(private readonly DocumentManager $documentManager){

    }
    public function getDependencies():array{
        return [UserFixtures::class, ProductFixtures::class];
    }

    /**
     * @throws MongoDBException
     * @throws Throwable
     */
    public function load(ObjectManager $manager):void{
        $this->documentManager->getRepository(Review::class)->createQueryBuilder()
            ->remove()
            ->getQuery()
            ->execute();


        $products = $this->documentManager->getRepository(Product::class)->findAll();

        $user0=$this->getReference('user_0',User::class);
        $user1=$this->getReference('user_1',User::class);

        $reviewsData = [
            ['user' => $user0, 'rating' => 5, 'comment' => 'Adorable, très bien fini !'],
            ['user' => $user1, 'rating' => 4, 'comment' => 'Très joli mais un peu petit.'],
        ];
        foreach ($reviewsData as $data){
        $product = $products[array_rand($products)];
        $review = new Review();

        $review->setProductId((string)$product->getId());
        $review->setUserId((string) $data['user']->getId());
        $review->setUserNameSnapshot($data['user']->getFirstName().' '.substr($data['user']->getLastName(), 0, 1).'.');
        $review->setRating($data['rating']);
        $review->setComment($data['comment']);
        $review->setStatus('published');
        $review->setCreatedAt(new DateTimeImmutable());

        $this->documentManager->persist($review);


        }
        $this->documentManager->flush();
    }

}
