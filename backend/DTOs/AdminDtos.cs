namespace MerendaChef.DTOs;

public record AdminCreateDto(string Nome, string Email, string Senha);

public record AdminLoginDto(string Email, string Senha);

public record AdminResponseDto(int Id, string Nome, string Email, DateTime DataCriacao);
