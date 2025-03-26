// components/ViewPatient/ReportListItem.js - Updated with DELETE button handling
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, Clock, AlertCircle, Trash2 } from "lucide-react";
import Badge from "../ui/badge";
import Button from "../ui/button";

const ReportListItem = ({ report, onDeleteReport }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:border-blue-500 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-blue-50">
          <FileText className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <p className="font-medium">{report.reportType}</p>
          <p className="text-sm text-gray-500">
            Krijuar më {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="flex items-center gap-2">
          {getStatusIcon(report.status)}
          {report.status}
        </Badge>
        <div className="flex gap-2">
          <Link to={`/edit-report/${report._id}`}>
            <Button variant="ghost" size="sm">Ndrysho</Button>
          </Link>
          <Link to={`/view-report/${report._id}`}>
            <Button variant="ghost" size="sm">Shiko</Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDeleteReport(report._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportListItem;