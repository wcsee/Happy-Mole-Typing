# 快乐打地鼠 - 打字练习游戏

一个基于Web的打字练习游戏，通过打地鼠的形式帮助用户提升打字技能。

## 技术栈

- **前端**: React 19 + TypeScript
- **后端**: ASP.NET Core 9.0
- **数据库**: PostgreSQL

## 功能设计

### 1. 用户系统

#### 1.1 用户注册
- 用户名、邮箱、密码注册
- 邮箱验证
- 用户名唯一性检查

#### 1.2 用户登录
- 用户名/邮箱 + 密码登录
- JWT Token认证
- 记住登录状态

#### 1.3 密码管理
- 忘记密码（邮箱重置）
- 修改密码
- 密码强度验证

### 2. 游戏系统

#### 2.1 打地鼠游戏核心
- 地鼠随机出现在不同位置
- 每个地鼠显示一个字母
- 用户按键盘对应字母击中地鼠
- 击中效果动画
- 未击中惩罚机制

#### 2.2 关卡系统
- 多个难度递增的关卡
- 每关卡特定的目标分数
- 关卡解锁机制
- 关卡特色（字母范围、速度、数量）

#### 2.3 难度设计
- **初级关卡**: 单个地鼠，慢速，基础字母(a-z)
- **中级关卡**: 2-3个地鼠，中速，大小写混合
- **高级关卡**: 4-6个地鼠，快速，包含数字和符号
- **专家关卡**: 多地鼠，极速，复杂字符组合

#### 2.4 积分系统
- 击中地鼠获得积分
- 连击奖励机制
- 速度奖励（反应时间）
- 准确率奖励

#### 2.5 等级系统
- 基于总积分的用户等级
- 等级称号（新手、熟练、专家、大师等）
- 等级特权（解锁特殊关卡、皮肤等）

### 3. 排行榜系统

#### 3.1 全球排行榜
- 总积分排行
- 单关卡最高分排行
- 最快通关时间排行

#### 3.2 个人统计
- 游戏历史记录
- 进步曲线图
- 准确率统计
- 平均反应时间

## 前端架构设计

### 目录结构

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       │   ├── mole.png
│       │   ├── hole.png
│       │   └── backgrounds/
│       └── sounds/
│           ├── hit.mp3
│           ├── miss.mp3
│           └── background.mp3
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── Modal.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   └── ResetPassword.tsx
│   │   ├── game/
│   │   │   ├── GameBoard.tsx
│   │   │   ├── Mole.tsx
│   │   │   ├── Hole.tsx
│   │   │   ├── ScoreBoard.tsx
│   │   │   ├── Timer.tsx
│   │   │   └── GameControls.tsx
│   │   ├── level/
│   │   │   ├── LevelSelector.tsx
│   │   │   ├── LevelCard.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── profile/
│   │   │   ├── UserProfile.tsx
│   │   │   ├── Statistics.tsx
│   │   │   └── Achievements.tsx
│   │   └── leaderboard/
│   │       ├── LeaderboardTable.tsx
│   │       ├── RankingCard.tsx
│   │       └── FilterTabs.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── GamePage.tsx
│   │   ├── LevelsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── LeaderboardPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useGame.ts
│   │   ├── useKeyboard.ts
│   │   ├── useTimer.ts
│   │   └── useSound.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── gameService.ts
│   │   ├── userService.ts
│   │   └── leaderboardService.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   ├── gameSlice.ts
│   │   ├── userSlice.ts
│   │   └── leaderboardSlice.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── game.ts
│   │   ├── user.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validation.ts
│   │   └── storage.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components/
│   │   └── pages/
│   ├── App.tsx
│   ├── index.tsx
│   └── setupTests.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

### 核心组件设计

#### GameBoard组件
- 管理游戏状态
- 处理键盘输入
- 控制地鼠生成和消失
- 计分和计时逻辑

#### Mole组件
- 地鼠动画效果
- 字母显示
- 击中状态管理

#### 状态管理
- Redux Toolkit用于全局状态
- 用户认证状态
- 游戏进度状态
- 用户数据缓存

## 后端架构设计

### 目录结构

