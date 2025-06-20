import React from 'react';
import { DealStage } from '../../types';
import Badge from './Badge';

interface StatusBadgeProps {
  stage: DealStage;
}

const getVariantForStage = (stage: DealStage) => {
  switch (stage) {
    case DealStage.Lead:
      return 'secondary';
    case DealStage.Qualification:
      return 'info';
    case DealStage.DealStructuring:
      return 'primary';
    case DealStage.DealApproved:
      return 'warning';
    case DealStage.Settlement:
      return 'warning';
    case DealStage.Delivery:
      return 'warning';
    case DealStage.Completed:
      return 'success';
    default:
      return 'secondary';
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ stage }) => {
  const variant = getVariantForStage(stage);
  
  return <Badge variant={variant}>{stage}</Badge>;
};

export default StatusBadge;