
import React from 'react';
import Header from '@/components/Layout/Header';
import RPAList from '@/components/RPAs/RPAList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const RPAPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Header pageTitle="Meus RPAs" />
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo RPA
        </Button>
      </div>
      <RPAList />
    </div>
  );
};

export default RPAPage;
