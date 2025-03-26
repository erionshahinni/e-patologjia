// components/HealthcareInstitutions/InstitutionList.js
import React from 'react';
import {
  Building2,
  FileText,
  Calendar,
  ChevronRight
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";

const InstitutionList = ({ institutionStats, reports, onSelectInstitution }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Institucione Shendetesore</h1>
          <p className="text-gray-500 mt-1">Menaxho dhe monitoro institucionet shendetesore</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Institucionet Totale</p>
                <h3 className="text-2xl font-bold">{institutionStats.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Raportet Totale</p>
                <h3 className="text-2xl font-bold">{reports.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Muaji Aktiv</p>
                <h3 className="text-2xl font-bold">
                  {new Date().toLocaleString('default', { month: 'long' })}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista e Institucioneve</CardTitle>
          <CardDescription>Te gjitha institucionet shendetesore te regjistruara</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {institutionStats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => onSelectInstitution(stat.name)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">{stat.name}</p>
                    <div className="flex gap-4 mt-1">
                      <span className="text-sm text-gray-500">
                        {stat.total} reports total
                      </span>
                      <span className="text-sm text-green-600">
                        {stat.paid} paid
                      </span>
                      <span className="text-sm text-yellow-600">
                        {stat.pending} pending
                      </span>
                      <span className="text-sm text-red-600">
                        {stat.unpaid} unpaid
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {stat.reportTypes.slice(0, 3).map((type, i) => (
                        <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {type}
                        </span>
                      ))}
                      {stat.reportTypes.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{stat.reportTypes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}

            {institutionStats.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No institutions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default InstitutionList;