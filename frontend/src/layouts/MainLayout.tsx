import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { TabBar, type TabId } from '../components/TabBar';
import { PatientTriagePage } from '../pages/PatientTriagePage';
import { ResourceAllocationPage } from '../pages/ResourceAllocationPage';
import { StaffDirectoryPage } from '../pages/StaffDirectoryPage';
import { StaffManagementPage } from '../pages/StaffManagementPage';
import { MyWorklistPage } from '../pages/MyWorklistPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { RecycleBinPage } from '../pages/RecycleBinPage';
import { patientAPI } from '../services/api';
import type { Patient } from '../types/patient';

export function MainLayout() {
  const [activeTab, setActiveTab] = useState<TabId>('patient-triage');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchPatients = async () => {
    try {
      const res = await patientAPI.getAll();
      setPatients(res.data);
      setLastUpdated(new Date());
    } catch {
      // API not available — use mock empty data
    }
  };

  useEffect(() => {
    fetchPatients();
    const interval = setInterval(fetchPatients, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeQueue = {
    critical: patients.filter((p) => p.triageLevel === 'CRITICAL').length,
    urgent: patients.filter((p) => p.triageLevel === 'URGENT').length,
    standard: patients.filter((p) => p.triageLevel === 'STANDARD').length,
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'patient-triage':
        return <PatientTriagePage patients={patients} lastUpdated={lastUpdated} onRefresh={fetchPatients} />;
      case 'resource-allocation':
        return <ResourceAllocationPage />;
      case 'staff-directory':
        return <StaffDirectoryPage />;
      case 'staff-management':
        return <StaffManagementPage />;
      case 'my-worklist':
        return <MyWorklistPage />;
      case 'analytics':
        return <AnalyticsPage patients={patients} />;
      case 'recycle-bin':
        return <RecycleBinPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar activeQueue={activeQueue} />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="p-6 animate-fade-in">
        {renderPage()}
      </main>
    </div>
  );
}
