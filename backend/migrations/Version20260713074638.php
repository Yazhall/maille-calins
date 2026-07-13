<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260713074638 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE payment (id UUID NOT NULL, provider VARCHAR(30) NOT NULL, status VARCHAR(30) NOT NULL, amount NUMERIC(10, 2) NOT NULL, transaction_id VARCHAR(255) DEFAULT NULL, paid_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, parent_order_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_6D28840D1252C1E9 ON payment (parent_order_id)');
        $this->addSql('ALTER TABLE payment ADD CONSTRAINT FK_6D28840D1252C1E9 FOREIGN KEY (parent_order_id) REFERENCES "order" (id) NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE payment DROP CONSTRAINT FK_6D28840D1252C1E9');
        $this->addSql('DROP TABLE payment');
    }
}
