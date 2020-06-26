<?php

namespace App\Controller;

use App\Common\Helper;
use App\Entity\Task;
use App\Factory\SerializerFactory;
use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use Swagger\Annotations as SWG;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/task", name="task_")
 */
class ApiTaskController extends AbstractController
{
    private $taskRepository;
    private $userRepository;
    private $helper;

    private $serializer;

    public function __construct(TaskRepository $_taskRepository, UserRepository $_userRepository, Helper $_helper)
    {
        $this->userRepository = $_userRepository;
        $this->taskRepository = $_taskRepository;
        $this->helper = $_helper;
        $this->serializer = SerializerFactory::create();
    }

    /**
     * @Route("/pending", name="pending", methods={"GET"})
     *
     * @SWG\Response(
     *     response=200,
     *     description="Returns all pending tasks of an User",
     *     @SWG\Schema(
     *         type="array",
     *         @SWG\Items(ref=@Model(type=Task::class))
     *     )
     * )
     * @SWG\Tag(name="Tasks")
     * @Security(name="Bearer")
     */
    public function tasksPending()
    {
        $userTasks = $this->taskRepository->finByUserAndDate($this->getUser(), null);

        $serializedTask = $this->serializer->serialize($userTasks, 'json');

        return new JsonResponse($serializedTask, 200, [], true);
    }

    /**
     * @Route("/done", name="done", methods={"GET"})
     *
     * @SWG\Response(
     *     response=200,
     *     description="Returns all done tasks of an User and specific day",
     *     @SWG\Schema(
     *         type="array",
     *         @SWG\Items(ref=@Model(type=Task::class))
     *     )
     * )
     * @SWG\Parameter(
     *     name="date",
     *     in="query",
     *     type="string",
     *     description="Day to request (YYYY-MM-DD)"
     * )
     *
     * @SWG\Tag(name="Tasks")
     * @Security(name="Bearer")
     */
    public function tasksForDay(Request $request)
    {
        $date = $request->get('date');

        if (Helper::isValidDate($date)) {
            throw new \JsonException('If sent, date param MUST be YYYY-MM-DD format');
        }

        $datetime = new \DateTime($date ?? date('Y-m-d'));

        $userTasks = $this->taskRepository->finByUserAndDate($this->getUser(), $datetime);

        $serializedTask = $this->serializer->serialize($userTasks, 'json');

        return new JsonResponse($serializedTask, 200, [], true);
    }

