import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  Customer, 
  Deal, 
  Dealership, 
  Task, 
  CreditRating,
  DealType,
  DealStage
} from '../types';
import { mockCustomers, mockDeals, mockDealerships, mockTasks } from '../data/mockData';

// Define the state shape
interface CrmState {
  customers: Customer[];
  deals: Deal[];
  dealerships: Dealership[];
  tasks: Task[];
}

// Define action types
type CrmAction = 
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'ADD_DEAL'; payload: Deal }
  | { type: 'UPDATE_DEAL'; payload: Deal }
  | { type: 'UPDATE_DEAL_STAGE'; payload: { dealId: string; stage: DealStage } }
  | { type: 'ADD_DEALERSHIP'; payload: Dealership }
  | { type: 'UPDATE_DEALERSHIP'; payload: Dealership }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'COMPLETE_TASK'; payload: string };

// Initial state with mock data
const initialState: CrmState = {
  customers: mockCustomers,
  deals: mockDeals,
  dealerships: mockDealerships,
  tasks: mockTasks,
};

// Reducer function
const crmReducer = (state: CrmState, action: CrmAction): CrmState => {
  switch (action.type) {
    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(customer => 
          customer.id === action.payload.id ? action.payload : customer
        ),
      };
    case 'ADD_DEAL':
      return {
        ...state,
        deals: [...state.deals, action.payload],
      };
    case 'UPDATE_DEAL':
      return {
        ...state,
        deals: state.deals.map(deal => 
          deal.id === action.payload.id ? action.payload : deal
        ),
      };
    case 'UPDATE_DEAL_STAGE':
      return {
        ...state,
        deals: state.deals.map(deal => 
          deal.id === action.payload.dealId 
            ? { ...deal, stage: action.payload.stage } 
            : deal
        ),
      };
    case 'ADD_DEALERSHIP':
      return {
        ...state,
        dealerships: [...state.dealerships, action.payload],
      };
    case 'UPDATE_DEALERSHIP':
      return {
        ...state,
        dealerships: state.dealerships.map(dealership => 
          dealership.id === action.payload.id ? action.payload : dealership
        ),
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload 
            ? { ...task, completed: true, completedAt: new Date().toISOString() } 
            : task
        ),
      };
    default:
      return state;
  }
};

// Create context
interface CrmContextType {
  state: CrmState;
  dispatch: React.Dispatch<CrmAction>;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

// Provider component
export const CrmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(crmReducer, initialState);

  return (
    <CrmContext.Provider value={{ state, dispatch }}>
      {children}
    </CrmContext.Provider>
  );
};

// Custom hook for using the context
export const useCrm = () => {
  const context = useContext(CrmContext);
  if (context === undefined) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};