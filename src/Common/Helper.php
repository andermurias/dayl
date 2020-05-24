<?php


namespace App\Common;


use App\Entity\User;
use App\Factory\SerializerFactory;
use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class Helper extends AbstractController
{

    private $taskRepository;
    private $userRepository;
    private $serializer;

    public function __construct(TaskRepository $_taskRepository, UserRepository $_userRepository)
    {

        $this->userRepository = $_userRepository;
        $this->taskRepository = $_taskRepository;
        $this->serializer = SerializerFactory::create();
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