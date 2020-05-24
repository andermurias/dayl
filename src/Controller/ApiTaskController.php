<?php

namespace App\Controller;

use App\Common\Helper;
use App\Entity\Task;
use App\Factory\SerializerFactory;
use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use JMS\Serializer\Serializer;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Log\Logger;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/task", name="blog_")
 */
class ApiTaskController extends AbstractController
{

    private $taskRepository;
    private $userRepository;
    private $helper;
    private $logger;

    private $serializer;

    public function __construct(TaskRepository $_taskRepository, UserRepository $_userRepository, Helper $_helper, LoggerInterface $_logger)
    {

        $this->userRepository = $_userRepository;
        $this->taskRepository = $_taskRepository;
        $this->helper = $_helper;
        $this->logger = $_logger;
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

        if (!is_null($date) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
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

        if ($task->getUser()->getId() === $this->helper->getRealUser()->getId()) {
            $entityManager = $this->getDoctrine()->getManager();

            $data = json_decode($request->getContent(), true);

            $finishedDate = (array_key_exists('date', $data) && $data['date']) ? new \DateTime($data['date']) : null;
            $task->setDate($finishedDate);

            if ($request->get('start')) {
                $task->setStart(new \DateTime($request->request->get('start')));
            }

            if ($request->get('end')) {
                $task->setEnd(new \DateTime($request->request->get('end')));
            }
            $entityManager->persist($task);
            $entityManager->flush();
        }

        $serializedTask = $this->serializer->serialize(['status' => 200], 'json');

        return new JsonResponse($serializedTask, 200, [], true);
    }

    /**
     * @Route(
     *     "/add",
     *     name="tasks_add",
     *     methods={"POST"}
     *     )
     */
    public function taskAdd(Request $request)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $task = new Task();

        $data = json_decode($request->getContent(), true);

        $task->setUser($this->helper->getRealUser());
        $task->setDescription($data['description']);
        if (array_key_exists('start', $data)) {
            $task->setStart(new \DateTime($data['start']));
        }
        if (array_key_exists('end', $data)) {
            $task->setEnd(new \DateTime($data['end']));
        }
        if (array_key_exists('date', $data)) {
            $task->setDate(new \DateTime($data['date']));
        }

        $entityManager->persist($task);
        $entityManager->flush();

        $serializedTask = $this->serializer->serialize(['status' => 200], 'json');

        return new JsonResponse($serializedTask, 200, [], true);
    }

    /**
     * @Route(
     *     "/delete/{id}",
     *     name="tasks_delete",
     *     methods={"GET"}
     *     )
     */
    public function taskDelete($id)
    {
        $task = $this->taskRepository->findOneBy(['id' => $id]);

        if ($task->getUser()->getId() === $this->helper->getRealUser()->getId()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($task);
            $entityManager->flush();
        }

        $serializedTask = $this->serializer->serialize(['status' => 200], 'json');

        return new JsonResponse($serializedTask, 200, [], true);
    }
}