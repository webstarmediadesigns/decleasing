import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { BarChart3, PieChart, LineChart, Calendar } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { DealStage, DealType } from '../types';

const Reports: React.FC = () => {
  const { state } = useCrm();
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // Deal pipeline data
  const dealsByStage = Object.values(DealStage).reduce((acc, stage) => {
    acc[stage] = state.deals.filter(deal => deal.stage === stage).length;
    return acc;
  }, {} as Record<DealStage, number>);

  // Deal types data
  const dealsByType = Object.values(DealType).reduce((acc, type) => {
    acc[type] = state.deals.filter(deal => deal.type === type).length;
    return acc;
  }, {} as Record<DealType, number>);

  // Dealership deals data
  const dealsByDealership = state.dealerships.map(dealership => ({
    name: dealership.name,
    count: state.deals.filter(deal => deal.dealershipId === dealership.id).length
  })).sort((a, b) => b.count - a.count);

  // Task completion data
  const completedTasks = state.tasks.filter(task => task.completed).length;
  const pendingTasks = state.tasks.filter(task => !task.completed).length;

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <Button 
            variant={period === 'month' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('month')}
          >
            Month
          </Button>
          <Button 
            variant={period === 'quarter' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('quarter')}
          >
            Quarter
          </Button>
          <Button 
            variant={period === 'year' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('year')}
          >
            Year
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card title="Deal Pipeline">
          <div className="flex items-center justify-end mb-4">
            <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {period === 'month' ? 'Current Month' : period === 'quarter' ? 'Current Quarter' : 'Current Year'}
            </span>
          </div>
          <div className="space-y-4">
            {Object.entries(dealsByStage).map(([stage, count]) => {
              const totalDeals = state.deals.length;
              const percentage = totalDeals > 0 ? Math.round((count / totalDeals) * 100) : 0;
              
              return (
                <div key={stage}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{stage}</span>
                    <span className="text-gray-500">{count} deals ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Deal Types">
          <div className="flex items-center justify-end mb-4">
            <PieChart className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {period === 'month' ? 'Current Month' : period === 'quarter' ? 'Current Quarter' : 'Current Year'}
            </span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-6 w-full">
              {Object.entries(dealsByType).map(([type, count], index) => {
                const totalDeals = state.deals.length;
                const percentage = totalDeals > 0 ? Math.round((count / totalDeals) * 100) : 0;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
                
                return (
                  <div key={type} className="flex flex-col items-center">
                    <div className="mb-2 w-full">
                      <div 
                        className={`h-32 ${colors[index]} rounded-t-lg`} 
                        style={{ height: `${Math.max(percentage, 10)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                    <span className="text-xs text-gray-500">{count} deals</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card title="Top Dealerships">
          <div className="space-y-4">
            {dealsByDealership.slice(0, 5).map((dealership, index) => {
              const totalDeals = state.deals.length;
              const percentage = totalDeals > 0 ? Math.round((dealership.count / totalDeals) * 100) : 0;
              
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{dealership.name}</span>
                    <span className="text-gray-500">{dealership.count} deals</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Task Completion Rate">
          <div className="flex items-center justify-end mb-4">
            <Calendar className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {period === 'month' ? 'Current Month' : period === 'quarter' ? 'Current Quarter' : 'Current Year'}
            </span>
          </div>
          <div className="flex justify-center">
            <div className="w-48 h-48 relative">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                <circle
                  className="text-green-500 stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${(completedTasks / (completedTasks + pendingTasks)) * 251.2}, 251.2`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                ></circle>
                <text
                  x="50"
                  y="50"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="font-bold text-3xl"
                  fill="#374151"
                >
                  {completedTasks + pendingTasks > 0
                    ? Math.round((completedTasks / (completedTasks + pendingTasks)) * 100)
                    : 0}%
                </text>
              </svg>
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Completed ({completedTasks})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Pending ({pendingTasks})</span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Deal Aging">
        <div className="flex items-center justify-end mb-4">
          <LineChart className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">
            {period === 'month' ? 'Current Month' : period === 'quarter' ? 'Current Quarter' : 'Current Year'} - Average Days in Stage
          </span>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Detailed deal aging metrics will appear here when there is sufficient historical data.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;