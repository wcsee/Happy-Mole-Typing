import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import './SettingsPage.css';

interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  showKeyboardHints: boolean;
  autoSaveProgress: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  keyboardLayout: 'qwerty' | 'dvorak' | 'colemak';
}

interface NotificationSettings {
  emailNotifications: boolean;
  gameReminders: boolean;
  achievementAlerts: boolean;
  leaderboardUpdates: boolean;
  weeklyReports: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  allowFriendRequests: boolean;
  shareGameStats: boolean;
  dataCollection: boolean;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'game' | 'notifications' | 'privacy' | 'account'>('game');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const [gameSettings, setGameSettings] = useState<GameSettings>({
    soundEnabled: true,
    musicEnabled: true,
    soundVolume: 70,
    musicVolume: 50,
    showKeyboardHints: true,
    autoSaveProgress: true,
    difficulty: 'medium',
    theme: 'light',
    language: 'zh-CN',
    keyboardLayout: 'qwerty'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    gameReminders: false,
    achievementAlerts: true,
    leaderboardUpdates: false,
    weeklyReports: true
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowFriendRequests: true,
    shareGameStats: true,
    dataCollection: true
  });

  // 加载设置
  useEffect(() => {
    // 从localStorage或API加载设置
    const savedGameSettings = localStorage.getItem('gameSettings');
    if (savedGameSettings) {
      setGameSettings(JSON.parse(savedGameSettings));
    }

    const savedNotificationSettings = localStorage.getItem('notificationSettings');
    if (savedNotificationSettings) {
      setNotificationSettings(JSON.parse(savedNotificationSettings));
    }

    const savedPrivacySettings = localStorage.getItem('privacySettings');
    if (savedPrivacySettings) {
      setPrivacySettings(JSON.parse(savedPrivacySettings));
    }
  }, []);

  const handleGameSettingChange = (key: keyof GameSettings, value: any) => {
    setGameSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleNotificationSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handlePrivacySettingChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // 保存到localStorage（实际项目中应该保存到后端）
      localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
      
      // 应用主题设置
      if (gameSettings.theme !== 'auto') {
        document.documentElement.setAttribute('data-theme', gameSettings.theme);
      } else {
        // 自动主题：根据系统偏好设置
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      }
      
      setHasChanges(false);
      
      // 显示成功消息
      alert('设置已保存！');
    } catch (error) {
      console.error('保存设置失败:', error);
      alert('保存设置失败，请重试。');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    if (confirm('确定要重置所有设置到默认值吗？')) {
      setGameSettings({
        soundEnabled: true,
        musicEnabled: true,
        soundVolume: 70,
        musicVolume: 50,
        showKeyboardHints: true,
        autoSaveProgress: true,
        difficulty: 'medium',
        theme: 'light',
        language: 'zh-CN',
        keyboardLayout: 'qwerty'
      });
      setNotificationSettings({
        emailNotifications: true,
        gameReminders: false,
        achievementAlerts: true,
        leaderboardUpdates: false,
        weeklyReports: true
      });
      setPrivacySettings({
        profileVisibility: 'public',
        showOnlineStatus: true,
        allowFriendRequests: true,
        shareGameStats: true,
        dataCollection: true
      });
      setHasChanges(true);
    }
  };

