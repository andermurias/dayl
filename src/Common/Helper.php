<?php


namespace App\Common;


use App\Entity\User;
use App\Factory\SerializerFactory;
use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use phpDocumentor\Reflection\DocBlock\Tags\Return_;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;

class Helper extends AbstractController
{

    private $taskRepository;
    private $userRepository;
    private $jwtManager;
    private $serializer;
    private $googleClient;

    public function __construct(TaskRepository $_taskRepository, UserRepository $_userRepository, JWTTokenManagerInterface $_jwtManager)
    {

        $this->userRepository = $_userRepository;
        $this->taskRepository = $_taskRepository;
        $this->jwtManager = $_jwtManager;
        $this->serializer = SerializerFactory::create();
        $this->googleClient = new \Google_Client(['client_id' => '']);

    }

    public function verifyTokenWithGoogle($token) : ?array
    {
        $payload = $this->googleClient->verifyIdToken($token);
        if (!$payload) {
            return null;
        }

        return $payload;
    }

    public function generateTokenForUser(UserInterface $user) : string
    {
        return $this->jwtManager->create($user);
    }

    public function getRealUser() : User
    {
        return $this->userRepository->findOneBy(['id' => $this->getUser()->getId()]);
    }

    public function returnOk()
    {
        $serializedTask = $this->serializer->serialize(['status' => 200], 'json');

        return new JsonResponse($serializedTask, 200, [], true);
    }
}