
import React from 'react';
import Header from '@/components/Layout/Header';
import DashboardOverview from '@/components/Dashboard/DashboardOverview';

const Index: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <Header pageTitle="Dashboard" />
      <DashboardOverview />
    </div>
  );
};

export default Index;
