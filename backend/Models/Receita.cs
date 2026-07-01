namespace MerendaChef.Models;

public class Receita
{
    public int Id { get; set; }
    public string NomeFuncionario { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
    public string Escola { get; set; } = string.Empty;
    public string NomeReceita { get; set; } = string.Empty;
    public string ModoPreparo { get; set; } = string.Empty;
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public decimal? Nota { get; set; }

    public List<IngredienteReceita> Ingredientes { get; set; } = new();
}
