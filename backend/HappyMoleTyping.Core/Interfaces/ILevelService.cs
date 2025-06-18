using HappyMoleTyping.Core.Entities;

namespace HappyMoleTyping.Core.Interfaces;

public interface ILevelService
{
    Task<List<Level>> GetLevelsAsync(Guid? userId = null);
    Task<Level?> GetLevelByIdAsync(int levelId, Guid? userId = null);
    Task<object> GetLevelRequirementsAsync(int levelId, Guid userId);
    Task<object> GetLevelUnlockStatusAsync(int levelId, Guid userId);
    Task<List<Level>> GetRecommendedLevelsAsync(Guid userId, int count = 5);
    Task<bool> IsLevelUnlockedAsync(int levelId, Guid userId);
    Task<Level?> GetLevelEntityAsync(int levelId);
    Task<bool> UnlockLevelAsync(Guid userId, int levelId);
}