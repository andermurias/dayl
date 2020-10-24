<?php

namespace App\Controller;

use App\Common\Helper;
use App\Factory\SerializerFactory;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication\AuthenticationSuccessHandler;
use Swagger\Annotations as SWG;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/auth", name="auth_")
 */
class ApiAuthController extends AbstractController
{
    private $userRepository;
    private $helper;
    private $authenticationSuccessHandler;

    private $serializer;

    public function __construct(
        UserRepository $_userRepository,
        Helper $_helper,
        AuthenticationSuccessHandler $_authenticationSuccessHandler
    ) {
        $this->userRepository = $_userRepository;
        $this->helper = $_helper;
        $this->authenticationSuccessHandler = $_authenticationSuccessHandler;
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
        $data = json_decode($request->getContent(), true);

        $userData = $this->helper->verifyTokenWithGoogle($data['token']['id_token']);
        if (!$userData) {
            return 'error';
        }

        $user = $this->userRepository->findOneBy(['email' => $userData['email']]);

        if (!$user) {
            $user = $this->helper->generateUserFromGooglePayload($userData, $data['token']);
        } else {
            $user = $this->helper->updateUserDataFromPayload($user, $userData, $data['token']);
        }

        if ($user) {
            return $this->authenticationSuccessHandler->handleAuthenticationSuccess($user);
        }

        return new JsonResponse([], 401);
    }
}
