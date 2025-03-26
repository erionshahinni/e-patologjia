import React from 'react';
import { Tab, TabGroup, TabList, TabPanel } from '@headlessui/react';

const Tabs = ({ children, ...props }) => (
  <TabGroup {...props}>
    {children}
  </TabGroup>
);

const TabsList = ({ children, ...props }) => (
  <TabList {...props} className="flex space-x-2 mb-4">
    {children}
  </TabList>
);

const TabsTrigger = ({ children, ...props }) => (
  <Tab {...props} className={({ selected }) => 
    `px-4 py-2 rounded ${selected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`
  }>
    {children}
  </Tab>
);

const TabsContent = ({ children, ...props }) => (
  <TabPanel {...props} className="mt-4">
    {children}
  </TabPanel>
);

export { Tabs, TabsList, TabsTrigger, TabsContent };