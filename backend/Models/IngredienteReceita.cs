namespace MerendaChef.Models;

public class IngredienteReceita
{
    public int Id { get; set; }

    public int ReceitaId { get; set; }
    public Receita? Receita { get; set; }

    public string IngredienteNome { get; set; } = string.Empty;
    public decimal Quantidade { get; set; }
    public string Medida { get; set; } = string.Empty;
}
