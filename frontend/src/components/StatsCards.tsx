import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, CreditCard } from 'lucide-react';

// 1. Define the props this component accepts
interface StatsProps {
  balance: number;
  sent: number;
  received: number;
  count: number;
}

export default function StatsCards({ balance, sent, received, count }: StatsProps) {
  
  // 2. Map real data to your design configuration
  const stats = [
    {
      title: 'Total Balance',
      value: `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+12.5%', // Keeping static for visual flair (requires historical DB data to calculate real %)
      isPositive: true,
      icon: Wallet,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Total Received',
      value: `$${received.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+8.2%',
      isPositive: true,
      icon: ArrowDownRight,
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50'
    },
    {
      title: 'Total Sent',
      value: `$${sent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '-4.3%',
      isPositive: false,
      icon: ArrowUpRight,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    },
    {
      title: 'Transactions',
      value: count.toString(),
      change: '+23',
      isPositive: true,
      icon: CreditCard,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.isPositive ? TrendingUp : TrendingDown;
        
        return (
          <div 
            key={index}
            className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden group hover:-translate-y-1"
          >
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {/* Visual Flair Badge (Static for now) */}
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
                  stat.isPositive 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                }`} style={{ fontWeight: 600 }}>
                  <TrendIcon className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              
              <div>
                <p className="text-slate-500 text-sm mb-1">{stat.title}</p>
                <p className="text-slate-900 text-3xl" style={{ fontWeight: 700 }}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}