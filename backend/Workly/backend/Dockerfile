FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY . .

RUN dotnet restore "backend.csproj"

RUN dotnet publish "backend.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/sdk:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

COPY --from=build /src/Migrations ./Migrations

ENV ASPNETCORE_URLS=http://0.0.0.0:10000

EXPOSE 10000

ENTRYPOINT ["sh", "-c", "dotnet ef database update && dotnet backend.dll"]