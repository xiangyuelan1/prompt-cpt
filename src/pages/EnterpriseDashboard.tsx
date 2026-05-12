import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Settings, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

type TabType = 'overview' | 'teams' | 'courses' | 'reports' | 'settings';

export function EnterpriseDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const teamMembers = [
    { id: '1', name: '张三', email: 'zhangsan@company.com', role: '员工', progress: 75, coursesCompleted: 3, joinDate: '2024-01-15' },
    { id: '2', name: '李四', email: 'lisi@company.com', role: '员工', progress: 45, coursesCompleted: 1, joinDate: '2024-02-01' },
    { id: '3', name: '王五', email: 'wangwu@company.com', role: '管理员', progress: 100, coursesCompleted: 5, joinDate: '2023-12-01' },
    { id: '4', name: '赵六', email: 'zhaoliu@company.com', role: '员工', progress: 20, coursesCompleted: 0, joinDate: '2024-02-20' },
  ];

  const assignedCourses = [
    { id: '1', name: '提示词工程入门到精通', assigned: 4, completed: 2, avgProgress: 60 },
    { id: '2', name: 'AI内容创作实战', assigned: 4, completed: 3, avgProgress: 85 },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-gray-400 text-sm">团队成员</p>
          <p className="text-3xl font-bold text-white mt-1">12</p>
          <p className="text-green-400 text-sm mt-1">+2 本月新增</p>
        </div>

        <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-gray-400 text-sm">已完成课程</p>
          <p className="text-3xl font-bold text-white mt-1">28</p>
          <p className="text-green-400 text-sm mt-1">+5 本周</p>
        </div>

        <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm">获得证书</p>
          <p className="text-3xl font-bold text-white mt-1">8</p>
          <p className="text-gray-400 text-sm mt-1">累计</p>
        </div>

        <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm">平均完成率</p>
          <p className="text-3xl font-bold text-white mt-1">72%</p>
          <p className="text-green-400 text-sm mt-1">+8% 本月</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
          <h3 className="text-white font-semibold mb-4">最近活动</h3>
          <div className="space-y-4">
            {[
              { user: '张三', action: '完成了课程', course: '提示词工程入门到精通', time: '2小时前' },
              { user: '李四', action: '开始学习', course: 'AI内容创作实战', time: '5小时前' },
              { user: '王五', action: '获得证书', course: '提示词工程入门到精通', time: '1天前' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-gray-300">
                    <span className="text-white font-medium">{activity.user}</span>
                    {activity.action}
                    <span className="text-primary">{activity.course}</span>
                  </p>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
          <h3 className="text-white font-semibold mb-4">课程完成情况</h3>
          <div className="space-y-4">
            {assignedCourses.map((course) => (
              <div key={course.id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white">{course.name}</span>
                  <span className="text-gray-400">{course.completed}/{course.assigned}</span>
                </div>
                <div className="w-full bg-dark-400 rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2"
                    style={{ width: `${course.avgProgress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeams = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索团队成员..."
              className="pl-10 pr-4 py-2 bg-dark-300 border border-dark-400 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>
          <button className="px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg text-gray-400 hover:text-white flex items-center gap-2">
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
        <button className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          邀请成员
        </button>
      </div>

      <div className="bg-dark-300 rounded-xl border border-dark-400 overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-400">
            <tr>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">成员</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">角色</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">学习进度</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">完成课程</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">加入时间</th>
              <th className="text-left px-6 py-4 text-gray-400 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-400">
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-dark-400/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-medium">{member.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-gray-500 text-sm">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    member.role === '管理员' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-dark-400 rounded-full h-2">
                      <div 
                        className={`rounded-full h-2 ${
                          member.progress === 100 ? 'bg-green-500' : 'bg-primary'
                        }`}
                        style={{ width: `${member.progress}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-sm">{member.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">{member.coursesCompleted}</td>
                <td className="px-6 py-4 text-gray-400">{member.joinDate}</td>
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-white">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">课程管理</h3>
        <button className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          分配课程
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assignedCourses.map((course) => (
          <div key={course.id} className="bg-dark-300 rounded-xl p-6 border border-dark-400">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-white font-semibold">{course.name}</h4>
                <p className="text-gray-400 text-sm mt-1">必修课程</p>
              </div>
              <button className="text-gray-400 hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-gray-500 text-sm">已分配</p>
                <p className="text-white font-semibold text-lg">{course.assigned}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">已完成</p>
                <p className="text-green-400 font-semibold text-lg">{course.completed}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">平均进度</p>
                <p className="text-primary font-semibold text-lg">{course.avgProgress}%</p>
              </div>
            </div>

            <div className="w-full bg-dark-400 rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2"
                style={{ width: `${course.avgProgress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h3 className="text-white font-semibold text-lg">学习报告</h3>
      <div className="bg-dark-300 rounded-xl p-12 border border-dark-400 text-center">
        <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">报告功能开发中</p>
        <p className="text-gray-500 mt-2">即将推出详细的学习数据分析和导出功能</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-white font-semibold text-lg">企业设置</h3>
      <div className="bg-dark-300 rounded-xl p-8 border border-dark-400 text-center">
        <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">设置功能开发中</p>
        <p className="text-gray-500 mt-2">企业信息、团队权限等设置即将推出</p>
      </div>
    </div>
  );

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">企业管理后台</h1>
          <p className="text-gray-400">管理团队学习和培训进度</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-dark-400">
          {[
            { id: 'overview', label: '概览', icon: TrendingUp },
            { id: 'teams', label: '团队管理', icon: Users },
            { id: 'courses', label: '课程分配', icon: BookOpen },
            { id: 'reports', label: '学习报告', icon: Award },
            { id: 'settings', label: '设置', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-primary'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'teams' && renderTeams()}
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </PageContainer>
  );
}
