<?php

namespace App\Controller\Admin;
use App\Document\Product;
use App\Dto\CreateProductDto;
use App\Dto\UpdateProductDto;
use DateTimeImmutable;
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
use Throwable;
#[IsGranted('ROLE_ADMIN')]
class ProductController extends AbstractController
{
    /**
     * @throws MongoDBException
     * @throws Throwable
     */
    #[Route('/api/admin/products', name: 'api_products_create', methods: ['POST'])]
    public function creatProduct(
        Request $request,
        DocumentManager $documentManager ,
        SerializerInterface $serializer,
        ValidatorInterface $validator):JsonResponse{

        try{
            $createProductDto = $serializer->deserialize($request->getContent(), CreateProductDto::class, 'json');
        }catch(ExceptionInterface ){
            return $this->json(['errors'=>'le corps de la requete est invalide '],400);
        }
        $errors = $validator->validate($createProductDto);
        if(count($errors) > 0){
            return $this->json(['errors'=>(string)$errors],400);
        }
        $product = new Product();
        $product->setName($createProductDto->name);
        $product->setSlug($createProductDto->slug);
        $product->setDescription($createProductDto->description);
        $product->setPrice($createProductDto->price);
        $product->setStock($createProductDto->stock);
        $product->setStatus($createProductDto->status);
        $product->setCategoryIds($createProductDto->categoryIds);
        $product->setCreatedAt(new DateTimeImmutable());
        $product->setUpdatedAt(new DateTimeImmutable());
        $documentManager->persist($product);
        $documentManager->flush();

        return $this->json([
            'id'=>$product->getId(),
            'name'=>$product->getName(),
            'slug'=>$product->getSlug(),
            'description'=>$product->getDescription(),
            'price'=>$product->getPrice(),
            'stock'=>$product->getStock(),
            'status'=>$product->getStatus(),
            'categoryIds'=>$product->getCategoryIds(),
            'createdAt'=>$product->getCreatedAt()->format('Y-m-d H:i:s'),
            'updatedAt'=>$product->getUpdatedAt()->format('Y-m-d H:i:s'),

        ],201);
    }

    /**
     * @throws MappingException
     * @throws LockException
     */
    #[Route('/api/admin/products/{id}', name: 'api_products_patch', methods: ['PATCH'])]
    public function modifyProduct(
        string $id,
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        DocumentManager $documentManager,
    ):JsonResponse{
        $productAtModify = $documentManager->getRepository(Product::class)->find($id);

        if ($productAtModify == null){
            return $this->json(['errors'=>'ce Produits n\'exite pas '],404);
        }
        try{
            $updateProductDto = $serializer->deserialize($request->getContent(), UpdateProductDto::class, 'json');
        }catch(ExceptionInterface ){
            return $this->json(['errors'=>'le corps de la requete est invalide '],400);
        }
        $errors = $validator->validate($updateProductDto);
        if(count($errors) > 0){
            return $this->json(['errors'=>(string)$errors],400);
        }
        if ($updateProductDto->name !== null){
            $productAtModify->setName($updateProductDto->name);
        }
        if ($updateProductDto->slug !== null){
            $productAtModify->setSlug($updateProductDto->slug);
        }
        if ($updateProductDto->description !== null){
            $productAtModify->setDescription($updateProductDto->description);
        }
        if ($updateProductDto->price !== null){
            $productAtModify->setPrice($updateProductDto->price);
        }
        if ($updateProductDto->stock !== null){
            $productAtModify->setStock($updateProductDto->stock);
        }
        if ($updateProductDto->status !== null){
            $productAtModify->setStatus($updateProductDto->status);
        }
        if ($updateProductDto->categoryIds !== null){
            $productAtModify->setCategoryIds($updateProductDto->categoryIds);
        }
        $productAtModify->setUpdatedAt(new DateTimeImmutable());
        $documentManager->persist($productAtModify);
        $documentManager->flush();
        return $this->json([
            'id'=>$productAtModify->getId(),
            'name'=>$productAtModify->getName(),
            'slug'=>$productAtModify->getSlug(),
            'description'=>$productAtModify->getDescription(),
            'price'=>$productAtModify->getPrice(),
            'stock'=>$productAtModify->getStock(),
            'status'=>$productAtModify->getStatus(),
            'categoryIds'=>$productAtModify->getCategoryIds(),
            'updatedAt'=>$productAtModify->getUpdatedAt()->format('Y-m-d H:i:s'),

        ]);
    }

    /**
     * @throws Throwable
     * @throws MappingException
     * @throws MongoDBException
     * @throws LockException
     */
    #[Route('/api/admin/products/{id}', name: 'api_products_delete', methods: ['DELETE'])]
    public function deleteProduct(
        DocumentManager $documentManager ,
        string $id,
    ):Response{
        $productAtDelete = $documentManager->getRepository(Product::class)->find($id);
        if ($productAtDelete==null) {
            return $this->json(['errors'=>'Ce Produit n\'existe pas '],404);
        }
        $documentManager->remove($productAtDelete);
        $documentManager->flush();
        return new Response(null, 204);
    }


}
