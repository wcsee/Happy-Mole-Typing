using HappyMoleTyping.Core.Entities;

namespace HappyMoleTyping.Core.Interfaces;

public interface IGameService
{
    Task<GameSession> StartGameAsync(Guid userId, int levelId);
    Task<GameSession> EndGameAsync(Guid userId, Guid sessionId, int score, decimal accuracy, decimal wpm, int maxCombo, int wordsTyped, int correctWords, int incorrectWords, bool isCompleted);
    Task<GameSession?> GetGameSessionAsync(Guid sessionId, Guid userId);
    Task<List<GameSession>> GetGameHistoryAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<bool> ValidateGameResultAsync(Guid sessionId, int score, decimal accuracy, decimal wpm);
    Task<bool> IsGameSessionValidAsync(Guid sessionId, Guid userId);
    Task<GameSession?> GetActiveGameSessionAsync(Guid userId);
}