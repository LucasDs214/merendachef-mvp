-- =========================================================
-- MerendaChef - Script de criação do banco de dados
-- PostgreSQL 14+
-- =========================================================

CREATE DATABASE merendachef;

-- Conecte-se ao banco "merendachef" antes de rodar o restante
-- \c merendachef

-- =========================================================
-- Tabela: Escola (mockada aqui para já existir referência,
-- mas o frontend usa um select fixo com 3 opções)
-- =========================================================
CREATE TABLE IF NOT EXISTS "Escola" (
    "Id"    SERIAL PRIMARY KEY,
    "Nome"  VARCHAR(150) NOT NULL
);

INSERT INTO "Escola" ("Nome") VALUES
    ('EM João da Silva'),
    ('EM Maria das Graças'),
    ('EM Professor Paulo Freire')
ON CONFLICT DO NOTHING;

-- =========================================================
-- Tabela: Admin
-- OBS: o usuário admin padrão (admin@faetec.rj.gov.br) é criado
-- automaticamente pelo backend na primeira execução, com senha
-- já hasheada (PBKDF2) — não é inserido aqui via SQL puro.
-- =========================================================
CREATE TABLE IF NOT EXISTS "Admin" (
    "Id"          SERIAL PRIMARY KEY,
    "Nome"        VARCHAR(150) NOT NULL,
    "Email"       VARCHAR(150) NOT NULL UNIQUE,
    "SenhaHash"   VARCHAR(300) NOT NULL,
    "DataCriacao" TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Tabela: Receita
-- =========================================================
CREATE TABLE IF NOT EXISTS "Receita" (
    "Id"             SERIAL PRIMARY KEY,
    "NomeFuncionario" VARCHAR(150)  NOT NULL,
    "WhatsApp"        VARCHAR(20)   NOT NULL,
    "Escola"          VARCHAR(150)  NOT NULL,
    "NomeReceita"     VARCHAR(150)  NOT NULL,
    "ModoPreparo"     TEXT          NOT NULL,
    "Nota"            NUMERIC(3,1)  NULL CHECK ("Nota" >= 0 AND "Nota" <= 10),
    "DataCriacao"     TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- =========================================================
-- Tabela: Ingrediente (lista restrita)
-- =========================================================
CREATE TABLE IF NOT EXISTS "Ingrediente" (
    "Id"    SERIAL PRIMARY KEY,
    "Nome"  VARCHAR(150) NOT NULL UNIQUE
);

INSERT INTO "Ingrediente" ("Nome") VALUES
    ('Abóbora Pescoço'), ('Abobrinha Alongada'), ('Agrião'), ('Aipim'),
    ('Alho'), ('Arroz Parboilizado'), ('Azeite de Oliva'), ('Banana prata'),
    ('Batata doce'), ('Batata inglesa'), ('Cebola'), ('Cenoura'),
    ('Cheiro verde'), ('Carne Bovina, Coxão Mole'), ('Carne Bovina, Patinho'),
    ('Fígado de Bovino'), ('Carne de Frango, Filé de Peito'), ('Chuchu'),
    ('Couve-flor'), ('Extrato de Tomate'), ('Farinha de Mandioca'),
    ('Feijão Carioca'), ('Feijão Preto'), ('Leite de Coco'), ('Óleo de Soja'),
    ('Ovo de Galinha'), ('Peixe - Filé de pescada'), ('Sal'), ('Tomate')
ON CONFLICT ("Nome") DO NOTHING;

-- =========================================================
-- Tabela: IngredienteReceita (N:N com quantidade/medida)
-- =========================================================
CREATE TABLE IF NOT EXISTS "IngredienteReceita" (
    "Id"             SERIAL PRIMARY KEY,
    "ReceitaId"      INTEGER NOT NULL REFERENCES "Receita"("Id") ON DELETE CASCADE,
    "IngredienteNome" VARCHAR(150) NOT NULL, -- salvo por nome para simplificar o MVP
    "Quantidade"     NUMERIC(10,2) NOT NULL,
    "Medida"         VARCHAR(50) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ingredientereceita_receitaid
    ON "IngredienteReceita" ("ReceitaId");

-- =========================================================
-- Migração (caso o banco já tenha sido criado sem a coluna Nota)
-- =========================================================
-- ALTER TABLE "Receita" ADD COLUMN IF NOT EXISTS "Nota" NUMERIC(3,1)
--     CHECK ("Nota" >= 0 AND "Nota" <= 10);
--
-- CREATE TABLE IF NOT EXISTS "Admin" (
--     "Id"          SERIAL PRIMARY KEY,
--     "Nome"        VARCHAR(150) NOT NULL,
--     "Email"       VARCHAR(150) NOT NULL UNIQUE,
--     "SenhaHash"   VARCHAR(300) NOT NULL,
--     "DataCriacao" TIMESTAMP    NOT NULL DEFAULT NOW()
-- );
