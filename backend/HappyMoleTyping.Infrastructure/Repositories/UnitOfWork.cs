using HappyMoleTyping.Core.Entities;
using HappyMoleTyping.Core.Interfaces;
using HappyMoleTyping.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace HappyMoleTyping.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;
    private bool _disposed = false;

    private IRepository<User>? _users;
    private IRepository<Level>? _levels;
    private IRepository<GameSession>? _gameSessions;
    private IRepository<Score>? _scores;
    private IRepository<Achievement>? _achievements;
    private IRepository<UserAchievement>? _userAchievements;
    private IRepository<PasswordReset>? _passwordResets;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IRepository<User> Users => _users ??= new Repository<User>(_context);
    public IRepository<Level> Levels => _levels ??= new Repository<Level>(_context);
    public IRepository<GameSession> GameSessions => _gameSessions ??= new Repository<GameSession>(_context);
    public IRepository<Score> Scores => _scores ??= new Repository<Score>(_context);
    public IRepository<Achievement> Achievements => _achievements ??= new Repository<Achievement>(_context);
    public IRepository<UserAchievement> UserAchievements => _userAchievements ??= new Repository<UserAchievement>(_context);
    public IRepository<PasswordReset> PasswordResets => _passwordResets ??= new Repository<PasswordReset>(_context);

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _transaction?.Dispose();
                _context.Dispose();
            }
            _disposed = true;
        }
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
}