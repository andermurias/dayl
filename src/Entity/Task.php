<?php

namespace App\Entity;

use App\Common\Helper;
use App\Repository\TaskRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Exclude;
use JMS\Serializer\Annotation\Type;
use JMS\Serializer\Annotation\VirtualProperty;

/**
 * @ORM\Entity(repositoryClass=TaskRepository::class)
 */
class Task
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Exclude
     */
    private $description;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $date;

    /**
     * @Type("DateTime<'H:i'>")
     * @ORM\Column(type="time", nullable=true)
     */
    private $start;

    /**
     * @Type("DateTime<'H:i'>")
     * @ORM\Column(type="time", nullable=true)
     */
    private $end;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="tasks")
     * @Exclude
     */
    private $user;

    public function getId() : ?int
    {
        return $this->id;
    }

    /**
     * @VirtualProperty("description")
     */
    public function getDescription(bool $raw = false) : ?string
    {
        $raw = $_ENV['ENCRYPT'] === 'true' ? $raw : true;

        return $raw ? $this->description : Helper::decrypt($this->description);
    }

    public function setDescription(string $description, bool $raw = false) : self
    {
        $raw = $_ENV['ENCRYPT'] === 'true' ? $raw : true;
        $this->description = $raw ? $description : Helper::encrypt($description);

        return $this;
    }

    public function getDate() : ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(?\DateTimeInterface $date) : self
    {
        $this->date = $date;

        return $this;
    }

    public function getStart() : ?\DateTimeInterface
    {
        return $this->start;
    }

    public function setStart(?\DateTimeInterface $start) : self
    {
        $this->start = $start;

        return $this;
    }

    public function getEnd() : ?\DateTimeInterface
    {
        return $this->end;
    }

    public function setEnd(?\DateTimeInterface $end) : self
    {
        $this->end = $end;

        return $this;
    }

    public function getUser() : ?User
    {
        return $this->user;
    }

    public function setUser(?User $user) : self
    {
        $this->user = $user;

        return $this;
    }
}
