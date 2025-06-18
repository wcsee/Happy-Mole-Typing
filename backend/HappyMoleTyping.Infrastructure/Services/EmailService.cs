using HappyMoleTyping.Core.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace HappyMoleTyping.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _senderEmail;
    private readonly string _senderName;
    private readonly string _username;
    private readonly string _password;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
        _smtpServer = _configuration["EmailSettings:SmtpServer"] ?? throw new InvalidOperationException("SMTP Server not configured");
        _smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
        _senderEmail = _configuration["EmailSettings:SenderEmail"] ?? throw new InvalidOperationException("Sender Email not configured");
        _senderName = _configuration["EmailSettings:SenderName"] ?? "Happy Mole Typing";
        _username = _configuration["EmailSettings:Username"] ?? _senderEmail;
        _password = _configuration["EmailSettings:SenderPassword"] ?? throw new InvalidOperationException("Email Password not configured");
    }

    public async Task<bool> SendEmailAsync(string to, string subject, string body, bool isHtml = true)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_senderName, _senderEmail));
            message.To.Add(new MailboxAddress("", to));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder();
            if (isHtml)
                bodyBuilder.HtmlBody = body;
            else
                bodyBuilder.TextBody = body;

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_smtpServer, _smtpPort, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_username, _password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Email sent successfully to {Email}", to);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", to);
            return false;
        }
    }

    public async Task<bool> SendVerificationEmailAsync(string to, string username, string verificationToken)
    {
        var subject = "验证您的邮箱地址 - Happy Mole Typing";
        var verificationUrl = $"{_configuration["App:BaseUrl"]}/verify-email?token={verificationToken}";
        
        var body = $@"
        <html>
        <body style=""font-family: Arial, sans-serif; line-height: 1.6; color: #333;"">
            <div style=""max-width: 600px; margin: 0 auto; padding: 20px;"">
                <h2 style=""color: #4CAF50;"">🐹 欢迎来到 Happy Mole Typing！</h2>
                <p>亲爱的 {username}，</p>
                <p>感谢您注册 Happy Mole Typing！请点击下面的链接验证您的邮箱地址：</p>
                <div style=""text-align: center; margin: 30px 0;"">
                    <a href=""{verificationUrl}"" style=""background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;"">
                        验证邮箱
                    </a>
                </div>
                <p>如果按钮无法点击，请复制以下链接到浏览器地址栏：</p>
                <p style=""word-break: break-all; color: #666;"">{verificationUrl}</p>
                <p>此链接将在24小时后过期。</p>
                <hr style=""border: none; border-top: 1px solid #eee; margin: 30px 0;"">
                <p style=""color: #666; font-size: 12px;"">
                    如果您没有注册此账户，请忽略此邮件。<br>
                    Happy Mole Typing 团队
                </p>
            </div>
        </body>
        </html>";

        return await SendEmailAsync(to, subject, body, true);
    }

    public async Task<bool> SendPasswordResetEmailAsync(string to, string username, string resetToken)
    {
        var subject = "重置您的密码 - Happy Mole Typing";
        var resetUrl = $"{_configuration["App:BaseUrl"]}/reset-password?token={resetToken}";
        
        var body = $@"
        <html>
        <body style=""font-family: Arial, sans-serif; line-height: 1.6; color: #333;"">
            <div style=""max-width: 600px; margin: 0 auto; padding: 20px;"">
                <h2 style=""color: #FF9800;"">🔒 密码重置请求</h2>
                <p>亲爱的 {username}，</p>
                <p>我们收到了您的密码重置请求。请点击下面的链接重置您的密码：</p>
                <div style=""text-align: center; margin: 30px 0;"">
                    <a href=""{resetUrl}"" style=""background-color: #FF9800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;"">
                        重置密码
                    </a>
                </div>
                <p>如果按钮无法点击，请复制以下链接到浏览器地址栏：</p>
                <p style=""word-break: break-all; color: #666;"">{resetUrl}</p>
                <p>此链接将在1小时后过期。</p>
                <p style=""color: #f44336;"">
                    <strong>安全提示：</strong>如果您没有请求重置密码，请忽略此邮件。您的密码不会被更改。
                </p>
                <hr style=""border: none; border-top: 1px solid #eee; margin: 30px 0;"">
                <p style=""color: #666; font-size: 12px;"">
                    Happy Mole Typing 团队
                </p>
            </div>
        </body>
        </html>";

        return await SendEmailAsync(to, subject, body, true);
    }

    public async Task<bool> SendWelcomeEmailAsync(string to, string username)
    {
        var subject = "欢迎来到 Happy Mole Typing！";
        
        var body = $@"
        <html>
        <body style=""font-family: Arial, sans-serif; line-height: 1.6; color: #333;"">
            <div style=""max-width: 600px; margin: 0 auto; padding: 20px;"">
                <h2 style=""color: #4CAF50;"">🎉 欢迎加入 Happy Mole Typing！</h2>
                <p>亲爱的 {username}，</p>
                <p>恭喜您成功注册并验证了邮箱！现在您可以开始您的打字冒险之旅了。</p>
                <h3>游戏特色：</h3>
                <ul>
                    <li>🐹 可爱的地鼠角色</li>
                    <li>🎮 多样化的关卡挑战</li>
                    <li>🏆 成就系统和排行榜</li>
                    <li>📊 详细的进度统计</li>
                </ul>
                <div style=""text-align: center; margin: 30px 0;"">
                    <a href=""{_configuration["App:BaseUrl"]}"" style=""background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;"">
                        开始游戏
                    </a>
                </div>
                <p>祝您游戏愉快，打字技能越来越棒！</p>
                <hr style=""border: none; border-top: 1px solid #eee; margin: 30px 0;"">
                <p style=""color: #666; font-size: 12px;"">
                    Happy Mole Typing 团队
                </p>
            </div>
        </body>
        </html>";

        return await SendEmailAsync(to, subject, body, true);
    }

    public async Task<bool> SendAchievementEmailAsync(string to, string username, string achievementName)
    {
        var subject = $"恭喜获得成就：{achievementName} - Happy Mole Typing";
        
        var body = $@"
        <html>
        <body style=""font-family: Arial, sans-serif; line-height: 1.6; color: #333;"">
            <div style=""max-width: 600px; margin: 0 auto; padding: 20px;"">
                <h2 style=""color: #FFD700;"">🏆 恭喜获得新成就！</h2>
                <p>亲爱的 {username}，</p>
                <p>恭喜您解锁了新成就：<strong style=""color: #FFD700;"">{achievementName}</strong>！</p>
                <p>您的努力和坚持得到了回报，继续加油，解锁更多精彩成就！</p>
                <div style=""text-align: center; margin: 30px 0;"">
                    <a href=""{_configuration["App:BaseUrl"]}/profile"" style=""background-color: #FFD700; color: #333; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;"">
                        查看我的成就
                    </a>
                </div>
                <hr style=""border: none; border-top: 1px solid #eee; margin: 30px 0;"">
                <p style=""color: #666; font-size: 12px;"">
                    Happy Mole Typing 团队
                </p>
            </div>
        </body>
        </html>";

        return await SendEmailAsync(to, subject, body, true);
    }
}