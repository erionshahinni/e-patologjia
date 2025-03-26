// components/ReferringDoctors/DoctorDetail.js
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  UserCircle,
  Calendar,
  CheckCircle2,
  Activity,
  AlertCircle,
  FileText,
  XCircle,
  Building2
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import Badge from "../../components/ui/badge";
import { calculateMonthlyStats } from './utils';

const DoctorDetail = ({ 
  selectedDoctor, 
  doctorStats, 
  reports, 
  onBack, 
  onSelectMonth 
}) => {
  const [monthlyStats, setMonthlyStats] = useState([]);

  // Calculate monthly stats when doctor changes
  useEffect(() => {
    if (selectedDoctor && Array.isArray(reports)) {
      const stats = calculateMonthlyStats(selectedDoctor, reports);
      setMonthlyStats(stats);
    }
  }, [selectedDoctor, reports]);

  // Get selected doctor data
  const doctorData = doctorStats.find(stat => stat.name === selectedDoctor) || null;

  return (
    <>
      <button
        onClick={onBack}
        className="inline-flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kthehu tek Mjekët
      </button>

      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
          <UserCircle className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dr. {selectedDoctor}</h1>
          <p className="text-gray-500">Detajet e Mjekut Referues</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
                <CardDescription>Report registration and status by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyStats.map((stat, index) => (
                    <div
                      key={index}
                      onClick={() => onSelectMonth(stat.monthYear)}
                      className="p-4 rounded-lg border hover:border-blue-500 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-50">
                            <Calendar className="h-5 w-5 text-blue-500" />
                          </div>
                          <span className="font-medium">{stat.displayMonth}</span>
                        </div>
                        <Badge className="bg-gray-100 text-gray-800">
                          {stat.total} reports
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">{stat.completed} Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-yellow-500" />
                          <span className="text-yellow-600">{stat.controlled} Controlled</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">${stat.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {stat.institutions.slice(0, 3).map((institution, i) => (
                          <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {institution}
                          </span>
                        ))}
                        {stat.institutions.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{stat.institutions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {monthlyStats.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No monthly data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Doctor Summary</CardTitle>
                <CardDescription>Overall statistics and performance</CardDescription>
              </CardHeader>
              <CardContent>
                {doctorData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Total Reports</p>
                          <p className="font-medium">{doctorData.total}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="font-medium">${doctorData.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-500">Paid</p>
                          <p className="font-medium">{doctorData.paid}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="text-sm text-gray-500">Pending</p>
                          <p className="font-medium">{doctorData.pending}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-sm text-gray-500">Unpaid</p>
                          <p className="font-medium">{doctorData.unpaid}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Institutions</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {doctorData.institutions.map((institution, i) => (
                          <span key={i} className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {institution}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {!doctorData && (
                  <div className="text-center py-8">
                    <UserCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No doctor data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          {/* Reports tab content */}
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Select a month to view reports</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          {/* Analytics tab content */}
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Analytics coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DoctorDetail;