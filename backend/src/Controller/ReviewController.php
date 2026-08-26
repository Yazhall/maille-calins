<?php

namespace App\Controller;
use App\Document\Review;
use App\Dto\CreateReviewDto;
use App\Entity\User;
use App\Service\ReviewService;
use InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Throwable;
class ReviewController extends AbstractController
{
    #[Route('/api/products/{productId}/reviews', name: 'api_product_reviews_list', methods: ['GET'])]
    public function list(ReviewService $reviewService,string $productId): JsonResponse
    {
        $reviews = $reviewService->listReviewsByProduct($productId);
        $data = array_map(
            fn (Review $review) => $this->formatReviews($review),
            $reviews
        );
        return $this->json($data);

    }
    #[Route('/api/products/{productId}/reviews', name: 'api_create_review', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function createReview (
        Request $request,
        SerializerInterface$serializer,
        ReviewService $reviewService,
        ValidatorInterface $validator,
        string $productId,
    ): JsonResponse{
        /** @var User $user */
        $user = $this->getUser();
        try{
            $dto = $serializer->deserialize($request->getContent(), CreateReviewDto::class, 'json');
        }catch(ExceptionInterface $errors){
            return $this->json([ 'error'=>$errors->getMessage()], 400);
        }
        $errors = $validator->validate($dto);
        if (count($errors) > 0){
            return $this->json(['error'=> (string)$errors], 400);
        }
        try{
            $review = $reviewService->createReview( $user, $productId, $dto);
        }catch( InvalidArgumentException $errors){
            return $this->json(['error'=>$errors->getMessage()], 400);
        }
        $data =$this->formatReviews($review);
        return $this->json($data,201 );


    }

    private function formatReviews(Review $review): array{
        return [
            'id' => $review->getId(),
            'productId' => $review->getProductId(),
            'userId' => $review->getUserId(),
            'userNameSnapshot' => $review->getUserNameSnapshot(),
            'comment' => $review->getComment(),
            'rating' => $review->getRating(),
            'status' => $review->getStatus(),
            'adminReply' => $review->getAdminReply(),
            'adminReplyAt' => $review->getAdminReplyAt()?->format('Y-m-d H:i:s'),
            'createdAt' => $review->getCreatedAt()->format('Y-m-d H:i:s'),
        ];
    }



}