    /**
     * @Route("/{id}", name="update", requirements={"id"="\d+"}, methods={"PATCH"})
     *
     * @SWG\Response(
     *     response=200,
     *     description="Updated a taks by setting the date when has been finished, and the start/end time"
     * )
     *
     * @SWG\Parameter(
     *     name="id",
     *     in="path",
     *     type="string",
     *     description="Id of the task"
     * )
     *
     * @SWG\Parameter(
     *     name="date",
     *     in="header",
     *     type="string",
     *     description="Date to set as done (YYYY-MM-DD)"
     * )
     *
     * @SWG\Parameter(
     *     name="start",
     *     in="header",
     *     type="string",
     *     description="Start time (HH:MM)"
     * )
     *
     * @SWG\Parameter(
     *     name="end",
     *     in="header",
     *     type="string",
     *     description="End time (HH:MM)"
     * )
     *
     * @SWG\Tag(name="Tasks")
     * @Security(name="Bearer")
     */
    public function taskUpdate($id, Request $request)
    {
        $task = $this->taskRepository->findOneBy(['id' => $id]);

        if ($task->getUser()->getId() === $this->helper->getRealUser()->getId()) {
            $entityManager = $this->getDoctrine()->getManager();

            $data = json_decode($request->getContent(), true);

            if (array_key_exists('description', $data)) {
                $task->setDescription($data['description']);
            }

            if (array_key_exists('start', $data) && array_key_exists('end', $data) && $data['start'] && $data['end']) {
                $task->setStart(new \DateTime($data['start']));

                $task->setEnd(new \DateTime($data['end']));
            }

            if (array_key_exists('date', $data)) {
                $task->setDate(null === $data['date'] ? null : new \DateTime($data['date']));
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
     *     name="add",
     *     methods={"POST"}
     *     )
     *
     * @SWG\Response(
     *     response=200,
     *     description="Add a new task"
     * )
     *
     * @SWG\Parameter(
     *     name="description",
     *     in="header",
     *     type="string",
     *     description="Text of the task",
     *     required=true
     * )
     *
     * @SWG\Parameter(
     *     name="date",
     *     in="header",
     *     type="string",
     *     description="Date to set as done (YYYY-MM-DD)"
     * )
     *
     * @SWG\Parameter(
     *     name="start",
     *     in="header",
     *     type="string",
     *     description="Start time (HH:MM)"
     * )
     *
     * @SWG\Parameter(
     *     name="end",
     *     in="header",
     *     type="string",
     *     description="End time (HH:MM)"
     * )
     *
     * @SWG\Tag(name="Tasks")
     * @Security(name="Bearer")
     */
    public function taskAdd(Request $request)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $task = new Task();

        $data = json_decode($request->getContent(), true);

        $task->setUser($this->helper->getRealUser());

        if (array_key_exists('description', $data)) {
            $task->setDescription($data['description']);
        }

        if (array_key_exists('start', $data) && array_key_exists('end', $data) && $data['start'] && $data['end']) {
            $task->setStart(new \DateTime($data['start']));

            $task->setEnd(new \DateTime($data['end']));
        }
        if (array_key_exists('date', $data) && $data['date']) {
            $task->setDate(new \DateTime($data['date']));
        }

        $entityManager->persist($task);
        $entityManager->flush();

        $serializedTask = $this->serializer->serialize(['status' => 200], 'json');

        return new JsonResponse($serializedTask, 200, [], true);
    }

    /**
     * @Route("/delete/{id}", name="delete", methods={"DELETE"})
     *
     * @SWG\Response(
     *     response=200,
     *     description="Delete de selected task"
     * )
     *
     * @SWG\Parameter(
     *     name="id",
     *     in="path",
     *     type="string",
     *     description="Id of the task"
     * )
     *
     * @SWG\Tag(name="Tasks")
     * @Security(name="Bearer")
     */
    public function taskDelete($id)
    {
        $task = $this->taskRepository->findOneBy(['id' => $id]);

        if ($task->getUser()->getId() === $this->helper->getRealUser()->getId()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($task);
            $entityManager->flush();
        }

        return $this->helper->returnOk();
    }

    /**
     * @Route("/export", name="export", methods={"GET"})
     *
     * @SWG\Parameter(
     *     name="date",
     *     in="query",
     *     type="string",
     *     description="Day to request (YYYY-MM-DD)"
     * )
     *
     * @SWG\Tag(name="Tasks")
     * @Security(name="Bearer")
     */
    public function exportTasksForDay(Request $request)
    {
        $date = $request->get('date');

        if (Helper::isValidDate($date)) {
            throw new \JsonException('The date param MUST be YYYY-MM-DD format');
        }

        $datetime = new \DateTime($date ?? date('Y-m-d'));

        $userTasks = $this->taskRepository->finByUserAndDate($this->getUser(), $datetime);

        $f = fopen('php://output', 'w');

        fputcsv($f, [
            'description',
            'start',
            'end',
            'date',
        ]);

        foreach ($userTasks as $task) {
            // generate csv lines from the inner arrays
            fputcsv($f, [
                $task->getDescription(),
                $task->getStart() ? $task->getStart()->format('H:i') : '08:00',
                $task->getEnd() ? $task->getEnd()->format('H:i') : '08:00',
                $task->getDate()->format('Y-m-d'),
            ]);
        }

        fclose($f);

        $response = new Response();
        $response->headers->set('Content-Type', 'application/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="'.$datetime->format('YYYYMMDD').'.csv";');

        return $response;
    }
}
