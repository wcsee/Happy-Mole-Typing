using HappyMoleTyping.Core.Entities;
using HappyMoleTyping.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace HappyMoleTyping.Infrastructure.Services;

public class LeaderboardService : ILeaderboardService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<LeaderboardService> _logger;

    public LeaderboardService(IUnitOfWork unitOfWork, ILogger<LeaderboardService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<object> GetGlobalLeaderboardAsync(int page = 1, int pageSize = 20)
    {
        var allScores = await _unitOfWork.Scores.GetAllAsync();
        var topScores = allScores
            .GroupBy(s => s.UserId)
            .Select(g => g.OrderByDescending(s => s.Value).First())
            .OrderByDescending(s => s.Value)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var leaderboard = new List<object>();
        int rank = (page - 1) * pageSize + 1;

        foreach (var score in topScores)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(score.UserId);
            leaderboard.Add(new
            {
                rank = rank++,
                userId = score.UserId,
                username = user?.Username ?? "Unknown",
                score = score.Value,
                accuracy = score.Accuracy,
                wpm = score.WPM,
                achievedAt = score.AchievedAt
            });
        }

        _logger.LogInformation("Retrieved global leaderboard page {Page} with {Count} entries", page, leaderboard.Count);
        
        return new
        {
            page = page,
            pageSize = pageSize,
            totalCount = allScores.GroupBy(s => s.UserId).Count(),
            leaderboard = leaderboard
        };
    }

    public async Task<object> GetLevelLeaderboardAsync(int levelId, int page = 1, int pageSize = 20)
    {
        var allScores = await _unitOfWork.Scores.GetAllAsync();
        var levelScores = allScores
            .Where(s => s.LevelId == levelId)
            .GroupBy(s => s.UserId)
            .Select(g => g.OrderByDescending(s => s.Value).First())
            .OrderByDescending(s => s.Value)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        var leaderboard = new List<object>();
        int rank = (page - 1) * pageSize + 1;

        foreach (var score in levelScores)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(score.UserId);
            leaderboard.Add(new
            {
                rank = rank++,
                userId = score.UserId,
                username = user?.Username ?? "Unknown",
                score = score.Value,
                accuracy = score.Accuracy,
                wpm = score.WPM,
                maxCombo = score.MaxCombo,
                achievedAt = score.AchievedAt
            });
        }

        _logger.LogInformation("Retrieved level {LevelId} leaderboard page {Page} with {Count} entries", 
            levelId, page, leaderboard.Count);
        
        return new
        {
            levelId = levelId,
            page = page,
            pageSize = pageSize,
            totalCount = allScores.Where(s => s.LevelId == levelId).GroupBy(s => s.UserId).Count(),
            leaderboard = leaderboard
        };
    }

    public async Task<object> GetDailyLeaderboardAsync(int page = 1, int pageSize = 20)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);
        
        var allScores = await _unitOfWork.Scores.GetAllAsync();
        var dailyScores = allScores
            .Where(s => s.AchievedAt >= today && s.AchievedAt < tomorrow)
            .GroupBy(s => s.UserId)
            .Select(g => g.OrderByDescending(s => s.Value).First())
            .OrderByDescending(s => s.Value)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return await BuildLeaderboardResponse(dailyScores, page, pageSize, "daily");
    }

    public async Task<object> GetWeeklyLeaderboardAsync(int page = 1, int pageSize = 20)
    {
        var startOfWeek = DateTime.UtcNow.Date.AddDays(-(int)DateTime.UtcNow.DayOfWeek);
        var endOfWeek = startOfWeek.AddDays(7);
        
        var allScores = await _unitOfWork.Scores.GetAllAsync();
        var weeklyScores = allScores
            .Where(s => s.AchievedAt >= startOfWeek && s.AchievedAt < endOfWeek)
            .GroupBy(s => s.UserId)
            .Select(g => g.OrderByDescending(s => s.Value).First())
            .OrderByDescending(s => s.Value)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return await BuildLeaderboardResponse(weeklyScores, page, pageSize, "weekly");
    }

    public async Task<object> GetMonthlyLeaderboardAsync(int page = 1, int pageSize = 20)
    {
        var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
        var endOfMonth = startOfMonth.AddMonths(1);
        
        var allScores = await _unitOfWork.Scores.GetAllAsync();
        var monthlyScores = allScores
            .Where(s => s.AchievedAt >= startOfMonth && s.AchievedAt < endOfMonth)
            .GroupBy(s => s.UserId)
            .Select(g => g.OrderByDescending(s => s.Value).First())
            .OrderByDescending(s => s.Value)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return await BuildLeaderboardResponse(monthlyScores, page, pageSize, "monthly");
    }

    public async Task<object> GetUserRankingAsync(Guid userId)
    {
        var allScores = await _unitOfWork.Scores.GetAllAsync();
        var userBestScores = allScores
            .GroupBy(s => s.UserId)
            .Select(g => new { UserId = g.Key, BestScore = g.Max(s => s.Value) })
            .OrderByDescending(u => u.BestScore)
            .ToList();

        var userRank = userBestScores.FindIndex(u => u.UserId == userId) + 1;
        var userScore = userBestScores.FirstOrDefault(u => u.UserId == userId);

        _logger.LogInformation("Retrieved ranking for user {UserId}: rank {Rank}", userId, userRank);
        
        return new
        {
            userId = userId,
            globalRank = userRank > 0 ? (int?)userRank : null,
            bestScore = userScore?.BestScore ?? 0,
            totalPlayers = userBestScores.Count
        };
    }

    public async Task<bool> UpdateUserScoreAsync(Guid userId, int levelId, int score, decimal accuracy, decimal wpm, int maxCombo)
    {
        try
        {
            var newScore = new Score
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                LevelId = levelId,
                Value = score,
                Accuracy = accuracy,
                WPM = wpm,
                MaxCombo = maxCombo,
                AchievedAt = DateTime.UtcNow
            };

            await _unitOfWork.Scores.AddAsync(newScore);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Updated score for user {UserId} on level {LevelId}: {Score}", 
                userId, levelId, score);
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating score for user {UserId} on level {LevelId}", userId, levelId);
            return false;
        }
    }

    public async Task<List<Score>> GetTopPlayersAsync(int count = 10)
    {
        var allScores = await _unitOfWork.Scores.GetAllAsync();
        var topScores = allScores
            .GroupBy(s => s.UserId)
            .Select(g => g.OrderByDescending(s => s.Value).First())
            .OrderByDescending(s => s.Value)
            .Take(count)
            .ToList();

        _logger.LogInformation("Retrieved top {Count} players", topScores.Count);
        return topScores;
    }

    private async Task<object> BuildLeaderboardResponse(List<Score> scores, int page, int pageSize, string period)
    {
        var leaderboard = new List<object>();
        int rank = (page - 1) * pageSize + 1;

        foreach (var score in scores)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(score.UserId);
            leaderboard.Add(new
            {
                rank = rank++,
                userId = score.UserId,
                username = user?.Username ?? "Unknown",
                score = score.Value,
                accuracy = score.Accuracy,
                wpm = score.WPM,
                achievedAt = score.AchievedAt
            });
        }

        _logger.LogInformation("Retrieved {Period} leaderboard page {Page} with {Count} entries", 
            period, page, leaderboard.Count);
        
        return new
        {
            period = period,
            page = page,
            pageSize = pageSize,
            leaderboard = leaderboard
        };
    }
}