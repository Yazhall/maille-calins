<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260713073814 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE order_item (id UUID NOT NULL, product_id VARCHAR(24) NOT NULL, product_name_snapshot VARCHAR(255) NOT NULL, product_price_snapshot NUMERIC(10, 2) NOT NULL, quantity INT NOT NULL, parent_order_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_52EA1F091252C1E9 ON order_item (parent_order_id)');
        $this->addSql('ALTER TABLE order_item ADD CONSTRAINT FK_52EA1F091252C1E9 FOREIGN KEY (parent_order_id) REFERENCES "order" (id) NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE order_item DROP CONSTRAINT FK_52EA1F091252C1E9');
        $this->addSql('DROP TABLE order_item');
    }
}
