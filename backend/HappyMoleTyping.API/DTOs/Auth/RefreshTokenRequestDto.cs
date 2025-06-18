using System.ComponentModel.DataAnnotations;

namespace HappyMoleTyping.API.DTOs.Auth;

public class RefreshTokenRequestDto
{
    [Required(ErrorMessage = "刷新令牌不能为空")]
    public string RefreshToken { get; set; } = string.Empty;
}