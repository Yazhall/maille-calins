<?php

namespace App\Service;
use App\Document\Product;
use App\Entity\User;
use App\Document\Review;
use DateTimeImmutable;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\LockException;
use Doctrine\ODM\MongoDB\Mapping\MappingException;
use Doctrine\ODM\MongoDB\MongoDBException;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;
use App\Dto\CreateReviewDto;
use Throwable;

readonly class ReviewService
{
    public function __construct(
        private DocumentManager $documentManager,
        private OrderService            $orderService,

    ){}

    /**
     * @throws MongoDBException
     * @throws Throwable
     */
    public function createReview(User $user, string $productId, CreateReviewDto $dto): Review{

        $productBuy = $this->orderService->hasUserPurchasedProduct($user, $productId);
        if ($productBuy === false){
            throw new InvalidArgumentException('Vous devez avoir acheté ce produit pour laisser un avis');
        }

        //Vérifier qu'il n'a pas déjà laissé une review sur ce produit
        $reviewIs = $this->documentManager->getRepository(Review::class)->findOneBy(['productId' => $productId, 'userId' =>(string) $user->getId()]);
        if ($reviewIs !== null){
            throw new InvalidArgumentException("un review a deja etait laisser sur ce produit");
        }
        $review = new Review();
        $review->setProductId($productId);
        $review->setUserId((string)$user->getId());
        $review->setComment($dto->comment);
        $review->setRating($dto->rating);
        $review->setCreatedAt(new DateTimeImmutable());
        $review->setStatus('pending');
        $review->setUserNameSnapshot($user->getFirstName().' '.$user->getLastName());
        $this->documentManager->persist($review);
        $this->documentManager->flush();

        return $review;
    }

    public function listReviewsByProduct(string $productId): array{
        return  $this->documentManager->getRepository(Review::class)->findBy(['productId' => $productId,'status' => 'published'], ['createdAt' => 'DESC']);
    }

    public function listPendingReviews():array{
        return $this->documentManager->getRepository(Review::class)->findBy(['status' => 'pending']);
    }
    public function listPublishedReviews():array{
        return $this->documentManager->getRepository(Review::class)->findBy(['status' => 'published'],['createdAt' => 'DESC']);
    }

    /**
     * @throws MappingException
     * @throws LockException
     */
    public function moderateReview(string $reviewId, string $status): Review{
        $review = $this->documentManager->getRepository(Review::class)->find($reviewId);
        if ($review === null){
            throw new InvalidArgumentException("review n\'existe pas");
        }
        $review->setStatus($status);
        $this->documentManager->persist($review);
        $this->documentManager->flush();
        $this->recalculateProductRating($review->getProductId());
        return $review;
    }
    public function recalculateProductRating(string $productId): void{
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
    public function replyToReview(string $reviewId, string $reply): Review{
        $review = $this->documentManager->getRepository(Review::class)->findOneBy(['id' => $reviewId,'status' => 'published']);

        if ($review === null){
            throw new InvalidArgumentException("Cet avis n\'existe pas ou n\'est pas encore publié.");
        }
        $review->setAdminReply($reply);
        $review->setAdminReplyAt(new DateTimeImmutable());
        $this->documentManager->persist($review);
        $this->documentManager->flush();
        return $review;
    }



}
