using Microsoft.EntityFrameworkCore;
using MerendaChef.Data;
using MerendaChef.DTOs;
using MerendaChef.Models;
using MerendaChef.Utils;

var builder = WebApplication.CreateBuilder(args);

// =========================================================
// Conexão com PostgreSQL
// Ajuste a connection string em appsettings.json
// =========================================================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// =========================================================
// CORS - libera o frontend (Vite roda por padrão na 5173)
// =========================================================
const string CorsPolicy = "MerendaChefFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseCors(CorsPolicy);

// =========================================================
// Seed: garante que existe ao menos um admin (login padrão do MVP)
// =========================================================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!await db.Admins.AnyAsync())
    {
        db.Admins.Add(new Admin
        {
            Nome = "Administrador MerendaChef",
            Email = "admin@faetec.rj.gov.br",
            SenhaHash = PasswordHasher.Hash("merenda123"),
        });
        await db.SaveChangesAsync();
    }
}

// =========================================================
// POST /api/receitas - recebe o formulário completo
// =========================================================
app.MapPost("/api/receitas", async (ReceitaCreateDto dto, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dto.NomeFuncionario) ||
        string.IsNullOrWhiteSpace(dto.WhatsApp) ||
        string.IsNullOrWhiteSpace(dto.Escola) ||
        string.IsNullOrWhiteSpace(dto.ModoPreparo) ||
        dto.Ingredientes is null || dto.Ingredientes.Count == 0)
    {
        return Results.BadRequest(new { erro = "Preencha todos os campos obrigatórios e ao menos um ingrediente." });
    }

    var receita = new Receita
    {
        NomeFuncionario = dto.NomeFuncionario,
        WhatsApp = dto.WhatsApp,
        Escola = dto.Escola,
        NomeReceita = dto.NomeReceita,
        ModoPreparo = dto.ModoPreparo,
        DataCriacao = DateTime.UtcNow,
        Ingredientes = dto.Ingredientes.Select(i => new IngredienteReceita
        {
            IngredienteNome = i.IngredienteNome,
            Quantidade = i.Quantidade,
            Medida = i.Medida
        }).ToList()
    };

    db.Receitas.Add(receita);
    await db.SaveChangesAsync();

    return Results.Created($"/api/receitas/{receita.Id}", new { receita.Id });
});

// =========================================================
// GET /api/receitas - lista todas as receitas com ingredientes
// =========================================================
app.MapGet("/api/receitas", async (AppDbContext db) =>
{
    var receitas = await db.Receitas
        .Include(r => r.Ingredientes)
        .OrderByDescending(r => r.DataCriacao)
        .Select(r => new ReceitaResponseDto(
            r.Id,
            r.NomeFuncionario,
            r.WhatsApp,
            r.Escola,
            r.NomeReceita,
            r.ModoPreparo,
            r.DataCriacao,
            r.Nota,
            r.Ingredientes.Select(i => new IngredienteReceitaDto(
                i.IngredienteNome, i.Quantidade, i.Medida
            )).ToList()
        ))
        .ToListAsync();

    return Results.Ok(receitas);
});

// =========================================================
// POST /api/auth/login - autentica um administrador
// =========================================================
app.MapPost("/api/auth/login", async (AdminLoginDto dto, AppDbContext db) =>
{
    var admin = await db.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email);

    if (admin is null || !PasswordHasher.Verificar(dto.Senha, admin.SenhaHash))
        return Results.Json(new { erro = "E-mail ou senha inválidos." }, statusCode: 401);

    return Results.Ok(new AdminResponseDto(admin.Id, admin.Nome, admin.Email, admin.DataCriacao));
});

// =========================================================
// GET /api/admins - lista os administradores cadastrados
// =========================================================
app.MapGet("/api/admins", async (AppDbContext db) =>
{
    var admins = await db.Admins
        .OrderBy(a => a.Nome)
        .Select(a => new AdminResponseDto(a.Id, a.Nome, a.Email, a.DataCriacao))
        .ToListAsync();

    return Results.Ok(admins);
});

// =========================================================
// POST /api/admins - cria um novo administrador
// =========================================================
app.MapPost("/api/admins", async (AdminCreateDto dto, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dto.Nome) ||
        string.IsNullOrWhiteSpace(dto.Email) ||
        string.IsNullOrWhiteSpace(dto.Senha))
    {
        return Results.BadRequest(new { erro = "Preencha nome, e-mail e senha." });
    }

    if (dto.Senha.Length < 6)
        return Results.BadRequest(new { erro = "A senha deve ter ao menos 6 caracteres." });

    var jaExiste = await db.Admins.AnyAsync(a => a.Email == dto.Email);
    if (jaExiste)
        return Results.BadRequest(new { erro = "Já existe um administrador com esse e-mail." });

    var admin = new Admin
    {
        Nome = dto.Nome,
        Email = dto.Email,
        SenhaHash = PasswordHasher.Hash(dto.Senha),
    };

    db.Admins.Add(admin);
    await db.SaveChangesAsync();

    return Results.Created($"/api/admins/{admin.Id}",
        new AdminResponseDto(admin.Id, admin.Nome, admin.Email, admin.DataCriacao));
});

// =========================================================
// PUT /api/receitas/{id}/nota - avaliação do administrador
// =========================================================
app.MapPut("/api/receitas/{id:int}/nota", async (int id, NotaUpdateDto dto, AppDbContext db) =>
{
    if (dto.Nota < 0 || dto.Nota > 10)
        return Results.BadRequest(new { erro = "A nota deve estar entre 0 e 10." });

    var receita = await db.Receitas.FindAsync(id);
    if (receita is null)
        return Results.NotFound(new { erro = "Receita não encontrada." });

    receita.Nota = dto.Nota;
    await db.SaveChangesAsync();

    return Results.Ok(new { receita.Id, receita.Nota });
});

app.Run();
