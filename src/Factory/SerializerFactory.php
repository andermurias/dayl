<?php


namespace App\Factory;


use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerBuilder;

class SerializerFactory
{

    public static function create()
    {
        return SerializerBuilder::create()
            ->setSerializationContextFactory(function () {
                return SerializationContext::create()
                    ->setSerializeNull(true);
            })->build();
    }
}