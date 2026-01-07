// components/HealthcareInstitutions/InstitutionDetail.js
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Activity,
  AlertCircle,
  FileText,
  XCircle
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

const InstitutionDetail = ({ 
  selectedInstitution, 
  institutionStats, 
  reports, 
  onBack, 
  onSelectMonth 
}) => {
  const [monthlyStats, setMonthlyStats] = useState([]);

  // Calculate monthly stats when institution changes
  useEffect(() => {
    if (selectedInstitution && Array.isArray(reports)) {
      const stats = calculateMonthlyStats(selectedInstitution, reports);
      setMonthlyStats(stats);
    }
  }, [selectedInstitution, reports]);

  // Get selected institution data
  const institutionData = institutionStats.find(stat => stat.name === selectedInstitution) || null;

  return (
    <>
      <button
        onClick={onBack}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="font-medium">Kthehu tek Institucionet</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{selectedInstitution}</h1>
            <p className="text-gray-600 mt-1">Detajet e Institucionit Shendetesor</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Reports</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">Monthly Overview</CardTitle>
                    <CardDescription className="mt-1">Report registration and status by month</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {monthlyStats.map((stat, index) => (
                    <div
                      key={index}
                      onClick={() => onSelectMonth(stat.monthYear)}
                      className="p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="font-semibold text-gray-900">{stat.displayMonth}</span>
                        </div>
                        <Badge className="bg-gray-100 text-gray-800 font-semibold">
                          {stat.total} raporte
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span className="text-emerald-600 font-medium">{stat.completed} Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-amber-500" />
                          <span className="text-amber-600 font-medium">{stat.controlled} Controlled</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-indigo-500" />
                          <span className="text-gray-700 font-medium">${stat.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                        {stat.referringDoctors.slice(0, 3).map((doctor, i) => (
                          <span key={i} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md font-medium">
                            Dr. {doctor}
                          </span>
                        ))}
                        {stat.referringDoctors.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{stat.referringDoctors.length - 3} më shumë
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {monthlyStats.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 font-medium">Nuk ka të dhëna mujore</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Activity className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">Institution Summary</CardTitle>
                    <CardDescription className="mt-1">Overall statistics and performance</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {institutionData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total Reports</p>
                          <p className="text-xl font-bold text-gray-900 mt-1">{institutionData.total}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total Amount</p>
                          <p className="text-xl font-bold text-gray-900 mt-1">${institutionData.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col items-center gap-2 p-4 bg-emerald-50 rounded-lg">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Paid</p>
                        <p className="text-2xl font-bold text-emerald-700">{institutionData.paid}</p>
                      </div>

                      <div className="flex flex-col items-center gap-2 p-4 bg-amber-50 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-amber-600" />
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pending</p>
                        <p className="text-2xl font-bold text-amber-700">{institutionData.pending}</p>
                      </div>

                      <div className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-lg">
                        <XCircle className="h-6 w-6 text-red-600" />
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Unpaid</p>
                        <p className="text-2xl font-bold text-red-700">{institutionData.unpaid}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {!institutionData && (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 font-medium">Nuk ka të dhëna për institucionin</p>
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

export default InstitutionDetail;