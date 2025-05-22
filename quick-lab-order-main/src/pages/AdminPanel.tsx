
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTestOrders } from '@/context/TestOrderContext';
import OrdersList from '../components/admin-elab/OrdersList';
import InsuranceProcessing from '../components/admin-elab/InsuranceProcessing';
import ResultsUpload from '../components/admin-elab/ResultsUpload';
import AdminStatistics from '../components/admin-elab/AdminStatistics';
import AdminHeader from '../components/admin-elab/AdminHeader';

const AdminPanel = () => {
  const { getAllUserOrders } = useTestOrders();
  const allOrders = getAllUserOrders();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader />
      
      <Tabs defaultValue="dashboard" className="mt-8">
        <TabsList className="grid grid-cols-4 md:w-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="orders">All Orders</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="dashboard">
            <AdminStatistics orders={allOrders} />
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersList orders={allOrders} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insurance">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <InsuranceProcessing 
                  orders={allOrders.filter(order => order.paymentMethod === 'insurance')} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Upload Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ResultsUpload orders={allOrders} />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
