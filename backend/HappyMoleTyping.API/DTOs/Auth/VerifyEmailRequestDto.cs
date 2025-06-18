using System.ComponentModel.DataAnnotations;

namespace HappyMoleTyping.API.DTOs.Auth;

public class VerifyEmailRequestDto
{
    [Required(ErrorMessage = "验证令牌不能为空")]
    public string Token { get; set; } = string.Empty;
}