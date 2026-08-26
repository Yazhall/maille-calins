<?php

namespace App\Controller\Admin;
use App\Document\Product;
use App\Document\Review;
use App\Dto\ModerateReviewDto;
use DateTimeImmutable;
use App\Service\ReviewService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\LockException;
use Doctrine\ODM\MongoDB\Mapping\MappingException;
use Doctrine\ODM\MongoDB\MongoDBException;
use InvalidArgumentException;
use phpDocumentor\Reflection\DocBlock\Tags\Formatter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Throwable;
#[IsGranted('ROLE_ADMIN')]
class ReviewController extends AbstractController
{

    #[Route('/api/admin/reviews/pending', name: 'admin_review_pending', methods: ['GET'])]
    public function listReviewPending(
        ReviewService $reviewService
    ): JsonResponse{
        $listReview = $reviewService->listPendingReviews();

        $data = array_map(
            fn (Review $review) => $this->formatReviews($review),
            $listReview
        );
        return $this->json($data );

    }
    #[Route('/api/admin/reviews/{id}/status', name: 'admin_review_change_status', methods: ['PATCH'])]
    public function moderateReview(
        string $id,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        Request $request,
        ReviewService $reviewService,
    ): JsonResponse{
        try{
            $updateReview = $serializer->deserialize($request->getContent(), ModerateReviewDto::class, 'json');
        }catch (ExceptionInterface ){
            return $this->json(['errors'=>'le corps de la requete est invalide '],400);
        }
        $errors = $validator->validate($updateReview);
        if (count($errors) > 0){
            return $this->json(['errors'=>(string)$errors],400);
        }
        try{
            $reviewAtModify = $reviewService->moderateReview($id, $updateReview->status);
        }catch (InvalidArgumentException $exception){
            return $this->json(['errors'=>$exception->getMessage()],404);
        }
        return $this->json($this->formatReviews($reviewAtModify));
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
            'createdAt' => $review->getCreatedAt()->format('Y-m-d H:i:s'),
        ];
    }

}
