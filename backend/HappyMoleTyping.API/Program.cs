using Serilog;
using HappyMoleTyping.Infrastructure.Extensions;
using HappyMoleTyping.API.Middleware;
using HappyMoleTyping.Infrastructure.Data;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger/OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Happy Mole Typing API",
        Version = "v1",
        Description = "API for Happy Mole Typing Game - A fun typing game with mole characters",
        Contact = new OpenApiContact
        {
            Name = "Happy Mole Typing Team",
            Email = "support@happymoletyping.com"
        }
    });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

    // Include XML comments if available
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// Add Infrastructure services
builder.Services.AddInfrastructure(builder.Configuration);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    await DbInitializer.InitializeAsync(context, logger);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Happy Mole Typing API v1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "Happy Mole Typing API Documentation";
        c.DefaultModelsExpandDepth(-1);
        c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
        c.EnableDeepLinking();
        c.EnableFilter();
        c.ShowExtensions();
        c.EnableValidator();
    });
}
else
{
    // Enable Swagger in production for API documentation
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Happy Mole Typing API v1");
        c.RoutePrefix = "api-docs";
        c.DocumentTitle = "Happy Mole Typing API Documentation";
    });
}

// Add error handling middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Print service URLs to console
var urls = app.Urls.Any() ? app.Urls : new[] { "https://localhost:54792", "http://localhost:54793" };
var environment = app.Environment.EnvironmentName;

Console.WriteLine("\n" + new string('=', 60));
Console.WriteLine("🎮 Happy Mole Typing API Started Successfully!");
Console.WriteLine(new string('=', 60));
Console.WriteLine($"Environment: {environment}");
Console.WriteLine($"Time: {DateTime.Now:yyyy-MM-dd HH:mm:ss}");
Console.WriteLine();

foreach (var url in urls)
{
    Console.WriteLine($"🌐 API Server: {url}");
    
    if (app.Environment.IsDevelopment())
    {
        Console.WriteLine($"📚 Swagger UI: {url}/swagger");
        Console.WriteLine($"📄 API Docs JSON: {url}/swagger/v1/swagger.json");
    }
    else
    {
        Console.WriteLine($"📚 API Docs: {url}/api-docs");
        Console.WriteLine($"📄 API Docs JSON: {url}/swagger/v1/swagger.json");
    }
}

Console.WriteLine();
Console.WriteLine("Press Ctrl+C to stop the server");
Console.WriteLine(new string('=', 60) + "\n");

app.Run();