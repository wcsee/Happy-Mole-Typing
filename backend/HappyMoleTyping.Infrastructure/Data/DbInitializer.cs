using HappyMoleTyping.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HappyMoleTyping.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(ApplicationDbContext context, ILogger logger)
    {
        try
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Check if data already exists
            if (await context.Levels.AnyAsync())
            {
                logger.LogInformation("Database already seeded");
                return;
            }

            // Seed Levels
            await SeedLevelsAsync(context, logger);

            // Seed Achievements
            await SeedAchievementsAsync(context, logger);

            await context.SaveChangesAsync();
            logger.LogInformation("Database seeded successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database");
            throw;
        }
    }

    private static async Task SeedLevelsAsync(ApplicationDbContext context, ILogger logger)
    {
        var levels = new List<Level>
        {
            new()
            {
                Id = 1,
                Name = "新手村",
                Description = "欢迎来到打字世界！让我们从简单的字母开始。",
                Difficulty = 1,
                MaxMoles = 3,
                MoleSpeed = 2.0m,
                TimeLimit = 60,
                TargetScore = 100,
                CharacterSet = "abcdefghijklmnopqrstuvwxyz",
                IsActive = true
            },
            new()
            {
                Id = 2,
                Name = "字母大师",
                Description = "熟练掌握所有字母，包括大小写混合。",
                Difficulty = 2,
                MaxMoles = 4,
                MoleSpeed = 2.5m,
                TimeLimit = 60,
                TargetScore = 200,
                UnlockLevel = 1,
                CharacterSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
                IsActive = true
            },
            new()
            {
                Id = 3,
                Name = "数字挑战",
                Description = "数字与字母的完美结合，提升你的反应速度。",
                Difficulty = 3,
                MaxMoles = 5,
                MoleSpeed = 3.0m,
                TimeLimit = 60,
                TargetScore = 300,
                UnlockLevel = 2,
                CharacterSet = "abcdefghijklmnopqrstuvwxyz0123456789",
                IsActive = true
            },
            new()
            {
                Id = 4,
                Name = "符号风暴",
                Description = "加入常用符号，真正的打字挑战开始了！",
                Difficulty = 4,
                MaxMoles = 6,
                MoleSpeed = 3.5m,
                TimeLimit = 60,
                TargetScore = 400,
                UnlockLevel = 3,
                CharacterSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()",
                IsActive = true
            },
            new()
            {
                Id = 5,
                Name = "极速狂飙",
                Description = "最高难度！测试你的极限打字速度。",
                Difficulty = 5,
                MaxMoles = 8,
                MoleSpeed = 4.0m,
                TimeLimit = 60,
                TargetScore = 500,
                UnlockLevel = 4,
                CharacterSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?",
                IsActive = true
            },
            new()
            {
                Id = 6,
                Name = "中文入门",
                Description = "开始中文打字练习，掌握基础汉字。",
                Difficulty = 2,
                MaxMoles = 3,
                MoleSpeed = 2.0m,
                TimeLimit = 90,
                TargetScore = 150,
                UnlockLevel = 2,
                CharacterSet = "的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严",
                IsActive = true
            },
            new()
            {
                Id = 7,
                Name = "中文进阶",
                Description = "提升中文打字速度，挑战更多汉字。",
                Difficulty = 3,
                MaxMoles = 4,
                MoleSpeed = 2.5m,
                TimeLimit = 90,
                TargetScore = 250,
                UnlockLevel = 6,
                CharacterSet = "的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞虎跳舞蹈音乐绘画书法诗歌散文小说戏剧电影电视广播网络科技创新发明发现探索研究实验测试检验分析综合评估判断决策选择机会挑战困难问题解决方案策略计划目标理想梦想希望信念坚持努力奋斗成功失败经验教训成长进步发展变化改革创造",
                IsActive = true
            },
            new()
            {
                Id = 8,
                Name = "混合模式",
                Description = "中英文混合打字，真实场景模拟。",
                Difficulty = 4,
                MaxMoles = 5,
                MoleSpeed = 3.0m,
                TimeLimit = 120,
                TargetScore = 400,
                UnlockLevel = 7,
                CharacterSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严",
                IsActive = true
            }
        };

        await context.Levels.AddRangeAsync(levels);
        logger.LogInformation("Seeded {Count} levels", levels.Count);
    }

    private static async Task SeedAchievementsAsync(ApplicationDbContext context, ILogger logger)
    {
        var achievements = new List<Achievement>
        {
            new()
            {
                Id = 1,
                Name = "初出茅庐",
                Description = "完成第一个游戏",
                Type = "games_played",
                RequiredValue = 1,
                Points = 10,
                IsActive = true
            },
            new()
            {
                Id = 2,
                Name = "百发百中",
                Description = "在一局游戏中达到100%准确率",
                Type = "accuracy",
                RequiredValue = 100,
                Points = 50,
                IsActive = true
            },
            new()
            {
                Id = 3,
                Name = "连击大师",
                Description = "在一局游戏中达到50连击",
                Type = "combo",
                RequiredValue = 50,
                Points = 30,
                IsActive = true
            },
            new()
            {
                Id = 4,
                Name = "分数达人",
                Description = "单局得分达到1000分",
                Type = "score",
                RequiredValue = 1000,
                Points = 40,
                IsActive = true
            },
            new()
            {
                Id = 5,
                Name = "坚持不懈",
                Description = "连续7天游戏",
                Type = "streak",
                RequiredValue = 7,
                Points = 100,
                IsActive = true
            },
            new()
            {
                Id = 6,
                Name = "游戏达人",
                Description = "完成100局游戏",
                Type = "games_played",
                RequiredValue = 100,
                Points = 200,
                IsActive = true
            },
            new()
            {
                Id = 7,
                Name = "速度之王",
                Description = "打字速度达到60WPM",
                Type = "wpm",
                RequiredValue = 60,
                Points = 150,
                IsActive = true
            },
            new()
            {
                Id = 8,
                Name = "关卡征服者",
                Description = "通过所有关卡",
                Type = "levels_completed",
                RequiredValue = 8,
                Points = 300,
                IsActive = true
            },
            new()
            {
                Id = 9,
                Name = "经验丰富",
                Description = "获得10000经验值",
                Type = "experience",
                RequiredValue = 10000,
                Points = 250,
                IsActive = true
            },
            new()
            {
                Id = 10,
                Name = "传奇玩家",
                Description = "总分达到100000分",
                Type = "total_score",
                RequiredValue = 100000,
                Points = 500,
                IsActive = true
            }
        };

        await context.Achievements.AddRangeAsync(achievements);
        logger.LogInformation("Seeded {Count} achievements", achievements.Count);
    }
}