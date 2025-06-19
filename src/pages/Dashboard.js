import React, { useState } from 'react';
import { MdEvent, MdChecklist, MdUpdate, MdTrendingUp, MdLock, MdLockOpen } from 'react-icons/md';

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center">
      <div className="p-2 bg-primary-50 rounded-lg">
        {icon}
      </div>
      <h3 className="ml-3 text-gray-600 text-sm font-medium">{title}</h3>
    </div>
    <div className="mt-4">
      <p className="text-2xl font-semibold text-gray-800">{value}개</p>
    </div>
  </div>
);

const EventCard = ({ event }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h4 className="font-medium text-gray-800">{event.title}</h4>
        <span className={`px-2 py-1 rounded-full text-xs ${
          event.category === '총회' ? 'bg-red-100 text-red-600' :
          event.category === '지파' ? 'bg-sky-100 text-sky-600' :
          event.category === '지역' ? 'bg-amber-100 text-amber-600' :
          'bg-green-100 text-green-600'
        }`}>
          {event.category}
        </span>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${
        event.status === '진행중' ? 'bg-primary-50 text-primary-600' :
        event.status === '예정' ? 'bg-warning-50 text-warning-600' :
        'bg-success-50 text-success-600'
      }`}>
        {event.status}
      </span>
    </div>
    <div className="mt-3">
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div 
          className="bg-primary-500 h-2 rounded-full" 
          style={{ width: `${event.progress}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500 text-right">{event.progress}% 완료</p>
    </div>
  </div>
);

const RecentActivity = ({ activity }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="p-2 bg-gray-100 rounded-full">
      {activity.icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-800">{activity.title}</p>
      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
    </div>
  </div>
);

const Dashboard = () => {
  // 샘플 데이터
  const stats = [
    {
      icon: <MdEvent className="w-6 h-6 text-primary-600" />,
      title: "진행중인 행사",
      value: "5"
    }
  ];

  const events = [
    {
      title: "2024 신년 행사",
      category: "총회",
      status: "진행중",
      date: "2024.01.15 - 2024.01.20",
      progress: 75
    },
    {
      title: "봄 시즌 프로모션",
      category: "지역",
      status: "예정",
      date: "2024.03.01 - 2024.03.15",
      progress: 30
    },
    {
      title: "청년부 수련회",
      category: "지파",
      status: "진행중",
      date: "2024.02.01 - 2024.02.03",
      progress: 45
    },
    {
      title: "찬양팀 워크샵",
      category: "부서",
      status: "예정",
      date: "2024.02.15 - 2024.02.16",
      progress: 15
    }
  ];

  const recentActivities = [
    {
      icon: <MdUpdate className="w-4 h-4 text-gray-600" />,
      title: "체크리스트 항목 업데이트",
      time: "10분 전"
    },
    {
      icon: <MdEvent className="w-4 h-4 text-gray-600" />,
      title: "새로운 행사 등록",
      time: "1시간 전"
    }
  ];

  // 진행중인 행사 수 계산
  const ongoingEventsCount = events.filter(event => event.status === "진행중").length;

  // stats 데이터 업데이트
  stats[0].value = ongoingEventsCount;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">대시보드</h1>
      
      {/* 통계 카드 */}
      <div className="mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 진행중인 행사 */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">진행중인 행사</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.filter(event => event.status === "진행중").map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        </div>

        {/* 최근 활동 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">최근 활동</h2>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            {recentActivities.map((activity, index) => (
              <RecentActivity key={index} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 