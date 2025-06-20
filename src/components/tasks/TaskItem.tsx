import React from 'react';
import { Task } from '../../types';
import { Calendar, Clock, User } from 'lucide-react';
import Button from '../common/Button';
import { useCrm } from '../../context/CrmContext';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { dispatch } = useCrm();

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate if task is overdue
  const isOverdue = () => {
    if (task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today;
  };

  // Calculate days remaining or overdue
  const getDaysText = () => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    }
    if (diffDays === 0) {
      return 'Due today';
    }
    return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  const handleComplete = () => {
    dispatch({
      type: 'COMPLETE_TASK',
      payload: task.id
    });
  };

  return (
    <div className={`
      bg-white p-4 rounded-lg shadow mb-3 
      ${isOverdue() ? 'border-l-4 border-red-500' : 
        task.completed ? 'border-l-4 border-green-500' : 
        task.priority === 'high' ? 'border-l-4 border-orange-500' : ''}
    `}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.title}
        </h3>
        <div className={`
          text-xs font-medium px-2 py-1 rounded
          ${isOverdue() ? 'bg-red-100 text-red-800' : 
            task.completed ? 'bg-green-100 text-green-800' : 
            'bg-gray-100 text-gray-800'}
        `}>
          {task.completed ? 'Completed' : getDaysText()}
        </div>
      </div>
      
      <p className={`text-sm mb-3 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
        {task.description}
      </p>
      
      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          {task.assignedTo}
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(task.dueDate)}
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {task.priority} priority
        </div>
      </div>
      
      {task.relatedTo && (
        <div className="text-xs text-gray-500 mb-3">
          Related to: <span className="font-medium capitalize">{task.relatedTo.type}</span>
        </div>
      )}
      
      {!task.completed && (
        <div className="mt-2">
          <Button 
            variant="success" 
            size="sm" 
            onClick={handleComplete}
          >
            Mark Complete
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;