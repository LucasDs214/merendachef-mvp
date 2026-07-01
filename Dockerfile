# Usa a imagem oficial do .NET SDK para compilar
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia os arquivos do projeto e restaura dependências
COPY ["MerendaChef.csproj", "./"]
RUN dotnet restore

# Copia todo o resto e publica
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Usa a imagem oficial do ASP.NET Runtime para rodar
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Define a porta que o Render vai usar
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MerendaChef.dll"]