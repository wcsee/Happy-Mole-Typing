using HappyMoleTyping.Core.Entities;
using HappyMoleTyping.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace HappyMoleTyping.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UserService> _logger;

    public UserService(IUnitOfWork unitOfWork, ILogger<UserService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<User?> GetUserProfileAsync(Guid userId)
    {
        try
        {
            return await _unitOfWork.Users.GetByIdAsync(userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user profile for user: {UserId}", userId);
            return null;
        }
    }

    public async Task<User?> UpdateUserProfileAsync(Guid userId, string? username, string? email, string? bio, string? avatarUrl)
    {
        try
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return null;

            user.Username = username;
            user.Email = email;
            user.Bio = bio;
            user.Avatar = avatarUrl;
            user.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Users.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("User profile updated for user: {UserId}", userId);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user profile for user: {UserId}", userId);
            return null;
        }
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        try
        {
            return await _unitOfWork.Users.GetByIdAsync(userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by ID: {UserId}", userId);
            return null;
        }
    }

    public async Task<object> GetUserStatisticsAsync(Guid userId)
    {
        try
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return null;

            // In a real implementation, you would calculate statistics from game sessions
            return new
            {
                TotalGames = 0,
                TotalWordsTyped = 0,
                AverageWpm = 0.0,
                AverageAccuracy = 0.0,
                HighestWpm = 0,
                HighestAccuracy = 0.0,
                TotalScore = user.TotalScore,
                Level = user.Level,
                Experience = user.Experience,
                TotalPlayTime = TimeSpan.Zero,
                CompletedLevels = 0,
                UnlockedAchievements = 0,
                CurrentStreak = 0,
                LongestStreak = 0,
                LastGameDate = (DateTime?)null,
                JoinDate = user.CreatedAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user statistics for user: {UserId}", userId);
            return null;
        }
    }

    public async Task<bool> DeleteUserAsync(Guid userId)
    {
        try
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return false;

            await _unitOfWork.Users.DeleteAsync(user);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("User deleted: {UserId}", userId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user: {UserId}", userId);
            return false;
        }
    }

    public async Task<bool> UpdateUserExperienceAsync(Guid userId, int experience)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for experience update", userId);
            return false;
        }

        user.Experience += experience;
        
        // Check if user should level up
        var newLevel = CalculateLevel(user.Experience);
        if (newLevel > user.Level)
        {
            user.Level = newLevel;
            _logger.LogInformation("User {UserId} leveled up to level {Level}", userId, newLevel);
        }

        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
        
        _logger.LogInformation("Updated experience for user {UserId} by {Experience} points", userId, experience);
        return true;
    }

    public async Task<List<Achievement>> GetUserAchievementsAsync(Guid userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for achievements retrieval", userId);
            return new List<Achievement>();
        }

        // TODO: Implement achievement retrieval logic
        // This would typically involve querying user achievements from the database
        _logger.LogInformation("Retrieved achievements for user {UserId}", userId);
        return new List<Achievement>();
    }

    public async Task<string> UploadAvatarAsync(Guid userId, Stream fileStream, string fileName)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for avatar upload", userId);
            throw new ArgumentException("User not found");
        }

        // TODO: Implement file upload logic
        // This would typically involve saving the file to a storage service and returning the URL
        var avatarUrl = $"/avatars/{userId}_{fileName}";
        user.Avatar = avatarUrl;
        
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
        
        _logger.LogInformation("Uploaded avatar for user {UserId}: {AvatarUrl}", userId, avatarUrl);
        return avatarUrl;
    }

    public async Task<bool> DeleteAvatarAsync(Guid userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for avatar deletion", userId);
            return false;
        }

        // TODO: Implement file deletion logic from storage service
        user.Avatar = null;
        
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
        
        _logger.LogInformation("Deleted avatar for user {UserId}", userId);
        return true;
    }

    public async Task<bool> UpdateUserLevelAsync(Guid userId, int newLevel)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for level update", userId);
            return false;
        }

        user.Level = newLevel;
        
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
        
        _logger.LogInformation("Updated level for user {UserId} to {Level}", userId, newLevel);
        return true;
    }

    public async Task<bool> AddExperienceAsync(Guid userId, int experience)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for experience addition", userId);
            return false;
        }

        user.Experience += experience;
        
        // Check if user should level up
        var newLevel = CalculateLevel(user.Experience);
        if (newLevel > user.Level)
        {
            user.Level = newLevel;
            _logger.LogInformation("User {UserId} leveled up to level {Level}", userId, newLevel);
        }

        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
        
        _logger.LogInformation("Added {Experience} experience to user {UserId}", experience, userId);
        return true;
    }

    public async Task<bool> UpdateTotalScoreAsync(Guid userId, long score)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User with ID {UserId} not found for score update", userId);
            return false;
        }

        user.TotalScore = score;
        
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
        
        _logger.LogInformation("Updated total score for user {UserId} to {Score}", userId, score);
        return true;
    }

    private int CalculateLevel(int experience)
    {
        // Simple level calculation - can be customized based on requirements
        return (experience / 1000) + 1;
    }
}