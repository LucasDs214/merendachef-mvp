# MerendaChef — MVP

Sistema para captar receitas de funcionários de cozinhas escolares.

## Estrutura

```
merendachef/
├── frontend/     # React + Vite + Tailwind CSS
├── backend/      # .NET 8 Minimal API + EF Core
└── database/     # Script SQL (PostgreSQL)
```

## 1. Banco de dados (PostgreSQL)

```bash
psql -U postgres -f database/schema.sql
```

Isso cria o banco `merendachef`, as tabelas `Receita`, `Ingrediente`,
`IngredienteReceita` e `Escola`, já populando os ingredientes e as 3 escolas.

## 2. Backend (.NET 8)

```bash
cd backend
dotnet restore
```

Ajuste a connection string em `appsettings.json` se necessário
(`Host`, `Username`, `Password`).

Como não há migrations configuradas neste MVP (as tabelas já são criadas pelo
`schema.sql`), rode direto:

```bash
dotnet run
```

A API sobe por padrão em `http://localhost:5000` (Minimal API, sem HTTPS
redirect para simplificar o MVP local).

Endpoints:
- `POST /api/receitas` — cria uma receita com seus ingredientes
- `GET /api/receitas` — lista todas as receitas com ingredientes

## 3. Frontend (React + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

Abre em `http://localhost:5173`. Rotas disponíveis:

- `/` — Landing page institucional (identidade FAETEC)
- `/cadastro` — Fluxo mobile-first de envio de receita (Identificação → Ingredientes → Preparo)
- `/login` — Acesso administrativo
- `/dashboard` — Listagem de receitas com avaliação por nota (protegida; redireciona para `/login` se não autenticado)

**Login administrativo (MVP, hardcoded no frontend):**
- E-mail: `admin@faetec.rj.gov.br`
- Senha: `merenda123`

> A URL da API está fixa em `src/pages/Cadastro.jsx` e `src/pages/Dashboard.jsx` (`API_URL`). Ajuste se o backend
> rodar em outra porta/host.

## Próximos passos (pós-MVP)

- Autenticação real (JWT) no backend em vez da checagem hardcoded no frontend
- Migrations do EF Core em vez de script SQL manual
- Filtros e paginação no dashboard (por escola, por nota)
- Deploy (Railway/Render para API + banco, Vercel/Netlify para frontend)
