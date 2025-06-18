using HappyMoleTyping.Core.Entities;

namespace HappyMoleTyping.Core.Interfaces;

public interface IAuthService
{
    Task<(string AccessToken, string RefreshToken, User User)> RegisterAsync(string username, string email, string password, bool agreeToTerms);
    Task<(string AccessToken, string RefreshToken, User User)> LoginAsync(string usernameOrEmail, string password, bool rememberMe);
    Task<(string AccessToken, string RefreshToken)> RefreshTokenAsync(string refreshToken);
    Task<bool> ForgotPasswordAsync(string email);
    Task<bool> ResetPasswordAsync(string token, string newPassword);
    Task<bool> LogoutAsync(Guid userId);
    Task<User?> GetCurrentUserAsync(Guid userId);
    Task<bool> VerifyEmailAsync(string token);
    Task<bool> ResendVerificationEmailAsync(Guid userId);
}