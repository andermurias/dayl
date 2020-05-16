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
 * @Route("/api/task", name="blog_")
 */
class ApiTaskController extends AbstractController
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
     *     "/pending",
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
     *     "/done",
     *     name="tasks_for_day"
     *     )
     */
    public function tasksForDay(Request $request)
    {
        $date = $request->get('date');

        if(!is_null($date) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            throw new \JsonException('If sent, date param MUST be YYYY-MM-DD format');
        }

        $datetime = new \DateTime($date ?? date('Y-m-d'));

        $userTasks = $this->taskRepository->finByUserAndDate($this->getUser(), $datetime);

        $serializedTask = $this->serializer->serialize($userTasks, 'json');

        return new JsonResponse($serializedTask, 200, [], true);
    }

    /**
     * @Route(
     *     "/{id}",
     *     name="tasks_update",
     *     requirements={"id"="\d+"},
     *     methods={"POST"}
     *     )
     */
    public function taskUpdate($id, Request $request)
    {
        $task = $this->taskRepository->findOneBy(['id' => $id]);

        if ($task->getUser()->getId() === $this->getUser()->getId()) {
            $entityManager = $this->getDoctrine()->getManager();

            $task->setDate($task->getDate() ? null : new \DateTime());
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
}