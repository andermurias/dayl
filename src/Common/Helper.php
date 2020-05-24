<?php


namespace App\Common;


use App\Entity\User;
use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class Helper extends AbstractController
{

    private $taskRepository;
    private $userRepository;

    public function __construct(TaskRepository $_taskRepository, UserRepository $_userRepository)
    {

        $this->userRepository = $_userRepository;
        $this->taskRepository = $_taskRepository;
    }

    public function getRealUser() : User
    {
        return $this->userRepository->findOneBy(['id' => $this->getUser()->getId()]);
    }
}