  const renderGameSettings = () => (
    <div className="settings-section">
      <h3>游戏设置</h3>
      
      <div className="setting-group">
        <h4>音频设置</h4>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>音效</label>
            <span className="setting-description">游戏音效开关</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={gameSettings.soundEnabled}
              onChange={(e) => handleGameSettingChange('soundEnabled', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>背景音乐</label>
            <span className="setting-description">背景音乐开关</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={gameSettings.musicEnabled}
              onChange={(e) => handleGameSettingChange('musicEnabled', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>音效音量</label>
            <span className="setting-description">调节音效音量大小</span>
          </div>
          <div className="volume-control">
            <input
              type="range"
              min="0"
              max="100"
              value={gameSettings.soundVolume}
              onChange={(e) => handleGameSettingChange('soundVolume', parseInt(e.target.value))}
              disabled={!gameSettings.soundEnabled}
            />
            <span className="volume-value">{gameSettings.soundVolume}%</span>
          </div>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>音乐音量</label>
            <span className="setting-description">调节背景音乐音量大小</span>
          </div>
          <div className="volume-control">
            <input
              type="range"
              min="0"
              max="100"
              value={gameSettings.musicVolume}
              onChange={(e) => handleGameSettingChange('musicVolume', parseInt(e.target.value))}
              disabled={!gameSettings.musicEnabled}
            />
            <span className="volume-value">{gameSettings.musicVolume}%</span>
          </div>
        </div>
      </div>
      
      <div className="setting-group">
        <h4>游戏体验</h4>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>键盘提示</label>
            <span className="setting-description">显示键盘按键提示</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={gameSettings.showKeyboardHints}
              onChange={(e) => handleGameSettingChange('showKeyboardHints', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>自动保存进度</label>
            <span className="setting-description">自动保存游戏进度</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={gameSettings.autoSaveProgress}
              onChange={(e) => handleGameSettingChange('autoSaveProgress', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>默认难度</label>
            <span className="setting-description">新游戏的默认难度</span>
          </div>
          <select
            value={gameSettings.difficulty}
            onChange={(e) => handleGameSettingChange('difficulty', e.target.value)}
            className="setting-select"
          >
            <option value="easy">简单</option>
            <option value="medium">中等</option>
            <option value="hard">困难</option>
          </select>
        </div>
      </div>
      
      <div className="setting-group">
        <h4>界面设置</h4>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>主题</label>
            <span className="setting-description">选择界面主题</span>
          </div>
          <select
            value={gameSettings.theme}
            onChange={(e) => handleGameSettingChange('theme', e.target.value)}
            className="setting-select"
          >
            <option value="light">浅色</option>
            <option value="dark">深色</option>
            <option value="auto">跟随系统</option>
          </select>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>语言</label>
            <span className="setting-description">界面显示语言</span>
          </div>
          <select
            value={gameSettings.language}
            onChange={(e) => handleGameSettingChange('language', e.target.value)}
            className="setting-select"
          >
            <option value="zh-CN">简体中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>键盘布局</label>
            <span className="setting-description">键盘布局类型</span>
          </div>
          <select
            value={gameSettings.keyboardLayout}
            onChange={(e) => handleGameSettingChange('keyboardLayout', e.target.value)}
            className="setting-select"
          >
            <option value="qwerty">QWERTY</option>
            <option value="dvorak">Dvorak</option>
            <option value="colemak">Colemak</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3>通知设置</h3>
      
      <div className="setting-group">
        <h4>邮件通知</h4>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>启用邮件通知</label>
            <span className="setting-description">接收游戏相关邮件通知</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => handleNotificationSettingChange('emailNotifications', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>游戏提醒</label>
            <span className="setting-description">提醒你回来游戏</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notificationSettings.gameReminders}
              onChange={(e) => handleNotificationSettingChange('gameReminders', e.target.checked)}
              disabled={!notificationSettings.emailNotifications}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>成就通知</label>
            <span className="setting-description">获得新成就时通知</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notificationSettings.achievementAlerts}
              onChange={(e) => handleNotificationSettingChange('achievementAlerts', e.target.checked)}
              disabled={!notificationSettings.emailNotifications}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>排行榜更新</label>
            <span className="setting-description">排行榜位置变化通知</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notificationSettings.leaderboardUpdates}
              onChange={(e) => handleNotificationSettingChange('leaderboardUpdates', e.target.checked)}
              disabled={!notificationSettings.emailNotifications}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>周报</label>
            <span className="setting-description">每周游戏统计报告</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notificationSettings.weeklyReports}
              onChange={(e) => handleNotificationSettingChange('weeklyReports', e.target.checked)}
              disabled={!notificationSettings.emailNotifications}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="settings-section">
      <h3>隐私设置</h3>
      
      <div className="setting-group">
        <h4>个人资料</h4>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>资料可见性</label>
            <span className="setting-description">谁可以查看你的个人资料</span>
          </div>
          <select
            value={privacySettings.profileVisibility}
            onChange={(e) => handlePrivacySettingChange('profileVisibility', e.target.value)}
            className="setting-select"
          >
            <option value="public">所有人</option>
            <option value="friends">仅好友</option>
            <option value="private">仅自己</option>
          </select>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>显示在线状态</label>
            <span className="setting-description">让其他人看到你的在线状态</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.showOnlineStatus}
              onChange={(e) => handlePrivacySettingChange('showOnlineStatus', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>允许好友请求</label>
            <span className="setting-description">其他人可以向你发送好友请求</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.allowFriendRequests}
              onChange={(e) => handlePrivacySettingChange('allowFriendRequests', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>分享游戏统计</label>
            <span className="setting-description">在排行榜中显示你的成绩</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.shareGameStats}
              onChange={(e) => handlePrivacySettingChange('shareGameStats', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>数据收集</label>
            <span className="setting-description">允许收集匿名使用数据以改进游戏</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.dataCollection}
              onChange={(e) => handlePrivacySettingChange('dataCollection', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="settings-section">
      <h3>账户设置</h3>
      
      <div className="setting-group">
        <h4>账户信息</h4>
        
        <div className="account-info">
          <div className="info-item">
            <span className="info-label">用户名:</span>
            <span className="info-value">{user?.username}</span>
          </div>
          <div className="info-item">
            <span className="info-label">邮箱:</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">注册时间:</span>
            <span className="info-value">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '未知'}
            </span>
          </div>
        </div>
        
        <div className="account-actions">
          <button className="action-button secondary">
            修改密码
          </button>
          <button className="action-button secondary">
            更新邮箱
          </button>
          <button className="action-button danger">
            删除账户
          </button>
        </div>
      </div>
      
      <div className="setting-group">
        <h4>数据管理</h4>
        
        <div className="data-actions">
          <button className="action-button secondary">
            导出数据
          </button>
          <button className="action-button secondary">
            清除缓存
          </button>
          <button className="action-button danger">
            重置所有数据
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>设置</h1>
        <p>个性化你的游戏体验</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="settings-tabs">
            <button
              className={`tab-button ${activeTab === 'game' ? 'active' : ''}`}
              onClick={() => setActiveTab('game')}
            >
              <span className="tab-icon">🎮</span>
              游戏设置
            </button>
            <button
              className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <span className="tab-icon">🔔</span>
              通知设置
            </button>
            <button
              className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <span className="tab-icon">🔒</span>
              隐私设置
            </button>
            <button
              className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <span className="tab-icon">👤</span>
              账户设置
            </button>
          </div>
        </div>

        <div className="settings-content">
          {activeTab === 'game' && renderGameSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'privacy' && renderPrivacySettings()}
          {activeTab === 'account' && renderAccountSettings()}
        </div>
      </div>

      {hasChanges && (
        <div className="settings-footer">
          <div className="footer-content">
            <span className="changes-indicator">你有未保存的更改</span>
            <div className="footer-actions">
              <button
                className="action-button secondary"
                onClick={handleResetSettings}
                disabled={saving}
              >
                重置
              </button>
              <button
                className="action-button primary"
                onClick={handleSaveSettings}
                disabled={saving}
              >
                {saving ? '保存中...' : '保存设置'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;