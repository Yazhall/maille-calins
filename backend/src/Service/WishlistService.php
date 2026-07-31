<?php

namespace App\Service;
use App\Document\Wishlist;
use App\Entity\User;
use DateTimeImmutable;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\MongoDBException;
use Throwable;
 readonly class WishlistService
{
    public function __construct(
        private DocumentManager $documentManager,



    ){}

     /**
      * @throws MongoDBException
      * @throws Throwable
      */
     public function getOrCreateWishlist(User $user): Wishlist {
        $wishlist = $this->documentManager->getRepository(Wishlist::class)->findOneBy(['userId' =>(string) $user->getId()]);
        if ($wishlist !== null) {
            return $wishlist;
        }else {
            $wishlist = new Wishlist();
            $wishlist->setUserId((string)$user->getId());
            $wishlist->setUpdatedAt(new DateTimeImmutable());
            $this->documentManager->persist($wishlist);
            $this->documentManager->flush();
        }
        return $wishlist;
     }

     /**
      * @throws MongoDBException
      * @throws Throwable
      */
     public function addProduct(User $user, string $productId): Wishlist{

         $wishlist = $this->getOrCreateWishlist($user);


         if (in_array($productId, $wishlist->getProductIds())) {
             return $wishlist;
         }else {
             $productIds = $wishlist->getProductIds();
             $productIds[] = $productId;
             $wishlist->setProductIds($productIds);
             $wishlist->setUpdatedAt(new DateTimeImmutable);
             $this->documentManager->persist($wishlist);
             $this->documentManager->flush();
         }
         return $wishlist;

     }

     /**
      * @throws Throwable
      * @throws MongoDBException
      */
     public function removeProduct(User $user, string $productId): Wishlist{
         $wishlist = $this->getOrCreateWishlist($user);

         $productIds = $wishlist->getProductIds();
         $productIdToRemove = $productId;

         $filteredProductIds = array_filter($productIds, fn($id) => $id !== $productIdToRemove);
         $wishlist->setProductIds($filteredProductIds);
         $wishlist->setUpdatedAt(new DateTimeImmutable);
         $this->documentManager->persist($wishlist);
         $this->documentManager->flush();
         return $wishlist;
     }
}
