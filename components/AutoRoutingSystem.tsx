import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Zap, MapPin, Users, Clock } from 'lucide-react-native';

interface AutoRoutingSystemProps {
  report: {
    category: string;
    priority: string;
    location: {
      latitude: number;
      longitude: number;
    };
    description: string;
  };
}

export default function AutoRoutingSystem({ report }: AutoRoutingSystemProps) {
  // Simulate automated routing logic
  const routeReport = () => {
    const departmentMapping = {
      pothole: 'Public Works',
      streetlight: 'Electrical Department',
      garbage: 'Sanitation',
      safety: 'Traffic Safety',
      parks: 'Parks & Recreation',
      construction: 'Engineering'
    };

    const priorityResponseTime = {
      high: '2-4 hours',
      medium: '24-48 hours',
      low: '3-5 days'
    };

    const assignedDepartment = departmentMapping[report.category as keyof typeof departmentMapping] || 'General Services';
    const estimatedResponse = priorityResponseTime[report.priority as keyof typeof priorityResponseTime] || '1-2 days';

    return {
      department: assignedDepartment,
      estimatedResponse,
      confidence: 95,
      autoAssigned: true
    };
  };

  const routing = routeReport();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Zap size={16} color="#2563EB" />
        <Text style={styles.title}>Auto-Routing System</Text>
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>{routing.confidence}%</Text>
        </View>
      </View>

      <View style={styles.routingDetails}>
        <View style={styles.routingItem}>
          <Users size={14} color="#6B7280" />
          <Text style={styles.routingLabel}>Department:</Text>
          <Text style={styles.routingValue}>{routing.department}</Text>
        </View>

        <View style={styles.routingItem}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.routingLabel}>Est. Response:</Text>
          <Text style={styles.routingValue}>{routing.estimatedResponse}</Text>
        </View>

        <View style={styles.routingItem}>
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.routingLabel}>Priority:</Text>
          <Text style={[styles.routingValue, { 
            color: report.priority === 'high' ? '#EF4444' : 
                   report.priority === 'medium' ? '#F59E0B' : '#10B981' 
          }]}>
            {report.priority.toUpperCase()}
          </Text>
        </View>
      </View>

      {routing.autoAssigned && (
        <View style={styles.autoAssignedIndicator}>
          <Text style={styles.autoAssignedText}>
            ✓ Automatically routed based on category, location, and priority
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  routingDetails: {
    gap: 8,
  },
  routingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routingLabel: {
    fontSize: 14,
    color: '#64748B',
    minWidth: 80,
  },
  routingValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
  },
  autoAssignedIndicator: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
  },
  autoAssignedText: {
    fontSize: 12,
    color: '#1E40AF',
    textAlign: 'center',
  },
});
</parameter>