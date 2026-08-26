<?php

namespace App\Controller\Admin;
use App\Document\Category;
use App\Dto\CreateCategoryDto;
use App\Dto\UpdateCategoryDto;
use Doctrine\ODM\MongoDB\DocumentManager;
use Doctrine\ODM\MongoDB\LockException;
use Doctrine\ODM\MongoDB\Mapping\MappingException;
use Doctrine\ODM\MongoDB\MongoDBException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Throwable;

#[IsGranted('ROLE_ADMIN')]
class CategoryController extends AbstractController
{
    #[Route('/api/admin/categories', name: 'api_category_create', methods: ['POST'])]
    public function creatCategory(
        Request $request,
        DocumentManager $documentManager ,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ): JsonResponse {

        try{
            $createCategoryDto = $serializer->deserialize($request->getContent(), CreateCategoryDto::class, 'json');
        }catch (ExceptionInterface ){
            return $this->json(['errors'=> 'corps de la requête invalide '],400);
        }
        $errors = $validator->validate($createCategoryDto);
        if (count($errors) > 0) {
            return $this->json(['errors' =>(string) $errors], 400);
        }
        $category = new Category();
        $category->setName($createCategoryDto->name);
        $category->setDescription($createCategoryDto->description);
        $category->setOrder($createCategoryDto->order);
        $category->setSlug($createCategoryDto->slug);
        $category->setImage($createCategoryDto->image);
        $documentManager->persist($category);
        $documentManager->flush();

        return $this->json([
            'id' => $category->getId(),
            'name'=> $category->getName(),
            'description'=> $category->getDescription(),
            'order'=> $category->getOrder(),
            'slug'=> $category->getSlug(),
            'image'=> $category->getImage(),
        ],201);
    }

    /**
     * @throws MappingException
     * @throws LockException
     */
    #[Route('/api/admin/categories/{id}', name: 'api_category_patch', methods: ['PATCH'])]
    public function modifiCategory(
        DocumentManager $documentManager,
        string $id,
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ): JsonResponse
    {
        $categoryAtModify = $documentManager->getRepository(Category::class)->find($id);

        if ($categoryAtModify==null) {
            return $this->json(['errors'=>'Cette Category n\'existe pas '],404);
        }
        try{
            $updateCategoryDto = $serializer->deserialize($request->getContent(), UpdateCategoryDto::class, 'json');
        }catch (ExceptionInterface ){
            return $this->json(['error' => 'Corps de requête invalide'], 400);
        }

        $errors = $validator->validate($updateCategoryDto);
        if (count($errors) > 0) {
            return $this->json(['errors' =>(string) $errors], 400);
        }
        if ($updateCategoryDto->name !== null) {
            $categoryAtModify->setName($updateCategoryDto->name);
        }
        if ($updateCategoryDto->description !== null) {
            $categoryAtModify->setDescription($updateCategoryDto->description);
        }
        if ($updateCategoryDto->order !== null) {
            $categoryAtModify->setOrder($updateCategoryDto->order);
        }
        if ($updateCategoryDto->image !== null) {
            $categoryAtModify->setImage($updateCategoryDto->image);
        }
        if ($updateCategoryDto->slug !== null) {
            $categoryAtModify->setSlug($updateCategoryDto->slug);
        }
        $documentManager->persist($categoryAtModify);
        $documentManager->flush();

        return $this->json([
            'id' => $categoryAtModify->getId(),
            'name'=> $categoryAtModify->getName(),
            'description'=> $categoryAtModify->getDescription(),
            'order'=> $categoryAtModify->getOrder(),
            'slug'=> $categoryAtModify->getSlug(),
            'image'=> $categoryAtModify->getImage(),
        ],200);
    }

    /**
     * @throws Throwable
     * @throws MappingException
     * @throws MongoDBException
     * @throws LockException
     */
    #[Route('/api/admin/categories/{id}', name: 'api_category_delete', methods: ['DELETE'])]
    public function deleteCategory(
        DocumentManager $documentManager ,
        string $id,
    ):Response{
        $categoryAtDelete = $documentManager->getRepository(Category::class)->find($id);
        if ($categoryAtDelete==null) {
            return $this->json(['errors'=>'Cette Category n\'existe pas '],404);
        }
        $documentManager->remove($categoryAtDelete);
        $documentManager->flush();
        return new Response(null, 204);
    }

    /**
     * @throws MappingException
     * @throws Throwable
     * @throws MongoDBException
     * @throws LockException
     */
    #[Route('/api/admin/categories/{id}/image', name: 'api_category_post_image', methods: ['POST'])]
    public function uploadImageCategory(
        string $id,
        Request $request,
        DocumentManager $documentManager,
        #[Autowire('%kernel.project_dir%')] string $projectDir,
    ): JsonResponse {
        $category = $documentManager->getRepository(Category::class)->find($id);

        if ($category == null) {
            return $this->json(['errors' => 'Cette Category n\'existe pas '], 404);
        }
        $image = $request->files->get('image');

        if ($image == null) {
            return $this->json(['errors' => 'le corps de la requete est invalide '], 400);
        }
        $newFilename = $id.'-'.time().'.'.$image->guessExtension();
        $destinationPath = "{$projectDir}/public/uploads/categories";
        $image->move($destinationPath, $newFilename);
        $category->setImage('/uploads/categories/' . $newFilename);
        $documentManager->persist($category);
        $documentManager->flush();

        return $this->json([
            'id' => $category->getId(),
            'name' => $category->getName(),
            'description' => $category->getDescription(),
            'order' => $category->getOrder(),
            'slug' => $category->getSlug(),
            'image' => $category->getImage(),
        ], 200);
    }
}
