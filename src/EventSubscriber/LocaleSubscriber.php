<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class LocaleSubscriber implements EventSubscriberInterface
{
    private $defaultLocale;

    public function __construct($defaultLocale = 'en')
    {
        $this->defaultLocale = $defaultLocale;
    }

    public function onKernelRequest(RequestEvent $event)
    {
        $request = $event->getRequest();
        $response = $event->getResponse();
//        if (!$request->hasPreviousSession()) {
//            return;
//        }

        $locale = $request->headers->get('accept-language');
        $sessionLocale = $request->getSession()->get('_locale');
        $forcedLocale = $request->get('lang');

        $selectedLocale = $this->defaultLocale;

        // try to see if the locale has been set as a _locale routing parameter or the accept-language header
        if ($forcedLocale) {
            $selectedLocale = $forcedLocale;
        } elseif ($sessionLocale) {
            $selectedLocale = $sessionLocale;
        } elseif ($locale && '*' !== $locale) {
            $selectedLocale = substr($locale, 0, 2);
        }

        $request->getSession()->set('_locale', $selectedLocale);
        $request->setLocale($selectedLocale);
    }

    public function onKernelResponse(ResponseEvent $event)
    {
        $response = $event->getResponse();
        $request = $event->getRequest();

        $response->headers->setCookie(Cookie::create('lang', $request->getSession()->get('_locale'), 0, '/', null, null, false));
    }

    public static function getSubscribedEvents()
    {
        return [
            // must be registered before (i.e. with a higher priority than) the default Locale listener
            KernelEvents::REQUEST => [['onKernelRequest', 20]],
            KernelEvents::RESPONSE => [['onKernelResponse', 20]],
        ];
    }
}
