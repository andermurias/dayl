<?php


namespace App\Factory;


use JMS\Serializer\SerializerBuilder;

class SerializerFactory
{

    public static function create()
    {
        return SerializerBuilder::create()->build();
    }
}