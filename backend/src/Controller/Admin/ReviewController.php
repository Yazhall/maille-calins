<?php

namespace App\Controller\Admin;
use App\Document\Review;
use App\Dto\ModerateReviewDto;
use App\Dto\ReplyToReviewDto;
use DateTimeImmutable;
use App\Service\ReviewService;
use InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

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
    #[Route('/api/admin/reviews/published', name: 'admin_reviews_published', methods: ['GET'])]
    public function listReviewPublished(
        ReviewService $reviewService
    ): JsonResponse{
        $listReview = $reviewService->listPublishedReviews();

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
    #[Route('/api/admin/reviews/{id}/reply', name: 'admin_review_reply', methods: ['PATCH'])]
    public function reply(
        string $id,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        Request $request,
        ReviewService $reviewService,
    ): JsonResponse {
        try {
            $replyReviw = $serializer->deserialize($request->getContent(), ReplyToReviewDto::class, 'json');
        }catch (ExceptionInterface ){
            return $this->json(['errors'=>'le corps de la requete est invalide '],400);
        }
        $errors = $validator->validate($replyReviw);
        if (count($errors) > 0){
            return $this->json(['errors'=>(string)$errors],400);
        }
        try {
            $reviewAtReply = $reviewService->replyToReview($id, $replyReviw->adminReply);
        }catch (InvalidArgumentException $exception){
            return $this->json(['errors'=>$exception->getMessage()],404);
        }
        return $this->json($this->formatReviews($reviewAtReply));
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
            'adminReply' =>$review->getAdminReply(),
            'adminReplyAt' => $review->getAdminReplyAt()?->format('Y-m-d H:i:s'),
            'createdAt' => $review->getCreatedAt()->format('Y-m-d H:i:s'),
        ];
    }



}
