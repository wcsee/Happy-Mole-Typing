using System.Security.Cryptography;
using System.Text;
using HappyMoleTyping.Core.Entities;
using HappyMoleTyping.Core.Interfaces;
using Microsoft.Extensions.Logging;
using BCrypt.Net;

namespace HappyMoleTyping.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUnitOfWork unitOfWork,
        IJwtTokenService jwtTokenService,
        IEmailService emailService,
        ILogger<AuthService> logger)
    {
        _unitOfWork = unitOfWork;
        _jwtTokenService = jwtTokenService;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<(string AccessToken, string RefreshToken, User User)> RegisterAsync(string username, string email, string password, bool agreeToTerms)
    {
        try
        {
            // Check if user already exists
            var existingUser = await _unitOfWork.Users.GetFirstOrDefaultAsync(u => 
                u.Username == username || u.Email == email);
            
            if (existingUser != null)
            {
                throw new InvalidOperationException("用户名或邮箱已存在");
            }

            // Generate salt and hash password
            var salt = BCrypt.Net.BCrypt.GenerateSalt();
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password, salt);

            // Create new user
            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = passwordHash,
                Salt = salt,
                Level = 1,
                TotalScore = 0,
                Experience = 0,
                IsEmailVerified = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            // Generate tokens
            var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Username, user.Email);
            var newRefreshToken = _jwtTokenService.GenerateRefreshToken();

            // Send verification email
            var verificationToken = GenerateVerificationToken();
            await _emailService.SendVerificationEmailAsync(user.Email, user.Username, verificationToken);

            _logger.LogInformation("User registered successfully: {Username}", user.Username);

            return (accessToken, newRefreshToken, user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user registration");
            throw;
        }
    }

    public async Task<(string AccessToken, string RefreshToken, User User)> LoginAsync(string usernameOrEmail, string password, bool rememberMe)
    {
        try
        {
            // Find user by username or email
            var user = await _unitOfWork.Users.GetFirstOrDefaultAsync(u => 
                u.Username == usernameOrEmail || u.Email == usernameOrEmail);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("用户名/邮箱或密码错误");
            }

            // Update last login time
            user.LastLoginAt = DateTime.UtcNow;
            await _unitOfWork.Users.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            // Generate tokens
            var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Username, user.Email);
            var newRefreshToken = _jwtTokenService.GenerateRefreshToken();

            _logger.LogInformation("User logged in successfully: {Username}", user.Username);

            return (accessToken, newRefreshToken, user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during user login");
            throw;
        }
    }

    public async Task<(string AccessToken, string RefreshToken)> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            // In a real implementation, you would store refresh tokens in database
            // and validate them here. For now, we'll generate new tokens.
            var userId = _jwtTokenService.GetUserIdFromToken(refreshToken);
            if (userId == null)
            {
                throw new UnauthorizedAccessException("无效的刷新令牌");
            }

            var user = await _unitOfWork.Users.GetByIdAsync(userId.Value);
            if (user == null)
            {
                throw new UnauthorizedAccessException("用户不存在");
            }

            var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Username, user.Email);
            var newRefreshToken = _jwtTokenService.GenerateRefreshToken();

            return (accessToken, newRefreshToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            throw;
        }
    }

    public async Task<bool> ForgotPasswordAsync(string email)
    {
        try
        {
            var user = await _unitOfWork.Users.GetFirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                // Don't reveal if email exists or not
                return true;
            }

            // Generate reset token
            var resetToken = GenerateResetToken();
            var passwordReset = new PasswordReset
            {
                UserId = user.Id,
                Token = resetToken,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.PasswordResets.AddAsync(passwordReset);
            await _unitOfWork.SaveChangesAsync();

            // Send reset email
            await _emailService.SendPasswordResetEmailAsync(user.Email, user.Username, resetToken);

            _logger.LogInformation("Password reset requested for user: {Email}", email);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset request");
            return false;
        }
    }

    public async Task<bool> ResetPasswordAsync(string token, string newPassword)
    {
        try
        {
            var passwordReset = await _unitOfWork.PasswordResets.GetFirstOrDefaultAsync(pr => 
                pr.Token == token && !pr.IsUsed && pr.ExpiresAt > DateTime.UtcNow);
            
            if (passwordReset == null)
            {
                throw new InvalidOperationException("无效或已过期的重置令牌");
            }

            var user = await _unitOfWork.Users.GetByIdAsync(passwordReset.UserId);
            if (user == null)
            {
                throw new InvalidOperationException("用户不存在");
            }

            // Update password
            var salt = BCrypt.Net.BCrypt.GenerateSalt();
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword, salt);
            user.Salt = salt;
            user.UpdatedAt = DateTime.UtcNow;

            // Mark reset token as used
            passwordReset.IsUsed = true;
            passwordReset.UsedAt = DateTime.UtcNow;

            await _unitOfWork.Users.UpdateAsync(user);
            await _unitOfWork.PasswordResets.UpdateAsync(passwordReset);
            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation("Password reset successfully for user: {UserId}", user.Id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset");
            throw;
        }
    }

    public Task<bool> LogoutAsync(Guid userId)
    {
        try
        {
            // In a real implementation, you would invalidate the refresh token here
            _logger.LogInformation("User logged out: {UserId}", userId);
            return Task.FromResult(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return Task.FromResult(false);
        }
    }

    public async Task<User?> GetCurrentUserAsync(Guid userId)
    {
        try
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user");
            return null;
        }
    }

    public Task<bool> VerifyEmailAsync(string token)
    {
        try
        {
            // In a real implementation, you would store verification tokens in database
            // For now, we'll just return true
            _logger.LogInformation("Email verification attempted with token: {Token}", token);
            return Task.FromResult(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during email verification");
            return Task.FromResult(false);
        }
    }

    public async Task<bool> ResendVerificationEmailAsync(Guid userId)
    {
        try
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null || user.IsEmailVerified)
                return false;

            var verificationToken = GenerateVerificationToken();
            await _emailService.SendVerificationEmailAsync(user.Email, user.Username, verificationToken);

            _logger.LogInformation("Verification email resent to: {Email}", user.Email);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resending verification email");
            return false;
        }
    }

    private static string GenerateVerificationToken()
    {
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    private static string GenerateResetToken()
    {
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
}