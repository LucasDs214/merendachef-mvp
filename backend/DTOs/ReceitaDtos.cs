namespace MerendaChef.DTOs;

// Payload recebido do frontend no POST /api/receitas
public record IngredienteReceitaDto(
    string IngredienteNome,
    decimal Quantidade,
    string Medida
);

public record ReceitaCreateDto(
    string NomeFuncionario,
    string WhatsApp,
    string Escola,
    string NomeReceita,
    string ModoPreparo,
    List<IngredienteReceitaDto> Ingredientes
);

// Payload retornado no GET /api/receitas
public record ReceitaResponseDto(
    int Id,
    string NomeFuncionario,
    string WhatsApp,
    string Escola,
    string NomeReceita,
    string ModoPreparo,
    DateTime DataCriacao,
    decimal? Nota,
    List<IngredienteReceitaDto> Ingredientes
);

// Payload do PUT /api/receitas/{id}/nota
public record NotaUpdateDto(decimal Nota);
