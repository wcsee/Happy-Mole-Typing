using HappyMoleTyping.Core.Entities;
using HappyMoleTyping.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace HappyMoleTyping.Infrastructure.Services;

public class LevelService : ILevelService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<LevelService> _logger;

    public LevelService(IUnitOfWork unitOfWork, ILogger<LevelService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<List<Level>> GetLevelsAsync(Guid? userId = null)
    {
        var levels = await _unitOfWork.Levels.GetAllAsync();
        var levelList = levels.OrderBy(l => l.Difficulty).ToList();

        _logger.LogInformation("Retrieved {Count} levels", levelList?.Count ?? 0);
        return levelList?.ToList() ?? new List<Level>();
    }

    public async Task<Level?> GetLevelByIdAsync(int levelId, Guid? userId = null)
    {
        var level = await _unitOfWork.Levels.GetByIdAsync(levelId);
        if (level == null)
        {
            _logger.LogWarning("Level with ID {LevelId} not found", levelId);
            return null;
        }

        return level;
    }

    public async Task<object> GetLevelRequirementsAsync(int levelId, Guid userId)
    {
        var level = await _unitOfWork.Levels.GetByIdAsync(levelId);
        if (level == null)
        {
            _logger.LogWarning("Level with ID {LevelId} not found", levelId);
            return new { error = "Level not found" };
        }

        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found", userId);
            return new { error = "User not found" };
        }

        return new
        {
            levelId = level.Id,
            title = level.Name,
            description = level.Description,
            requiredLevel = level.UnlockLevel ?? 1,
            isUnlocked = user?.Level >= (level.UnlockLevel ?? 1),
            estimatedTime = level.TimeLimit,
            difficulty = level.Difficulty
        };
    }

    public async Task<object> GetLevelUnlockStatusAsync(int levelId, Guid userId)
    {
        var isUnlocked = await IsLevelUnlockedAsync(levelId, userId);
        var level = await _unitOfWork.Levels.GetByIdAsync(levelId);
        
        return new
        {
            levelId = levelId,
            isUnlocked = isUnlocked,
            requiredLevel = level?.UnlockLevel ?? 0
        };
    }

    public async Task<List<Level>> GetRecommendedLevelsAsync(Guid userId, int count = 5)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for recommendations", userId);
            return new List<Level>();
        }

        var allLevels = await _unitOfWork.Levels.GetAllAsync();
        var recommendedLevels = allLevels
            .Where(l => (l.UnlockLevel ?? 1) <= user.Level)
            .OrderBy(l => Math.Abs(l.Difficulty - user.Level))
            .Take(count)
            .ToList();

        _logger.LogInformation("Retrieved {Count} recommended levels for user {UserId}", recommendedLevels.Count, userId);
        
        return recommendedLevels;
    }

    public async Task<bool> IsLevelUnlockedAsync(int levelId, Guid userId)
    {
        var level = await _unitOfWork.Levels.GetByIdAsync(levelId);
        if (level == null)
        {
            return false;
        }

        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            return false;
        }

        return user.Level >= (level.UnlockLevel ?? 1);
    }

    public async Task<Level?> GetLevelEntityAsync(int levelId)
    {
        return await _unitOfWork.Levels.GetByIdAsync(levelId);
    }

    public async Task<bool> UnlockLevelAsync(Guid userId, int levelId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for level unlock", userId);
            return false;
        }

        var level = await _unitOfWork.Levels.GetByIdAsync(levelId);
        if (level == null)
        {
            _logger.LogWarning("Level with ID {LevelId} not found", levelId);
            return false;
        }

        if (user.Level >= (level.UnlockLevel ?? 1))
        {
            _logger.LogInformation("Level {LevelId} already unlocked for user {UserId}", levelId, userId);
            return true;
        }

        // TODO: Implement level unlock logic if needed
        // This might involve updating user progress or achievements
        
        _logger.LogInformation("Unlocked level {LevelId} for user {UserId}", levelId, userId);
        return true;
    }
}