// components/Dashboard/SearchFilterBar.js
import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchFilterBar = ({ searchTerm, setSearchTerm, sortBy, setSortBy }) => {
  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Kerko sipas emrit ose numrit te references..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white min-w-[180px]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="none">Sorto sipas...</option>
            <option value="status">Statusit</option>
            <option value="reportType">Lloji Raportit</option>
            <option value="institution">Institucionit</option>
            <option value="doctor">Mjekut</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;