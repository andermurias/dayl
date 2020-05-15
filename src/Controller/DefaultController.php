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
     * @Route("/{reactRouting}", name="home", defaults={"reactRouting": null})
     */
    public function index()
    {

        return $this->render('default/index.html.twig');
    }
}