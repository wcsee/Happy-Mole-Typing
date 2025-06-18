using HappyMoleTyping.Core.Entities;

namespace HappyMoleTyping.Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<User> Users { get; }
    IRepository<Level> Levels { get; }
    IRepository<GameSession> GameSessions { get; }
    IRepository<Score> Scores { get; }
    IRepository<Achievement> Achievements { get; }
    IRepository<UserAchievement> UserAchievements { get; }
    IRepository<PasswordReset> PasswordResets { get; }
    
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}