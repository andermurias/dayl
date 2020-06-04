<?php

namespace App\Controller;

use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{

    private $taskRepository;
    private $userRepository;

    public function __construct(TaskRepository $_taskRepository, UserRepository $_userRepository)
    {

        $this->userRepository = $_userRepository;
        $this->taskRepository = $_taskRepository;
    }

    /**
     * @Route("/", name="home")
     */
    public function index()
    {

        return $this->render('index/index.html.twig');
    }

    /**
     * @Route("/{reactRouting}", name="app", requirements={"reactRouting"="^(?!.*(api)).*"}, defaults={"reactRouting": null})
     */
    public function app()
    {

        return $this->render('default/index.html.twig');
    }
}