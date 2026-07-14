import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { Search, Filter, MoveVertical as MoreVertical, Clock, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, User, MapPin, Calendar, Eye, CreditCard as Edit, MessageSquare, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const mockReports = [
  {
    id: 1,
    title: 'Large pothole causing vehicle damage',
    description: 'Deep pothole on Main Street intersection causing damage to vehicles. Multiple complaints received.',
    category: 'pothole',
    priority: 'high',
    status: 'pending',
    location: 'Main Street & Oak Avenue',
    reportedAt: '2024-01-20T10:30:00Z',
    assignedTo: null,
    citizenName: 'John Doe',
    citizenEmail: 'john.doe@email.com',
    photos: 2,
    comments: 3,
    estimatedCost: 850,
  },
  {
    id: 2,
    title: 'Broken streetlight creating safety hazard',
    description: 'Streetlight has been out for several days, creating safety concern for pedestrians.',
    category: 'streetlight',
    priority: 'medium',
    status: 'in-progress',
    location: 'Elm Street near Central Park',
    reportedAt: '2024-01-20T09:15:00Z',
    assignedTo: 'Sarah Johnson',
    citizenName: 'Mary Smith',
    citizenEmail: 'mary.smith@email.com',
    photos: 1,
    comments: 5,
    estimatedCost: 320,
  },
  {
    id: 3,
    title: 'Overflowing garbage bin attracting pests',
    description: 'Public garbage bin in park is consistently overflowing, attracting pests and creating unsanitary conditions.',
    category: 'garbage',
    priority: 'low',
    status: 'resolved',
    location: 'Central Park - Main Entrance',
    reportedAt: '2024-01-19T16:45:00Z',
    assignedTo: 'Mike Davis',
    citizenName: 'Lisa Johnson',
    citizenEmail: 'lisa.johnson@email.com',
    photos: 3,
    comments: 2,
    estimatedCost: 0,
    resolvedAt: '2024-01-20T14:30:00Z',
  },
];

export default function ManagementReports() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const filterOptions = [
    { key: 'all', label: t('management.reports.filters.all') },
    { key: 'pending', label: t('management.reports.filters.pending') },
    { key: 'in-progress', label: t('management.reports.filters.inProgress') },
    { key: 'resolved', label: t('management.reports.filters.resolved') },
    { key: 'high-priority', label: t('management.reports.filters.highPriority') },
  ];

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'high-priority') return matchesSearch && report.priority === 'high';
    return matchesSearch && report.status === selectedFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

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
      case 'in-progress': return AlertTriangle;
      case 'resolved': return CheckCircle2;
      default: return Clock;
    }
  };

  const renderReport = ({ item }: { item: typeof mockReports[0] }) => {
    const StatusIcon = getStatusIcon(item.status);
    const statusColor = getStatusColor(item.status);
    const priorityColor = getPriorityColor(item.priority);

    return (
      <TouchableOpacity 
        style={styles.reportCard}
        onPress={() => {
          setSelectedReport(item);
          setShowReportModal(true);
        }}
      >
        <View style={styles.reportHeader}>
          <View style={styles.reportMeta}>
            <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
            <Text style={styles.reportId}>#{item.id.toString().padStart(4, '0')}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <StatusIcon size={12} color="#FFFFFF" />
              <Text style={styles.statusText}>{item.status.replace('-', ' ')}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <Text style={styles.reportTitle}>{item.title}</Text>
        <Text style={styles.reportDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.reportDetails}>
          <View style={styles.reportDetail}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.reportDetailText}>{item.location}</Text>
          </View>
          <View style={styles.reportDetail}>
            <User size={14} color="#6B7280" />
            <Text style={styles.reportDetailText}>{item.citizenName}</Text>
          </View>
          {item.assignedTo && (
            <View style={styles.reportDetail}>
              <User size={14} color="#2563EB" />
              <Text style={[styles.reportDetailText, { color: '#2563EB' }]}>
                Assigned to {item.assignedTo}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.reportFooter}>
          <View style={styles.reportStats}>
            <Text style={styles.reportStat}>{item.photos} photos</Text>
            <Text style={styles.reportStat}>{item.comments} comments</Text>
            {item.estimatedCost > 0 && (
              <Text style={styles.reportStat}>${item.estimatedCost}</Text>
            )}
          </View>
          <Text style={styles.reportTime}>
            {new Date(item.reportedAt).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ReportDetailModal = () => {
    if (!selectedReport) return null;

    return (
      <Modal
        visible={showReportModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Report Details</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowReportModal(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.reportDetailHeader}>
              <View style={styles.reportDetailMeta}>
                <Text style={styles.reportDetailId}>
                  #{selectedReport.id.toString().padStart(4, '0')}
                </Text>
                <View style={[
                  styles.priorityBadge, 
                  { backgroundColor: getPriorityColor(selectedReport.priority) }
                ]}>
                  <Text style={styles.priorityText}>
                    {selectedReport.priority.toUpperCase()} PRIORITY
                  </Text>
                </View>
              </View>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(selectedReport.status) }
              ]}>
                <Text style={styles.statusText}>
                  {selectedReport.status.replace('-', ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.reportDetailTitle}>{selectedReport.title}</Text>
            <Text style={styles.reportDetailDescription}>{selectedReport.description}</Text>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Location & Contact</Text>
              <View style={styles.detailItem}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.detailText}>{selectedReport.location}</Text>
              </View>
              <View style={styles.detailItem}>
                <User size={16} color="#6B7280" />
                <Text style={styles.detailText}>
                  {selectedReport.citizenName} ({selectedReport.citizenEmail})
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.detailText}>
                  Reported on {new Date(selectedReport.reportedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {selectedReport.assignedTo && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Assignment</Text>
                <View style={styles.detailItem}>
                  <User size={16} color="#2563EB" />
                  <Text style={[styles.detailText, { color: '#2563EB' }]}>
                    Assigned to {selectedReport.assignedTo}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Eye size={16} color="#2563EB" />
                <Text style={styles.actionButtonText}>View Photos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageSquare size={16} color="#2563EB" />
                <Text style={styles.actionButtonText}>Comments ({selectedReport.comments})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Edit size={16} color="#2563EB" />
                <Text style={styles.actionButtonText}>Edit Status</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('management.reports.title')}</Text>
        <Text style={styles.subtitle}>{t('management.reports.subtitle')}</Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('management.reports.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
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

      <ReportDetailModal />
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    paddingVertical: 12,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  reportId: {
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
    textTransform: 'capitalize',
  },
  moreButton: {
    padding: 4,
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
  reportDetails: {
    gap: 6,
    marginBottom: 12,
  },
  reportDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportDetailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  reportStats: {
    flexDirection: 'row',
    gap: 12,
  },
  reportStat: {
    fontSize: 12,
    color: '#6B7280',
  },
  reportTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  reportDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reportDetailMeta: {
    gap: 8,
  },
  reportDetailId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reportDetailTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  reportDetailDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
});