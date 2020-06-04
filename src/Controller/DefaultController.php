<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{


    public function __construct()
    {

    }

    /**
     * @Route("/", name="home")
     */
    public function index(Request $request)
    {
        if ($request->cookies->get('logged')) {
            return $this->redirect('/tasks');
        }

        return $this->render('pages/index.html.twig');
    }

    /**
     * @Route("/about", name="about")
     */
    public function about()
    {
        return $this->redirect('/');

    }

    /**
     * @Route("/about/cookies", name="cookies")
     */
    public function cookies()
    {
        return $this->render('pages/cookies.html.twig');
    }

    /**
     * @Route("/about/privacy", name="provacy")
     */
    public function privacy()
    {
        return $this->render('pages/privacy.html.twig');
    }

    /**
     * @Route("/about/terms", name="terms")
     */
    public function terms()
    {
        return $this->render('pages/terms.html.twig');
    }


    /**
     * @Route(
     *     "/{reactRouting}",
     *     name="app",
     *     requirements={"reactRouting"="^(?!.*(api)).*"},
     *     defaults={"reactRouting": null}
     *     )
     */
    public function app()
    {

        return $this->render('default/index.html.twig');
    }
}