using HappyMoleTyping.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace HappyMoleTyping.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Level> Levels { get; set; }
    public DbSet<GameSession> GameSessions { get; set; }
    public DbSet<Score> Scores { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<UserAchievement> UserAchievements { get; set; }
    public DbSet<PasswordReset> PasswordResets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.LastLoginAt);
        });

        // Level configuration
        modelBuilder.Entity<Level>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Difficulty);
            entity.HasIndex(e => e.IsActive);
            
            // Configure CharacterSet to allow longer text for Chinese characters
            entity.Property(e => e.CharacterSet)
                  .HasMaxLength(2000); // Increased from 255 to accommodate Chinese character sets
        });

        // GameSession configuration
        modelBuilder.Entity<GameSession>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.StartedAt });
            entity.HasIndex(e => new { e.LevelId, e.Score });
            entity.HasIndex(e => e.IsCompleted);
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.GameSessions)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Level)
                  .WithMany(l => l.GameSessions)
                  .HasForeignKey(e => e.LevelId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Score configuration
        modelBuilder.Entity<Score>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.Value });
            entity.HasIndex(e => new { e.LevelId, e.Value });
            entity.HasIndex(e => e.AchievedAt);
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Scores)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Level)
                  .WithMany(l => l.Scores)
                  .HasForeignKey(e => e.LevelId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Achievement configuration
        modelBuilder.Entity<Achievement>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.IsActive);
        });

        // UserAchievement configuration
        modelBuilder.Entity<UserAchievement>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.AchievementId }).IsUnique();
            entity.HasIndex(e => e.UnlockedAt);
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.UserAchievements)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Achievement)
                  .WithMany(a => a.UserAchievements)
                  .HasForeignKey(e => e.AchievementId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // PasswordReset configuration
        modelBuilder.Entity<PasswordReset>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Token).IsUnique();
            entity.HasIndex(e => new { e.UserId, e.ExpiresAt });
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.PasswordResets)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}