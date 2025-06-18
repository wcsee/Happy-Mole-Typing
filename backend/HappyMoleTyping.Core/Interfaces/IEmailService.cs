namespace HappyMoleTyping.Core.Interfaces;

public interface IEmailService
{
    Task<bool> SendEmailAsync(string to, string subject, string body, bool isHtml = true);
    Task<bool> SendVerificationEmailAsync(string to, string username, string verificationToken);
    Task<bool> SendPasswordResetEmailAsync(string to, string username, string resetToken);
    Task<bool> SendWelcomeEmailAsync(string to, string username);
    Task<bool> SendAchievementEmailAsync(string to, string username, string achievementName);
}