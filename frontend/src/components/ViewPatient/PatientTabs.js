// components/ViewPatient/PatientTabs.js
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Activity } from "lucide-react";
import { Link } from 'react-router-dom';
import Button from "../ui/button";
import PersonalInfoCard from './PersonalInfoCard';
import MedicalInfoCard from './MedicalInfoCard';
import ReportListItem from './ReportListItem';

const PatientTabs = ({ patient, reports, latestReport, onDeleteReport }) => {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Përmbledhje</TabsTrigger>
        <TabsTrigger value="reports">Raportet</TabsTrigger>
        <TabsTrigger value="history">Historiku</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <PersonalInfoCard patient={patient} />

          {/* Medical Information Card */}
          {latestReport && <MedicalInfoCard latestReport={latestReport} />}
        </div>

        {/* Recent Reports */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Raportet e Fundit</CardTitle>
            <CardDescription>Raportet dhe ekzaminimet e fundit mjekësore</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.length > 0 ? (
                reports.slice(0, 5).map((report) => (
                  <ReportListItem 
                    key={report._id} 
                    report={report} 
                    onDeleteReport={onDeleteReport} 
                  />
                ))
              ) : (
                <EmptyReportsList patientId={patient._id} />
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Reports Tab */}
      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle>Të Gjitha Raportet</CardTitle>
            <CardDescription>Historia e plotë e raporteve mjekësore</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <ReportListItem 
                    key={report._id} 
                    report={report} 
                    onDeleteReport={onDeleteReport} 
                  />
                ))
              ) : (
                <EmptyReportsList patientId={patient._id} />
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* History Tab */}
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Historia Mjekësore</CardTitle>
            <CardDescription>Historiku i plotë i pacientit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <ReportListItem 
                  key={report._id} 
                  report={report} 
                  onDeleteReport={onDeleteReport} 
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

// Helper component for empty reports list
const EmptyReportsList = ({ patientId }) => (
  <div className="text-center py-12">
    <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
    <p className="text-gray-500 mb-4">Nuk ka raporte</p>
    <Link to={`/add-report/${patientId}`}>
      <Button>Krijo Raportin e Parë</Button>
    </Link>
  </div>
);

export default PatientTabs;