import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Activity, Bell, CircleCheck as CheckCircle2, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface Update {
  id: string;
  type: 'status_change' | 'assignment' | 'new_report' | 'resolution';
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  reportId?: string;
}

export default function RealTimeUpdates() {
  const [updates, setUpdates] = useState<Update[]>([]);

  // Simulate real-time updates
  useEffect(() => {
    const mockUpdates: Update[] = [
      {
        id: '1',
        type: 'new_report',
        message: 'New pothole report received on Main Street',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        priority: 'high',
        reportId: '#1234'
      },
      {
        id: '2',
        type: 'assignment',
        message: 'Report #1233 assigned to Team Alpha',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        priority: 'medium'
      },
      {
        id: '3',
        type: 'status_change',
        message: 'Streetlight repair marked as in-progress',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        priority: 'medium',
        reportId: '#1232'
      },
      {
        id: '4',
        type: 'resolution',
        message: 'Garbage collection issue resolved',
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        priority: 'low',
        reportId: '#1231'
      }
    ];

    setUpdates(mockUpdates);

    // Simulate new updates coming in
    const interval = setInterval(() => {
      const newUpdate: Update = {
        id: Date.now().toString(),
        type: ['new_report', 'assignment', 'status_change', 'resolution'][Math.floor(Math.random() * 4)] as any,
        message: `System update at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any
      };

      setUpdates(prev => [newUpdate, ...prev.slice(0, 9)]); // Keep only 10 most recent
    }, 30000); // New update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getUpdateIcon = (type: Update['type']) => {
    switch (type) {
      case 'new_report': return Bell;
      case 'assignment': return Activity;
      case 'status_change': return Clock;
      case 'resolution': return CheckCircle2;
      default: return AlertTriangle;
    }
  };

  const getPriorityColor = (priority: Update['priority']) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Activity size={16} color="#2563EB" />
        <Text style={styles.title}>Real-Time Updates</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <ScrollView style={styles.updatesList} showsVerticalScrollIndicator={false}>
        {updates.map((update) => {
          const IconComponent = getUpdateIcon(update.type);
          const priorityColor = getPriorityColor(update.priority);

          return (
            <View key={update.id} style={styles.updateItem}>
              <View style={[styles.updateIcon, { backgroundColor: `${priorityColor}15` }]}>
                <IconComponent size={14} color={priorityColor} />
              </View>
              <View style={styles.updateContent}>
                <Text style={styles.updateMessage}>{update.message}</Text>
                <View style={styles.updateMeta}>
                  <Text style={styles.updateTime}>{formatTimeAgo(update.timestamp)}</Text>
                  {update.reportId && (
                    <Text style={styles.reportId}>{update.reportId}</Text>
                  )}
                </View>
              </View>
              <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
  },
  updatesList: {
    flex: 1,
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  updateIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateContent: {
    flex: 1,
  },
  updateMessage: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 18,
  },
  updateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  updateTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  reportId: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  priorityIndicator: {
    width: 3,
    height: 28,
    borderRadius: 2,
  },
});
</parameter>