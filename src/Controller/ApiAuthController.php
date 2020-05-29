<?php

namespace App\Controller;

use App\Common\Helper;
use App\Entity\Task;
use App\Factory\SerializerFactory;
use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use JMS\Serializer\Serializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Log\Logger;
use Symfony\Component\Routing\Annotation\Route;
use Swagger\Annotations as SWG;
use Nelmio\ApiDocBundle\Annotation\Security;
use Nelmio\ApiDocBundle\Annotation\Model;

/**
 * @Route("/api/auth", name="auth_")
 */
class ApiAuthController extends AbstractController
{
    private $userRepository;
    private $helper;

    private $serializer;

    public function __construct(UserRepository $_userRepository, Helper $_helper)
    {
        $this->userRepository = $_userRepository;
        $this->helper = $_helper;
        $this->serializer = SerializerFactory::create();
    }

    /**
     * @Route("/google", name="with_google", methods={"POST"})
     *
     * @SWG\Response(
     *     response=200,
     *     description="Validates if the token is valid and prepres the user and token"
     *     )
     * )
     *
     * @SWG\Parameter(
     *     name="token",
     *     in="header",
     *     type="string",
     *     description="Tokern Returned by Google"
     * )
     *
     * @SWG\Tag(name="Login")
     */
    public function authWithGoogle(Request $request)
    {
        $userData = $this->helper->verifyTokenWithGoogle($request->request->get('token'));
        if(!$userData) {
            return 'error';
        }


    }
}