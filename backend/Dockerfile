FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia os arquivos do projeto
COPY . .
# Restaura e publica (assumindo que o arquivo chama MerendaChef.csproj)
RUN dotnet restore "MerendaChef.csproj"
RUN dotnet publish "MerendaChef.csproj" -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MerendaChef.dll"]