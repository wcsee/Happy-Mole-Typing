using System.ComponentModel.DataAnnotations;

namespace HappyMoleTyping.API.DTOs.Auth;

public class LoginRequestDto
{
    [Required(ErrorMessage = "用户名或邮箱不能为空")]
    public string UsernameOrEmail { get; set; } = string.Empty;

    [Required(ErrorMessage = "密码不能为空")]
    [MinLength(6, ErrorMessage = "密码长度至少6位")]
    public string Password { get; set; } = string.Empty;

    public bool RememberMe { get; set; } = false;
}