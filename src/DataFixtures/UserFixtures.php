<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Role\RoleHierarchy;

class UserFixtures extends Fixture
{
    private $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {

        $user = new User();
        $user->setEmail('admin@murias.nl');
        $user->setUsername('admin');
        $user->setCreatedAt(new \DateTime());
        $user->setUpdatedAt(new \DateTime());
        $user->setRoles(['ROLE_USER', 'ROLE_ADMIN']);
        $password = $this->passwordEncoder->encodePassword($user, '123456');
        $user->setPassword($password);
        $manager->persist($user);

        $manager->flush();
    }
}
