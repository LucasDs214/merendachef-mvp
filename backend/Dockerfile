# Estágio de Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia tudo da pasta atual (que será a pasta 'backend' no Render) para dentro do container
COPY . .

# Comando de segurança: busca o arquivo .csproj automaticamente
# Isso evita o erro de "not found" caso o arquivo esteja em uma subpasta
RUN dotnet restore $(find . -name "*.csproj")
RUN dotnet publish $(find . -name "*.csproj") -c Release -o /out

# Estágio Final
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /out .

# Define a porta que o Render espera
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Comando para iniciar a aplicação
ENTRYPOINT ["dotnet", "MerendaChef.dll"]