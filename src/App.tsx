import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers/Customers';
import CustomerDetail from './pages/Customers/CustomerDetail';
import Deals from './pages/Deals/Deals';
import DealDetail from './pages/Deals/DealDetail';
import Dealerships from './pages/Dealerships/Dealerships';
import DealershipDetail from './pages/Dealerships/DealershipDetail';
import Tasks from './pages/Tasks/Tasks';
import Reports from './pages/Reports';
import { CrmProvider } from './context/CrmContext';

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk publishable key');
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <CrmProvider>
        <Router>
          <Routes>
            <Route
              path="/*"
              element={
                <>
                  <SignedIn>
                    <Layout>
                      <Routes>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="customers/:id" element={<CustomerDetail />} />
                        <Route path="deals" element={<Deals />} />
                        <Route path="deals/:id" element={<DealDetail />} />
                        <Route path="dealerships" element={<Dealerships />} />
                        <Route path="dealerships/:id" element={<DealershipDetail />} />
                        <Route path="tasks" element={<Tasks />} />
                        <Route path="reports" element={<Reports />} />
                      </Routes>
                    </Layout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </Router>
      </CrmProvider>
    </ClerkProvider>
  );
}

export default App;