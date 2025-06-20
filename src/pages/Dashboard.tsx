import React from 'react';
import { useCrm } from '../context/CrmContext';
import { 
  Users, 
  FileSignature, 
  Building2, 
  CheckSquare, 
  ChevronRight,
  BarChart
} from 'lucide-react';
import { DealStage } from '../types';
import Card from '../components/common/Card';
import StatCard from '../components/dashboard/StatCard';
import Table from '../components/common/Table';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { state } = useCrm();
  const navigate = useNavigate();

  // Calculate summary statistics
  const activeDeals = state.deals.filter(
    deal => deal.stage !== DealStage.Completed
  ).length;
  
  const overdueTasksCount = state.tasks.filter(task => {
    if (task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today;
  }).length;

  // Get recent deals
  const recentDeals = [...state.deals]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Deal pipeline stats
  const dealsByStage = state.deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {} as Record<DealStage, number>);

  // Get upcoming tasks
  const upcomingTasks = state.tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Active Deals"
          value={activeDeals}
          icon={<FileSignature className="h-6 w-6 text-blue-600" />}
          change={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Customers"
          value={state.customers.length}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          change={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Dealership Network"
          value={state.dealerships.length}
          icon={<Building2 className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueTasksCount}
          icon={<CheckSquare className="h-6 w-6 text-blue-600" />}
          change={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Recent Deals">
          <Table
            columns={[
              { header: 'Customer', accessor: 'customerId', cell: (_, row) => {
                const customer = state.customers.find(c => c.id === row.customerId);
                return customer ? customer.name : 'Unknown';
              }},
              { header: 'Vehicle', accessor: 'vehicleOfInterest', cell: (vehicle) => {
                if (!vehicle) return 'N/A';
                return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
              }},
              { header: 'Status', accessor: 'stage', cell: (stage) => (
                <StatusBadge stage={stage} />
              )},
              { header: '', accessor: 'id', cell: (id) => (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/deals/${id}`)}
                >
                  View
                </Button>
              ), className: 'text-right w-20'}
            ]}
            data={recentDeals}
            onRowClick={(deal) => navigate(`/deals/${deal.id}`)}
          />
          <div className="mt-4 text-right">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/deals')}
              icon={<ChevronRight size={16} />}
            >
              View All Deals
            </Button>
          </div>
        </Card>

        <Card title="Deal Pipeline">
          <div className="space-y-4">
            {Object.entries(DealStage).map(([key, stage]) => {
              const count = dealsByStage[stage as DealStage] || 0;
              const totalDeals = state.deals.length;
              const percentage = totalDeals > 0 ? Math.round((count / totalDeals) * 100) : 0;
              
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{stage}</span>
                    <span className="text-gray-500">{count} deals</span>
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
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center p-2 bg-blue-50 rounded-lg">
              <BarChart className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-700 font-medium">Total: {state.deals.length} Deals</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card title="Upcoming Tasks">
          <div className="space-y-2">
            {upcomingTasks.map(task => (
              <div 
                key={task.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate('/tasks')}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <div className="text-sm text-gray-500">
                    Due {new Date(task.dueDate).toLocaleDateString()} • Assigned to {task.assignedTo}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No upcoming tasks
              </div>
            )}
          </div>
          <div className="mt-4 text-right">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/tasks')}
              icon={<ChevronRight size={16} />}
            >
              View All Tasks
            </Button>
          </div>
        </Card>

        <Card title="Recent Activity">
          <div className="space-y-4">
            {state.customers.flatMap(customer => 
              customer.activities.map(activity => ({
                ...activity,
                customerName: customer.name
              }))
            )
            .concat(
              state.deals.flatMap(deal => 
                deal.activities.map(activity => ({
                  ...activity,
                  dealId: deal.id
                }))
              )
            )
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((activity, index) => (
              <div key={activity.id || index} className="flex">
                <div className="mr-3 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>{activity.createdBy}</span>
                    <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
            {state.customers.flatMap(c => c.activities).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No recent activity
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;