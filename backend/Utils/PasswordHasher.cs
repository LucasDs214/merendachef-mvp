using System.Security.Cryptography;

namespace MerendaChef.Utils;

// Hash de senha com PBKDF2 (biblioteca nativa do .NET, sem dependências externas).
// Formato armazenado: "{iteracoes}.{saltBase64}.{hashBase64}"
public static class PasswordHasher
{
    private const int Iteracoes = 100_000;
    private const int TamanhoSalt = 16; // bytes
    private const int TamanhoHash = 32; // bytes

    public static string Hash(string senha)
    {
        var salt = RandomNumberGenerator.GetBytes(TamanhoSalt);
        var hash = Rfc2898DeriveBytes.Pbkdf2(senha, salt, Iteracoes, HashAlgorithmName.SHA256, TamanhoHash);
        return $"{Iteracoes}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public static bool Verificar(string senha, string senhaHashArmazenada)
    {
        var partes = senhaHashArmazenada.Split('.');
        if (partes.Length != 3) return false;

        var iteracoes = int.Parse(partes[0]);
        var salt = Convert.FromBase64String(partes[1]);
        var hashEsperado = Convert.FromBase64String(partes[2]);

        var hashCalculado = Rfc2898DeriveBytes.Pbkdf2(senha, salt, iteracoes, HashAlgorithmName.SHA256, hashEsperado.Length);

        return CryptographicOperations.FixedTimeEquals(hashCalculado, hashEsperado);
    }
}
