using Microsoft.EntityFrameworkCore;
using MerendaChef.Models;

namespace MerendaChef.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Receita> Receitas => Set<Receita>();
    public DbSet<IngredienteReceita> IngredientesReceita => Set<IngredienteReceita>();
    public DbSet<Admin> Admins => Set<Admin>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Receita>(entity =>
        {
            entity.ToTable("Receita");
            entity.HasKey(r => r.Id);
            entity.HasMany(r => r.Ingredientes)
                  .WithOne(i => i.Receita)
                  .HasForeignKey(i => i.ReceitaId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.Property(r => r.Nota).HasColumnType("numeric(3,1)");
        });

        modelBuilder.Entity<IngredienteReceita>(entity =>
        {
            entity.ToTable("IngredienteReceita");
            entity.HasKey(i => i.Id);
            entity.Property(i => i.Quantidade).HasColumnType("numeric(10,2)");
        });

        modelBuilder.Entity<Admin>(entity =>
        {
            entity.ToTable("Admin");
            entity.HasKey(a => a.Id);
            entity.HasIndex(a => a.Email).IsUnique();
        });
    }
}
