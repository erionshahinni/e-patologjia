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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Institucione Shendetesore</h1>
            <p className="text-gray-600 mt-1">Menaxho dhe monitoro institucionet shendetesore</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Institucionet Totale</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{institutionStats.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Raportet Totale</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{reports.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Muaji Aktiv</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {new Date().toLocaleString('default', { month: 'long' })}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Lista e Institucioneve</CardTitle>
              <CardDescription className="mt-1">Te gjitha institucionet shendetesore te regjistruara</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {institutionStats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer group"
                onClick={() => onSelectInstitution(stat.name)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{stat.name}</p>
                    <div className="flex gap-4 mt-1.5 flex-wrap">
                      <span className="text-xs font-medium text-gray-600">
                        {stat.total} raporte total
                      </span>
                      <span className="text-xs font-medium text-emerald-600">
                        {stat.paid} paguar
                      </span>
                      <span className="text-xs font-medium text-amber-600">
                        {stat.pending} në pritje
                      </span>
                      <span className="text-xs font-medium text-red-600">
                        {stat.unpaid} pa paguar
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {stat.reportTypes.slice(0, 3).map((type, i) => (
                        <span key={i} className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                          {type}
                        </span>
                      ))}
                      {stat.reportTypes.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{stat.reportTypes.length - 3} më shumë
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0 ml-4" />
              </div>
            ))}

            {institutionStats.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 font-medium">Nuk u gjet asnjë institucion</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default InstitutionList;