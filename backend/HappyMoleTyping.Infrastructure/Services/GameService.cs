using HappyMoleTyping.Core.Entities;
using HappyMoleTyping.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace HappyMoleTyping.Infrastructure.Services;

public class GameService : IGameService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GameService> _logger;

    public GameService(IUnitOfWork unitOfWork, ILogger<GameService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<GameSession> StartGameAsync(Guid userId, int levelId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for game start", userId);
            throw new ArgumentException("User not found");
        }

        var level = await _unitOfWork.Levels.GetByIdAsync(levelId);
        if (level == null)
        {
            _logger.LogWarning("Level with ID {LevelId} not found", levelId);
            throw new ArgumentException("Level not found");
        }

        var gameSession = new GameSession
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            LevelId = levelId,
            StartedAt = DateTime.UtcNow,
            IsCompleted = false
        };

        await _unitOfWork.GameSessions.AddAsync(gameSession);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Started game session {SessionId} for user {UserId} on level {LevelId}", 
            gameSession.Id, userId, levelId);
        
        return gameSession;
    }

    public async Task<GameSession> EndGameAsync(Guid userId, Guid sessionId, int score, decimal accuracy, 
        decimal wpm, int maxCombo, int wordsTyped, int correctWords, int incorrectWords, bool isCompleted)
    {
        var gameSession = await _unitOfWork.GameSessions.GetByIdAsync(sessionId);
        if (gameSession == null || gameSession.UserId != userId)
        {
            _logger.LogWarning("Game session {SessionId} not found or doesn't belong to user {UserId}", 
                sessionId, userId);
            throw new ArgumentException("Game session not found or access denied");
        }

        if (gameSession.IsCompleted)
        {
            _logger.LogWarning("Game session {SessionId} is already completed", sessionId);
            throw new InvalidOperationException("Game session is already completed");
        }

        gameSession.CompletedAt = DateTime.UtcNow;
        gameSession.Score = score;
        gameSession.Accuracy = accuracy;
        gameSession.MaxCombo = maxCombo;
        gameSession.HitsCount = correctWords;
        gameSession.MissesCount = incorrectWords;
        gameSession.IsCompleted = isCompleted;
        gameSession.Duration = (int)(DateTime.UtcNow - gameSession.StartedAt).TotalSeconds;

        await _unitOfWork.GameSessions.UpdateAsync(gameSession);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Ended game session {SessionId} for user {UserId} with score {Score}", 
            sessionId, userId, score);
        
        return gameSession;
    }

    public async Task<GameSession?> GetGameSessionAsync(Guid sessionId, Guid userId)
    {
        var gameSession = await _unitOfWork.GameSessions.GetByIdAsync(sessionId);
        if (gameSession?.UserId != userId)
        {
            _logger.LogWarning("Game session {SessionId} not found or doesn't belong to user {UserId}", 
                sessionId, userId);
            return null;
        }

        return gameSession;
    }

    public async Task<List<GameSession>> GetGameHistoryAsync(Guid userId, int page = 1, int pageSize = 20)
    {
        // TODO: Implement pagination in repository
        var allSessions = await _unitOfWork.GameSessions.GetAllAsync();
        var userSessions = allSessions
            .Where(s => s.UserId == userId && s.IsCompleted)
            .OrderByDescending(s => s.StartedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        _logger.LogInformation("Retrieved {Count} game sessions for user {UserId} (page {Page})", 
            userSessions.Count, userId, page);
        
        return userSessions;
    }

    public async Task<bool> ValidateGameResultAsync(Guid sessionId, int score, decimal accuracy, decimal wpm)
    {
        var gameSession = await _unitOfWork.GameSessions.GetByIdAsync(sessionId);
        if (gameSession == null)
        {
            _logger.LogWarning("Game session {SessionId} not found for validation", sessionId);
            return false;
        }

        // Basic validation logic
        if (score < 0 || accuracy < 0 || accuracy > 100 || wpm < 0)
        {
            _logger.LogWarning("Invalid game result values for session {SessionId}", sessionId);
            return false;
        }

        // Additional validation can be added here
        return true;
    }

    public async Task<bool> IsGameSessionValidAsync(Guid sessionId, Guid userId)
    {
        var gameSession = await _unitOfWork.GameSessions.GetByIdAsync(sessionId);
        return gameSession != null && gameSession.UserId == userId && !gameSession.IsCompleted;
    }

    public async Task<GameSession?> GetActiveGameSessionAsync(Guid userId)
    {
        var allSessions = await _unitOfWork.GameSessions.GetAllAsync();
        var activeSession = allSessions
            .FirstOrDefault(s => s.UserId == userId && !s.IsCompleted);

        return activeSession;
    }
}