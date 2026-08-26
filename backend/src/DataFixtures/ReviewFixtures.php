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

        $reviewsData = [
            ['userRef' => 'user_0', 'rating' => 5, 'comment' => 'Adorable, très bien fini !'],
            ['userRef' => 'user_1', 'rating' => 4, 'comment' => 'Très joli mais un peu petit.'],
            ['userRef' => 'user_3', 'rating' => 5, 'comment' => 'Magnifique qualité, je recommande !'],
            ['userRef' => 'user_4', 'rating' => 3, 'comment' => 'Correct, sans plus.'],
            ['userRef' => 'user_5', 'rating' => 5, 'comment' => 'Parfait pour offrir, très soigné.'],
            ['userRef' => 'user_6', 'rating' => 4, 'comment' => 'Belle finition, livraison rapide.'],
            ['userRef' => 'user_7', 'rating' => 5, 'comment' => 'Exactement comme sur les photos !'],
            ['userRef' => 'user_8', 'rating' => 2, 'comment' => 'Déçue par la taille, trop petit.'],
            ['userRef' => 'user_9', 'rating' => 5, 'comment' => 'Un vrai coup de cœur, superbe travail.'],
            ['userRef' => 'user_10', 'rating' => 4, 'comment' => 'Très satisfaite de mon achat.'],
            ['userRef' => 'user_11', 'rating' => 5, 'comment' => 'Cadeau parfait, tout le monde a adoré.'],
            ['userRef' => 'user_12', 'rating' => 3, 'comment' => 'Bien mais un peu cher pour la taille.'],
        ];

        $affectedProductIds = [];

        foreach ($reviewsData as $data){
            $user = $this->getReference($data['userRef'], User::class);
            $product = $products[array_rand($products)];
            $review = new Review();

            $review->setProductId((string)$product->getId());
            $review->setUserId((string) $user->getId());
            $review->setUserNameSnapshot($user->getFirstName().' '.substr($user->getLastName(), 0, 1).'.');
            $review->setRating($data['rating']);
            $review->setComment($data['comment']);
            $review->setStatus('published');
            $review->setCreatedAt(new DateTimeImmutable());

            $this->documentManager->persist($review);

            $affectedProductIds[(string) $product->getId()] = true;
        }
        $this->documentManager->flush();

        foreach (array_keys($affectedProductIds) as $productId) {
            $this->recalculateProductRating($productId);
        }
    }

    private function recalculateProductRating(string $productId): void{
        $reviews = $this->documentManager->getRepository(Review::class)->findBy(['productId' => $productId, 'status' => 'published']);

        $product = $this->documentManager->getRepository(Product::class)->find($productId);

        if (empty($reviews)) {
            $product->setRatingAverage(0);
            $product->setRatingCount(0);
        } else {
            $average = array_sum(array_map(fn(Review $review) => $review->getRating(), $reviews)) / count($reviews);
            $product->setRatingAverage($average);
            $product->setRatingCount(count($reviews));
        }

        $this->documentManager->persist($product);
        $this->documentManager->flush();
    }

}
