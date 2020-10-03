<?php

namespace App\Common;

use App\Entity\User;
use App\Factory\SerializerFactory;
use App\Repository\TaskRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class Helper extends AbstractController
{
    private $taskRepository;
    private $userRepository;
    private $serializer;
    private $googleClient;
    private $passwordEncoder;

    public function __construct(
        TaskRepository $_taskRepository,
        UserRepository $_userRepository,
        UserPasswordEncoderInterface $_passwordEncoder
    ) {
        $this->userRepository = $_userRepository;
        $this->taskRepository = $_taskRepository;
        $this->passwordEncoder = $_passwordEncoder;
        $this->serializer = SerializerFactory::create();
        $this->googleClient = new \Google_Client(['client_id' => '']);
    }

    public function verifyTokenWithGoogle($token): ?array
    {
        $payload = $this->googleClient->verifyIdToken($token);
        if (!$payload) {
            return null;
        }

        return $payload;
    }

    public function generateUserFromGooglePayload(array $payload, string $token): ?User
    {
        $entityManager = $this->getDoctrine()->getManager();

        $user = new User();
        $user->setEmail($payload['email']);
        $user->setUsername($payload['email']);
        $user->setGoogleToken($token);
        $user->setGoogleData($payload);
        $user->setCreatedAt(new \DateTime());
        $user->setUpdatedAt(new \DateTime());
        $user->setRoles(['ROLE_USER']);
        $password = $this->passwordEncoder->encodePassword($user, $this->generateRandomPassword(16));
        $user->setPassword($password);

        $entityManager->persist($user);
        $entityManager->flush();

        return $user;
    }

    public function generateRandomPassword(int $length): string
    {
        return substr(str_shuffle(strtolower(sha1(rand().time().'my salt string'))), 0, $length);
    }

    public function getRealUser(): User
    {
        return $this->userRepository->findOneBy(['id' => $this->getUser()->getId()]);
    }

    public function returnOk()
    {
        $serializedTask = $this->serializer->serialize(['status' => 200], 'json');

        return new JsonResponse($serializedTask, 200, [], true);
    }

    /** @deprecated Deprecated for now, future implementations will be taken in consideration */
    public static function getEncryptionData()
    {
        return [
            'method' => 'AES-256-CBC',
            'key' => hash('sha256', $_ENV['ENCRYPTION_KEY']),
            'iv' => substr(hash('sha256', $_ENV['ENCRYPTION_IV']), 0, 16),
        ];
    }

    /** @deprecated Deprecated for now, future implementations will be taken in consideration */
    public static function encrypt($string)
    {
        ['method' => $method, 'key' => $key, 'iv' => $iv] = static::getEncryptionData();

        return base64_encode(openssl_encrypt($string, $method, $key, 0, $iv));
    }

    /** @deprecated Deprecated for now, future implementations will be taken in consideration */
    public static function decrypt($string)
    {
        ['method' => $method, 'key' => $key, 'iv' => $iv] = static::getEncryptionData();

        return openssl_decrypt(base64_decode($string), $method, $key, 0, $iv);
    }

    public static function isValidDate(string $date): bool
    {
        return !is_null($date) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $date);
    }

    public static function isValidMonth(string $date): bool
    {
        return !is_null($date) && preg_match('/^\d{4}-\d{2}$/', $date);
    }

    public static function hyphenize($string)
    {
        $dict = [
            "I'm" => 'I am',
            'thier' => 'their',
            // Add your own replacements here
        ];

        return strtolower(
            preg_replace(
                ['#[\\s-]+#', '#[^A-Za-z0-9. -]+#'],
                ['-', ''],
                // the full cleanString() can be downloaded from http://www.unexpectedit.com/php/php-clean-string-of-utf8-chars-convert-to-similar-ascii-char
                static::cleanString(
                    str_replace( // preg_replace can be used to support more complicated replacements
                        array_keys($dict),
                        array_values($dict),
                        urldecode($string)
                    )
                )
            )
        );
    }

    public static function cleanString($text)
    {
        $utf8 = [
            '/[áàâãªä]/u' => 'a',
            '/[ÁÀÂÃÄ]/u' => 'A',
            '/[ÍÌÎÏ]/u' => 'I',
            '/[íìîï]/u' => 'i',
            '/[éèêë]/u' => 'e',
            '/[ÉÈÊË]/u' => 'E',
            '/[óòôõºö]/u' => 'o',
            '/[ÓÒÔÕÖ]/u' => 'O',
            '/[úùûü]/u' => 'u',
            '/[ÚÙÛÜ]/u' => 'U',
            '/ç/' => 'c',
            '/Ç/' => 'C',
            '/ñ/' => 'n',
            '/Ñ/' => 'N',
            '/–/' => '-', // UTF-8 hyphen to "normal" hyphen
            '/[’‘‹›‚]/u' => ' ', // Literally a single quote
            '/[“”«»„]/u' => ' ', // Double quote
            '/ /' => ' ', // nonbreaking space (equiv. to 0x160)
        ];

        return preg_replace(array_keys($utf8), array_values($utf8), $text);
    }
}
