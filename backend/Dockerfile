# Usa a imagem oficial do .NET SDK para compilar
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# MUDANÇA AQUI: Como o Dockerfile está dentro de /backend, 
# o .csproj também está lá, então referenciamos apenas pelo nome
COPY ["MerendaChef.csproj", "./"]
RUN dotnet restore

# Copia todo o resto da pasta atual (backend)
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Usa a imagem oficial do ASP.NET Runtime para rodar
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MerendaChef.dll"]