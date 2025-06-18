using HappyMoleTyping.Core.Entities;

namespace HappyMoleTyping.Core.Interfaces;

public interface ILeaderboardService
{
    Task<object> GetGlobalLeaderboardAsync(int page = 1, int pageSize = 20);
    Task<object> GetLevelLeaderboardAsync(int levelId, int page = 1, int pageSize = 20);
    Task<object> GetDailyLeaderboardAsync(int page = 1, int pageSize = 20);
    Task<object> GetWeeklyLeaderboardAsync(int page = 1, int pageSize = 20);
    Task<object> GetMonthlyLeaderboardAsync(int page = 1, int pageSize = 20);
    Task<object> GetUserRankingAsync(Guid userId);
    Task<bool> UpdateUserScoreAsync(Guid userId, int levelId, int score, decimal accuracy, decimal wpm, int maxCombo);
    Task<List<Score>> GetTopPlayersAsync(int count = 10);
}