```
backend/
├── HappyMoleTyping.API/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── GameController.cs
│   │   ├── UserController.cs
│   │   ├── LeaderboardController.cs
│   │   └── LevelController.cs
│   ├── Middleware/
│   │   ├── AuthenticationMiddleware.cs
│   │   ├── ExceptionHandlingMiddleware.cs
│   │   └── LoggingMiddleware.cs
│   ├── DTOs/
│   │   ├── Auth/
│   │   │   ├── LoginRequestDto.cs
│   │   │   ├── RegisterRequestDto.cs
│   │   │   ├── ResetPasswordDto.cs
│   │   │   └── AuthResponseDto.cs
│   │   ├── Game/
│   │   │   ├── GameSessionDto.cs
│   │   │   ├── GameResultDto.cs
│   │   │   └── ScoreDto.cs
│   │   ├── User/
│   │   │   ├── UserProfileDto.cs
│   │   │   ├── UserStatisticsDto.cs
│   │   │   └── UpdateProfileDto.cs
│   │   └── Leaderboard/
│   │       ├── LeaderboardEntryDto.cs
│   │       └── RankingDto.cs
│   ├── Program.cs
│   ├── appsettings.json
│   └── appsettings.Development.json
├── HappyMoleTyping.Core/
│   ├── Entities/
│   │   ├── User.cs
│   │   ├── GameSession.cs
│   │   ├── Level.cs
│   │   ├── Score.cs
│   │   └── Achievement.cs
│   ├── Interfaces/
│   │   ├── IUserRepository.cs
│   │   ├── IGameRepository.cs
│   │   ├── ILevelRepository.cs
│   │   ├── IScoreRepository.cs
│   │   └── IUnitOfWork.cs
│   ├── Services/
│   │   ├── IAuthService.cs
│   │   ├── IGameService.cs
│   │   ├── IUserService.cs
│   │   ├── IEmailService.cs
│   │   └── ILeaderboardService.cs
│   └── Enums/
│       ├── UserLevel.cs
│       ├── GameDifficulty.cs
│       └── AchievementType.cs
├── HappyMoleTyping.Infrastructure/
│   ├── Data/
│   │   ├── ApplicationDbContext.cs
│   │   ├── Configurations/
│   │   │   ├── UserConfiguration.cs
│   │   │   ├── GameSessionConfiguration.cs
│   │   │   ├── LevelConfiguration.cs
│   │   │   └── ScoreConfiguration.cs
│   │   └── Migrations/
│   ├── Repositories/
│   │   ├── UserRepository.cs
│   │   ├── GameRepository.cs
│   │   ├── LevelRepository.cs
│   │   ├── ScoreRepository.cs
│   │   └── UnitOfWork.cs
│   ├── Services/
│   │   ├── AuthService.cs
│   │   ├── GameService.cs
│   │   ├── UserService.cs
│   │   ├── EmailService.cs
│   │   └── LeaderboardService.cs
│   └── Extensions/
│       └── ServiceCollectionExtensions.cs
└── HappyMoleTyping.Tests/
    ├── Unit/
    ├── Integration/
    └── TestHelpers/
```

### API设计

#### 认证相关API
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新Token
- `POST /api/auth/forgot-password` - 忘记密码
- `POST /api/auth/reset-password` - 重置密码

#### 游戏相关API
- `GET /api/levels` - 获取关卡列表
- `GET /api/levels/{id}` - 获取关卡详情
- `POST /api/game/start` - 开始游戏
- `POST /api/game/end` - 结束游戏并提交分数
- `GET /api/game/history` - 获取游戏历史

#### 用户相关API
- `GET /api/user/profile` - 获取用户资料
- `PUT /api/user/profile` - 更新用户资料
- `GET /api/user/statistics` - 获取用户统计
- `GET /api/user/achievements` - 获取用户成就

#### 排行榜API
- `GET /api/leaderboard/global` - 全球排行榜
- `GET /api/leaderboard/level/{levelId}` - 关卡排行榜
- `GET /api/leaderboard/user/{userId}` - 用户排名

## 数据库设计

### 数据表结构

#### Users表 - 用户信息
```sql
CREATE TABLE Users (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Username VARCHAR(50) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Salt VARCHAR(255) NOT NULL,
    Level INTEGER DEFAULT 1,
    TotalScore BIGINT DEFAULT 0,
    Experience INTEGER DEFAULT 0,
    IsEmailVerified BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastLoginAt TIMESTAMP
);
```

