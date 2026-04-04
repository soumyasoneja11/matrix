import { useCallback } from 'react';
import type { AnalyticsSummary } from './useAnalyticsData';

export const useCsvExport = () => {
  const exportCsv = useCallback((data: AnalyticsSummary) => {
    const lines: string[] = [];

    // Section 1: Summary Statistics
    lines.push('=== SUMMARY STATISTICS ===');
    lines.push('Metric,Value');
    lines.push(`Total Patients,${data.totalPatients}`);
    lines.push(`Today's Intake,${data.todaysIntake}`);
    lines.push(`Discharges,${data.discharges}`);
    lines.push(`Handoffs,${data.handoffs}`);
    lines.push(`Average Age,${data.averageAge}`);
    lines.push(`Total Events,${data.totalEvents}`);
    lines.push('');

    // Section 2: Priority Distribution
    lines.push('=== PRIORITY DISTRIBUTION ===');
    lines.push('Priority,Count,Percentage');
    data.priorityDistribution.forEach((p) => {
      lines.push(`${p.label},${p.count},${p.percentage}%`);
    });
    lines.push('');

    // Section 3: Event Types
    lines.push('=== EVENT TYPES ===');
    lines.push('Event Type,Count');
    data.eventTypes.forEach((e) => {
      lines.push(`${e.label},${e.count}`);
    });
    lines.push('');

    // Section 4: Recent Activity
    lines.push('=== RECENT ACTIVITY ===');
    lines.push('Event Type,Description,Actor,Timestamp');
    data.recentActivity.forEach((a) => {
      // Escape commas in description
      const desc = a.description.includes(',') ? `"${a.description}"` : a.description;
      lines.push(`${a.eventType},${desc},${a.actor},${a.timestamp}`);
    });

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'er_analytics.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }, []);

  return { exportCsv };
};
