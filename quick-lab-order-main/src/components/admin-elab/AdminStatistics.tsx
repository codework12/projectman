
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestOrder } from '@/context/TestOrderContext';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminStatisticsProps {
  orders: TestOrder[];
}

const AdminStatistics: React.FC<AdminStatisticsProps> = ({ orders }) => {
  // Get current date and date 30 days ago
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Filter orders for the last 30 days
  const recentOrders = orders.filter(order => 
    new Date(order.orderDate) >= thirtyDaysAgo
  );
  
  // Group orders by date
  const ordersByDate = recentOrders.reduce((acc, order) => {
    const dateStr = new Date(order.orderDate).toLocaleDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = { count: 0, revenue: 0 };
    }
    
    acc[dateStr].count += 1;
    acc[dateStr].revenue += order.totalAmount || 0;
    
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);
  
  // Create chart data
  const chartData = Object.keys(ordersByDate).map(date => ({
    date,
    orders: ordersByDate[date].count,
    revenue: ordersByDate[date].revenue
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate totals and statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'processing').length;
  const scheduledOrders = orders.filter(order => order.status === 'scheduled').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  
  const totalRevenue = orders
    .filter(order => order.paymentStatus === 'paid')
    .reduce((total, order) => total + (order.totalAmount || 0), 0);
    
  const pendingRevenue = orders
    .filter(order => order.paymentStatus === 'pending')
    .reduce((total, order) => total + (order.totalAmount || 0), 0);
    
  // Calculate test statistics
  const testCounts = orders.reduce((acc, order) => {
    order.tests.forEach(item => {
      const testId = item.test.id;
      if (!acc[testId]) {
        acc[testId] = {
          name: item.test.name,
          code: item.test.code,
          count: 0
        };
      }
      acc[testId].count += item.quantity;
    });
    return acc;
  }, {} as Record<string, { name: string; code: string; count: number }>);
  
  // Get top 5 tests
  const topTests = Object.values(testCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-gray-500 mt-1">Lifetime orders</p>
            <div className="grid grid-cols-3 mt-4 text-sm">
              <div>
                <p className="text-gray-500">Pending</p>
                <p className="font-medium">{pendingOrders}</p>
              </div>
              <div>
                <p className="text-gray-500">Scheduled</p>
                <p className="font-medium">{scheduledOrders}</p>
              </div>
              <div>
                <p className="text-gray-500">Completed</p>
                <p className="font-medium">{completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {((totalRevenue / (totalRevenue + pendingRevenue)) * 100).toFixed(1)}% collection rate
              </span>
            </p>
            <div className="mt-4">
              <p className="text-gray-500 text-sm">Pending Revenue</p>
              <p className="font-medium">${pendingRevenue.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Insurance Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => 
                order.paymentMethod === 'insurance' && 
                order.paymentStatus === 'pending'
              ).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Pending verification</p>
            <div className="mt-4">
              <p className="text-gray-500 text-sm">Approved Insurance</p>
              <p className="font-medium">
                {orders.filter(order => 
                  order.paymentMethod === 'insurance' && 
                  order.paymentStatus === 'paid'
                ).length}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentOrders.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Orders in the last 30 days</p>
            <div className="grid grid-cols-2 mt-4 text-sm">
              <div>
                <p className="text-gray-500">This Week</p>
                <p className="font-medium">
                  {orders.filter(order => {
                    const orderDate = new Date(order.orderDate);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return orderDate >= weekAgo;
                  }).length}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Today</p>
                <p className="font-medium">
                  {orders.filter(order => {
                    const orderDate = new Date(order.orderDate);
                    const today = new Date();
                    return orderDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Order Trends (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#3b82f6" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTests.map((test, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{test.name}</p>
                    <p className="text-xs text-gray-500">{test.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{test.count}</p>
                    <p className="text-xs text-gray-500">orders</p>
                  </div>
                </div>
              ))}
              
              {topTests.length === 0 && (
                <p className="text-gray-500 text-center py-6">
                  No test data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStatistics;