#### Levels表 - 游戏关卡
```sql
CREATE TABLE Levels (
    Id INTEGER PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Difficulty INTEGER NOT NULL, -- 1-5难度等级
    MaxMoles INTEGER NOT NULL, -- 最大地鼠数量
    MoleSpeed DECIMAL(3,2) NOT NULL, -- 地鼠速度倍数
    TimeLimit INTEGER NOT NULL, -- 时间限制(秒)
    TargetScore INTEGER NOT NULL, -- 目标分数
    UnlockLevel INTEGER, -- 解锁所需等级
    CharacterSet VARCHAR(100) NOT NULL, -- 字符集范围
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### GameSessions表 - 游戏会话
```sql
CREATE TABLE GameSessions (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID NOT NULL REFERENCES Users(Id),
    LevelId INTEGER NOT NULL REFERENCES Levels(Id),
    Score INTEGER NOT NULL,
    Accuracy DECIMAL(5,2) NOT NULL, -- 准确率百分比
    Duration INTEGER NOT NULL, -- 游戏时长(秒)
    HitsCount INTEGER NOT NULL, -- 击中次数
    MissesCount INTEGER NOT NULL, -- 错过次数
    MaxCombo INTEGER NOT NULL, -- 最大连击
    IsCompleted BOOLEAN NOT NULL,
    StartedAt TIMESTAMP NOT NULL,
    CompletedAt TIMESTAMP,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Scores表 - 分数记录
```sql
CREATE TABLE Scores (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID NOT NULL REFERENCES Users(Id),
    GameSessionId UUID NOT NULL REFERENCES GameSessions(Id),
    LevelId INTEGER NOT NULL REFERENCES Levels(Id),
    Score INTEGER NOT NULL,
    Accuracy DECIMAL(5,2) NOT NULL,
    Duration INTEGER NOT NULL,
    AchievedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 创建索引用于排行榜查询
    INDEX idx_scores_level_score (LevelId, Score DESC),
    INDEX idx_scores_user_level (UserId, LevelId),
    INDEX idx_scores_global (Score DESC)
);
```

#### Achievements表 - 成就系统
```sql
CREATE TABLE Achievements (
    Id INTEGER PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT NOT NULL,
    Type VARCHAR(50) NOT NULL, -- SCORE, ACCURACY, COMBO, LEVEL等
    Requirement INTEGER NOT NULL, -- 达成条件数值
    Points INTEGER NOT NULL, -- 成就奖励积分
    Icon VARCHAR(255), -- 成就图标
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### UserAchievements表 - 用户成就
```sql
CREATE TABLE UserAchievements (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID NOT NULL REFERENCES Users(Id),
    AchievementId INTEGER NOT NULL REFERENCES Achievements(Id),
    UnlockedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(UserId, AchievementId)
);
```

#### PasswordResets表 - 密码重置
```sql
CREATE TABLE PasswordResets (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID NOT NULL REFERENCES Users(Id),
    Token VARCHAR(255) NOT NULL,
    ExpiresAt TIMESTAMP NOT NULL,
    IsUsed BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 索引设计

```sql
-- 用户查询优化
CREATE INDEX idx_users_email ON Users(Email);
CREATE INDEX idx_users_username ON Users(Username);
CREATE INDEX idx_users_level_score ON Users(Level, TotalScore DESC);

-- 游戏会话查询优化
CREATE INDEX idx_gamesessions_user_level ON GameSessions(UserId, LevelId);
CREATE INDEX idx_gamesessions_completed ON GameSessions(IsCompleted, CompletedAt);

-- 排行榜查询优化
CREATE INDEX idx_scores_leaderboard ON Scores(LevelId, Score DESC, AchievedAt);
CREATE INDEX idx_scores_user_best ON Scores(UserId, LevelId, Score DESC);

-- 成就查询优化
CREATE INDEX idx_userachievements_user ON UserAchievements(UserId, UnlockedAt);
```

## 游戏机制设计

### 积分计算公式

```
基础分数 = 10分/击中
速度奖励 = max(0, (1000ms - 反应时间) / 100) * 2
连击奖励 = 连击数 * 5
准确率奖励 = (准确率 - 80%) * 100 (当准确率>80%时)

总分 = (基础分数 + 速度奖励 + 连击奖励) * (1 + 准确率奖励/100)
```

### 等级系统

- **新手** (1-5级): 0-1000经验
- **学徒** (6-15级): 1001-5000经验
- **熟练** (16-30级): 5001-15000经验
- **专家** (31-50级): 15001-50000经验
- **大师** (51-99级): 50001-200000经验
- **传奇** (100级+): 200000+经验

### 关卡设计

#### 第1-5关：字母入门
- 字符集：a-z
- 地鼠数量：1个
- 速度：慢速(2秒显示时间)
- 目标：熟悉键盘布局

#### 第6-15关：大小写混合
- 字符集：a-z, A-Z
- 地鼠数量：1-2个
- 速度：中速(1.5秒显示时间)
- 目标：区分大小写

#### 第16-25关：数字加入
- 字符集：a-z, A-Z, 0-9
- 地鼠数量：2-3个
- 速度：中快速(1秒显示时间)
- 目标：数字键练习

#### 第26-40关：符号挑战
- 字符集：全键盘字符
- 地鼠数量：3-4个
- 速度：快速(0.8秒显示时间)
- 目标：特殊符号练习

#### 第41-60关：极速模式
- 字符集：全键盘字符
- 地鼠数量：4-6个
- 速度：极速(0.5秒显示时间)
- 目标：反应速度极限

## 部署架构

### 开发环境
- 前端：Vite开发服务器
- 后端：ASP.NET Core开发服务器
- 数据库：本地PostgreSQL

### 生产环境
- 前端：Nginx静态文件服务
- 后端：Docker容器 + Nginx反向代理
- 数据库：PostgreSQL集群
- 缓存：Redis
- 监控：Application Insights

## 安全考虑

### 认证安全
- JWT Token过期机制
- 密码哈希加盐存储
- 防暴力破解限制
- 邮箱验证机制

### API安全
- CORS配置
- 请求频率限制
- 输入验证和清理
- SQL注入防护

### 数据安全
- 敏感数据加密
- 定期数据备份
- 访问日志记录
- 权限最小化原则

## 性能优化

### 前端优化
- 组件懒加载
- 图片资源优化
- 代码分割
- 缓存策略

### 后端优化
- 数据库查询优化
- 缓存热点数据
- 异步处理
- 连接池管理

### 数据库优化
- 索引优化
- 查询优化
- 分页查询
- 读写分离

## 监控和日志

### 应用监控
- 性能指标监控
- 错误率监控
- 用户行为分析
- 实时告警

### 日志管理
- 结构化日志
- 日志等级管理
- 日志聚合分析
- 审计日志

## 测试策略

### 前端测试
- 单元测试：Jest + React Testing Library
- 组件测试：Storybook
- E2E测试：Playwright

### 后端测试
- 单元测试：xUnit
- 集成测试：TestContainers
- API测试：Postman/Newman

### 性能测试
- 负载测试
- 压力测试
- 数据库性能测试

## 项目里程碑

### 第一阶段：基础功能
- [ ] 用户注册登录系统
- [ ] 基础游戏界面
- [ ] 简单关卡设计
- [ ] 基础积分系统

### 第二阶段：核心功能
- [ ] 完整关卡系统
- [ ] 等级和成就系统
- [ ] 用户统计功能
- [ ] 基础排行榜

### 第三阶段：高级功能
- [ ] 高级排行榜
- [ ] 社交功能
- [ ] 个性化设置
- [ ] 移动端适配

### 第四阶段：优化完善
- [ ] 性能优化
- [ ] 安全加固
- [ ] 监控完善
- [ ] 用户体验优化

## 开发规范

### 代码规范
- 前端：ESLint + Prettier
- 后端：StyleCop + EditorConfig
- 提交规范：Conventional Commits

### 分支管理
- main：生产分支
- develop：开发分支
- feature/*：功能分支
- hotfix/*：热修复分支

### 版本管理
- 语义化版本控制
- 自动化发布流程
- 变更日志维护

---

本文档将作为项目开发的指导文档，随着项目进展会持续更新和完善。