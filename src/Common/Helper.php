<?php


namespace App\Common;


use App\Entity\User;
use App\Factory\SerializerFactory;
use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use phpDocumentor\Reflection\DocBlock\Tags\Return_;
use phpDocumentor\Reflection\Types\Boolean;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class Helper extends AbstractController
{

    private $taskRepository;
    private $userRepository;
    private $jwtManager;
    private $serializer;
    private $googleClient;
    private $passwordEncoder;

    public function __construct(
        TaskRepository $_taskRepository,
        UserRepository $_userRepository,
        JWTTokenManagerInterface $_jwtManager,
        UserPasswordEncoderInterface $_passwordEncoder
    ) {

        $this->userRepository = $_userRepository;
        $this->taskRepository = $_taskRepository;
        $this->jwtManager = $_jwtManager;
        $this->passwordEncoder = $_passwordEncoder;
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

    public function generateUserFromGooglePayload($payload) : ?User
    {
        $entityManager = $this->getDoctrine()->getManager();

        $user = new User();
        $user->setEmail($payload['email']);
        $user->setUsername($payload['email']);
        $user->setCreatedAt(new \DateTime());
        $user->setUpdatedAt(new \DateTime());
        $user->setRoles(['ROLE_USER']);
        $password = $this->passwordEncoder->encodePassword($user, $this->generateRandomPassword(16));
        $user->setPassword($password);

        $entityManager->persist($user);
        $entityManager->flush();

        return $user;
    }

    public function generateRandomPassword(int $length) : string
    {
        return substr(str_shuffle(strtolower(sha1(rand() . time() . "my salt string"))), 0, $length);
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