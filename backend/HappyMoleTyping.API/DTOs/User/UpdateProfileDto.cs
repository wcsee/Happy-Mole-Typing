using System.ComponentModel.DataAnnotations;

namespace HappyMoleTyping.API.DTOs.User;

public class UpdateProfileDto
{
    [StringLength(50, MinimumLength = 3, ErrorMessage = "用户名长度必须在3-50个字符之间")]
    public string? Username { get; set; }
    
    [EmailAddress(ErrorMessage = "请输入有效的邮箱地址")]
    public string? Email { get; set; }
    
    [StringLength(200, ErrorMessage = "个人简介不能超过200个字符")]
    public string? Bio { get; set; }
    
    public string? AvatarUrl { get; set; }
}