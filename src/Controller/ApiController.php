<?php

namespace App\Controller;

use App\Factory\SerializerFactory;
use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use JMS\Serializer\Serializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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
     * @Route(
     *     "/tasks/pending",
     *     name="tasks_pending"
     *     )
     */
    public function tasksPending()
    {
        $userTasks = $this->taskRepository->finByUserAndDate($this->getUser(), null);

        $serializedTask = $this->serializer->serialize($userTasks, 'json');

        return new JsonResponse($serializedTask, 200, [], true);
    }

    /**
     * @Route(
     *     "/tasks/toggle/{id}",
     *     name="tasks_toggle",
     *     requirements={"id"="\d+"}
     *     )
     */
    public function tasksToggle($id, Request $request)
    {
        $task = $this->taskRepository->findOneBy(['id' => $id]);

        if ($task->getUser()->getId() === $this->getUser()->getId()) {
            $entityManager = $this->getDoctrine()->getManager();

            $task->setDate($task->getDate() ?  null : new \DateTime());
            if ($request->get('start')) {
                $task->setStart(new \DateTime($request->get('start')));
            }

            if ($request->get('end')) {
                $task->setEnd(new \DateTime($request->get('end')));
            }
            $entityManager->persist($task);
            $entityManager->flush();
        }

        $serializedTask = $this->serializer->serialize(['status' => 200], 'json');

        return new JsonResponse($serializedTask, 200, [], true);
    }

    /**
     * @Route(
     *     "/tasks/{year}/{month}/{day}",
     *     name="tasks_for_day",
     *     requirements={"year"="\d{4}", "month"="\d{2}", "day"="\d{2}"}
     *     )
     */
    public function tasksForDay($year, $month, $day)
    {
        $datetime = new \DateTime("$year-$month-$day");

        $userTasks = $this->taskRepository->finByUserAndDate($this->getUser(), $datetime);

        $serializedTask = $this->serializer->serialize($userTasks, 'json');

        return new JsonResponse($serializedTask, 200, [], true);
    }
}