<?php

namespace App\Command;

use App\Common\Helper;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class DaylEncryptionCommand extends Command
{
    protected static $defaultName = 'dayl:encryption';

    private $taskRepository;
    private $em;

    public function __construct(EntityManagerInterface $_em, TaskRepository $_taskRepository)
    {
        $this->em = $_em;
        $this->taskRepository = $_taskRepository;

        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription('Updates the encryption of the database')
            ->addArgument('type', InputArgument::OPTIONAL, 'Type: encrypt/decrypt');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $method = $input->getArgument('type');

        if ('decrypt' === $method || 'encrypt' === $method) {
            $tasks = $this->taskRepository->findAll();
            foreach ($tasks as $task) {
                switch ($method) {
                    case 'encrypt':
                        $task->setDescription(Helper::encrypt($task->getDescription(true)), true);
                        break;
                    case 'decrypt':
                        $task->setDescription(Helper::decrypt($task->getDescription(true)), true);
                        break;
                }
                $this->em->persist($task);
                $this->em->flush();
            }
        }

        $io->success('Your database encryption has been updated');

        return 0;
    }
}
