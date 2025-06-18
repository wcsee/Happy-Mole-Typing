using System.Security.Claims;

namespace HappyMoleTyping.Core.Interfaces;

public interface IJwtTokenService
{
    string GenerateAccessToken(Guid userId, string username, string email);
    string GenerateRefreshToken();
    ClaimsPrincipal? ValidateToken(string token);
    Guid? GetUserIdFromToken(string token);
    bool IsTokenExpired(string token);
    DateTime GetTokenExpiration(string token);
}