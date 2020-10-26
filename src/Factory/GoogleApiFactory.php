<?php

namespace App\Factory;

use App\Common\Helper;
use App\Entity\User;

class GoogleApiFactory
{
    private $calendar;

    public function __construct(User $user, Helper $helper)
    {
        $client = new \Google_Client(['client_id' => $_SERVER['GOOGLE_API_KEY'], 'client_secret' => $_SERVER['GOOGLE_API_SECRET']]);
        $client->setAccessToken($user->getGoogleToken());
        if ($client->isAccessTokenExpired()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            $helper->updateUserDataFromPayload($user, null, $client->getAccessToken());
        }

        $this->calendar = new \Google_Service_Calendar($client);
    }

    public function getCalendar(): \Google_Service_Calendar
    {
        return $this->calendar;
    }

    public function getEventsForDate(\DateTime $date): array
    {
        $calendarId = 'primary';
        $optParams = [
            'orderBy' => 'startTime',
            'singleEvents' => true,
            'showDeleted' => false,
            'timeMin' => $date->format('Y-m-d').'T00:00:00.000Z',
            'timeMax' => $date->format('Y-m-d').'T23:59:59.999Z',
        ];
        $results = $this->calendar->events->listEvents($calendarId, $optParams);

        return $results->getItems();
    }
}
