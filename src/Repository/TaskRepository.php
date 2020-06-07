<?php

namespace App\Repository;

use App\Entity\Task;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @method Task|null find($id, $lockMode = null, $lockVersion = null)
 * @method Task|null findOneBy(array $criteria, array $orderBy = null)
 * @method Task[]    findAll()
 * @method Task[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Task::class);
    }

    /**
     * @return Task[] Returns an array of Task objects
     */
    public function finByUserAndDate(UserInterface $user, ?\DateTimeInterface $dateTime)
    {
        $queryBuilder = $this->createQueryBuilder('t')
            ->andWhere('t.user = :user')
            ->setParameter('user', $user->getId());
        if (is_null($dateTime)) {
            $queryBuilder
                ->andWhere('date(t.date) IS NULL');
        } else {
            $queryBuilder
                ->andWhere('date(t.date) = :date')
                ->setParameter('date', $dateTime->format('Y-m-d'));
        }
        $queryBuilder
            ->addOrderBy('t.start', 'ASC')
            ->addOrderBy('t.id', 'ASC');

        return $queryBuilder->getQuery()->getResult();
    }
}
