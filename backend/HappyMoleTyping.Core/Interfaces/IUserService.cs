using HappyMoleTyping.Core.Entities;

namespace HappyMoleTyping.Core.Interfaces;

public interface IUserService
{
    Task<User?> GetUserProfileAsync(Guid userId);
    Task<User?> UpdateUserProfileAsync(Guid userId, string? username, string? email, string? bio, string? avatarUrl);
    Task<object> GetUserStatisticsAsync(Guid userId);
    Task<List<Achievement>> GetUserAchievementsAsync(Guid userId);
    Task<string> UploadAvatarAsync(Guid userId, Stream fileStream, string fileName);
    Task<bool> DeleteAvatarAsync(Guid userId);
    Task<User?> GetUserByIdAsync(Guid userId);
    Task<bool> UpdateUserLevelAsync(Guid userId, int newLevel);
    Task<bool> AddExperienceAsync(Guid userId, int experience);
    Task<bool> UpdateTotalScoreAsync(Guid userId, long score);
}