// components/Dashboard/SearchFilterBar.js
import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const SearchFilterBar = ({ searchTerm, setSearchTerm, sortBy, setSortBy }) => {
  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[300px]">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Kerko sipas emrit ose numrit te references..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <FunnelIcon className="w-5 h-5 text-slate-400" />
        <select
          className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
  );
};

export default SearchFilterBar;