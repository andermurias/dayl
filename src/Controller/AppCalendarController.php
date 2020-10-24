<?php

namespace App\Controller;

use App\Entity\Task;
use App\Factory\GoogleCalendarFactory;
use App\Factory\SerializerFactory;
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
 * @Route("/api/calendar", name="calendar_")
 */
class AppCalendarController extends AbstractController
{
    private $serializer;
    private $userRepository;

    public function __construct(UserRepository $_userRepository)
    {
        $this->userRepository = $_userRepository;
        $this->serializer = SerializerFactory::create();
    }

    /**
     * @Route("/events", name="done", methods={"GET"})
     *
     * @SWG\Response(
     *     response=200,
     *     description="Returns google calendar events of an User and specific day",
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
     * @SWG\Tag(name="Calendar")
     * @Security(name="Bearer")
     */
    public function calendarForDay(Request $request)
    {
        $date = $request->get('date');

        $datetime = new \DateTime($date ?? date('Y-m-d'));

        $calendar = new GoogleCalendarFactory($this->getUser());

        $events = $calendar->getEventsForDate($datetime);

//        dd($events);
        $serializedEvents = $this->serializer->serialize(array_map([$this, 'transformCalendarEvent'], $events), 'json');

        return new JsonResponse($serializedEvents, 200, [], true);
    }

    private function transformCalendarEvent(\Google_Service_Calendar_Event $event): array
    {
        return [
            'name' => $event->getSummary(),
            'start' => (new \DateTime($event->getStart()->getDateTime()))->format('H:i:s'),
            'end' => (new \DateTime($event->getEnd()->getDateTime()))->format('H:i:s'),
        ];
    }
}
