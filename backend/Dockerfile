FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia TUDO da pasta backend para dentro do container
COPY . .

# COMANDO DE DEPURAÇÃO: Isso vai listar todos os arquivos para vermos onde o .csproj está
RUN ls -R

# Tenta restaurar usando o caminho que o 'ls' nos mostrará
RUN dotnet restore
RUN dotnet publish -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MerendaChef.dll"]