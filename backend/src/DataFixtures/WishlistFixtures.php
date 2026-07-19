<?php

namespace App\DataFixtures;
use App\Entity\User;
use App\Document\Wishlist;
use App\Document\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\ODM\MongoDB\MongoDBException;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\ODM\MongoDB\DocumentManager;
use DateTimeImmutable;
use Throwable;

class WishlistFixtures extends Fixture implements DependentFixtureInterface
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
        $this->documentManager->getRepository(Wishlist::class)->createQueryBuilder()
            ->remove()
            ->getQuery()
            ->execute();

        $products = $this->documentManager->getRepository(Product::class)->findAll();

        $user0 = $this->getReference('user_0', User::class);
        $user1 = $this->getReference('user_1', User::class);

        foreach ([$user0, $user1] as $user){
            $randomProducts = (array) array_rand($products, 2);
            $productsIds = array_map(
                fn(int $index) => (string) $products[$index]->getId(),
                $randomProducts
            );
            $wishlist = new Wishlist();
            $wishlist->setUserId((string) $user->getId());
            $wishlist->setProductIds($productsIds);
            $wishlist->setUpdatedAt(new DateTimeImmutable());

            $this->documentManager->persist($wishlist);
        }
        $this->documentManager->flush();
    }

}
