import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Clock, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Car, Lightbulb, Trash2, TriangleAlert as AlertTriangle, TreePine, Construction, Calendar, MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return '#F59E0B';
    case 'in-progress': return '#2563EB';
    case 'resolved': return '#10B981';
    default: return '#6B7280';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return Clock;
    case 'in-progress': return AlertCircle;
    case 'resolved': return CheckCircle2;
    default: return Clock;
  }
};

const getCategoryIcon = (type: string) => {
  switch (type) {
    case 'pothole': return Car;
    case 'streetlight': return Lightbulb;
    case 'garbage': return Trash2;
    case 'safety': return AlertTriangle;
    case 'parks': return TreePine;
    case 'construction': return Construction;
    default: return AlertTriangle;
  }
};

const mockReports = [
  {
    id: 1,
    title: 'Large pothole on Main Street',
    description: 'Deep pothole causing damage to vehicles near the intersection with Oak Ave.',
    type: 'pothole',
    status: 'in-progress',
    location: 'Main Street & Oak Avenue',
    dateReported: '2024-01-15',
    lastUpdate: '2024-01-18',
    reportNumber: '#RPT001',
  },
  {
    id: 2,
    title: 'Broken streetlight',
    description: 'Streetlight has been out for several days, creating safety concern.',
    type: 'streetlight',
    status: 'pending',
    location: 'Elm Street near Park',
    dateReported: '2024-01-14',
    lastUpdate: '2024-01-14',
    reportNumber: '#RPT002',
  },
  {
    id: 3,
    title: 'Overflowing garbage bin',
    description: 'Public garbage bin in park is overflowing, attracting pests.',
    type: 'garbage',
    status: 'resolved',
    location: 'Central Park - Main Entrance',
    dateReported: '2024-01-10',
    lastUpdate: '2024-01-16',
    reportNumber: '#RPT003',
  },
  {
    id: 4,
    title: 'Missing stop sign',
    description: 'Stop sign was damaged in recent storm and needs replacement.',
    type: 'safety',
    status: 'pending',
    location: 'Pine Street & 2nd Avenue',
    dateReported: '2024-01-12',
    lastUpdate: '2024-01-12',
    reportNumber: '#RPT004',
  },
  {
    id: 5,
    title: 'Damaged park bench',
    description: 'Wooden bench is broken and poses safety risk to users.',
    type: 'parks',
    status: 'in-progress',
    location: 'Riverside Park - Trail Section',
    dateReported: '2024-01-08',
    lastUpdate: '2024-01-17',
    reportNumber: '#RPT005',
  },
];

export default function ReportsScreen() {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredReports = selectedFilter === 'all' 
    ? mockReports 
    : mockReports.filter(report => report.status === selectedFilter);

  const renderReport = ({ item }: { item: typeof mockReports[0] }) => {
    const StatusIcon = getStatusIcon(item.status);
    const CategoryIcon = getCategoryIcon(item.type);
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <View style={styles.reportMeta}>
            <View style={styles.categoryIcon}>
              <CategoryIcon size={18} color="#6B7280" />
            </View>
            <Text style={styles.reportNumber}>{item.reportNumber}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <StatusIcon size={12} color="#FFFFFF" />
            <Text style={styles.statusText}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.reportTitle}>{item.title}</Text>
        <Text style={styles.reportDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.reportFooter}>
          <View style={styles.locationInfo}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          <View style={styles.dateInfo}>
            <Calendar size={14} color="#6B7280" />
            <Text style={styles.dateText}>{item.dateReported}</Text>
          </View>
        </View>

        {item.status !== 'pending' && (
          <View style={styles.updateInfo}>
            <Text style={styles.updateText}>
              {t('reports.lastUpdated', { date: item.lastUpdate })}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const filterOptions = [
    { key: 'all', label: t('reports.filters.all') },
    { key: 'pending', label: t('reports.filters.pending') },
    { key: 'in-progress', label: t('reports.filters.inProgress') },
    { key: 'resolved', label: t('reports.filters.resolved') },
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('reports.status.pending');
      case 'in-progress': return t('reports.status.inProgress');
      case 'resolved': return t('reports.status.resolved');
      default: return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('reports.title')}</Text>
        <Text style={styles.subtitle}>{t('reports.subtitle')}</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterTab,
              selectedFilter === option.key && styles.activeFilterTab,
            ]}
            onPress={() => setSelectedFilter(option.key)}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === option.key && styles.activeFilterTabText,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reports List */}
      <FlatList
        data={filteredReports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {mockReports.length}
          </Text>
          <Text style={styles.summaryLabel}>{t('reports.summary.totalReports')}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {mockReports.filter(r => r.status === 'resolved').length}
          </Text>
          <Text style={styles.summaryLabel}>{t('reports.summary.resolved')}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {mockReports.filter(r => r.status === 'in-progress').length}
          </Text>
          <Text style={styles.summaryLabel}>{t('reports.summary.inProgress')}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  updateInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  updateText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
});