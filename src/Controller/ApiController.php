<?php

namespace App\Controller;

use App\Factory\SerializerFactory;
use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use JMS\Serializer\Serializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api", name="blog_")
 */
class ApiController extends AbstractController
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

    /**
     * @Route("/tasks/{date}", name="tasks", requirements={"date"="^[0-9]{4}\-[01][0-9]\-[0-3][0-9]$"})
     */
    public function tasks($date)
    {
        $user = $this->userRepository->findOneBy(['id' => 1]);
        $datetime = new \DateTime($date);

        $userTasks = $this->taskRepository->finByUserAndDate($user, $datetime);

        $serializedTask = $this->serializer->serialize($userTasks, 'json');

        return new Response($serializedTask);
    }
}