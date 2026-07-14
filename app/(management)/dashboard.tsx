import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import { TrendingUp, TrendingDown, Clock, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Users, MapPin, Calendar, Filter, Download, RefreshCw, Bell, Zap, FileText, Activity } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const mockStats = {
  totalReports: 1247,
  pendingReports: 89,
  inProgressReports: 156,
  resolvedReports: 1002,
  avgResolutionTime: 4.2,
  citizenSatisfaction: 87,
  activeTeamMembers: 24,
  monthlyTrend: 12.5,
  realTimeReports: 23,
  priorityAreas: 5,
  responseRate: 94.2
};

const mockRecentReports = [
  {
    id: 1,
    title: 'Pothole on Main Street',
    category: 'pothole',
    priority: 'high',
    status: 'pending',
    location: 'Main St & Oak Ave',
    reportedAt: '2024-01-20T10:30:00Z',
    assignedTo: 'John Smith',
    autoRouted: true,
    estimatedResponse: '2-4 hours'
  },
  {
    id: 2,
    title: 'Broken streetlight',
    category: 'streetlight',
    priority: 'medium',
    status: 'in-progress',
    location: 'Elm Street',
    reportedAt: '2024-01-20T09:15:00Z',
    assignedTo: 'Sarah Johnson',
    autoRouted: true,
    estimatedResponse: '24-48 hours'
  },
  {
    id: 3,
    title: 'Overflowing garbage bin',
    category: 'garbage',
    priority: 'low',
    status: 'resolved',
    location: 'Central Park',
    reportedAt: '2024-01-19T16:45:00Z',
    assignedTo: 'Mike Davis',
    autoRouted: true,
    estimatedResponse: '3-5 days',
    resolvedAt: '2024-01-20T14:30:00Z'
  }
];

const mockPriorityAreas = [
  { area: 'Downtown District', reports: 45, trend: 'up', severity: 'high' },
  { area: 'Industrial Zone', reports: 32, trend: 'stable', severity: 'medium' },
  { area: 'Residential North', reports: 28, trend: 'down', severity: 'medium' },
  { area: 'Park District', reports: 19, trend: 'up', severity: 'low' },
  { area: 'Commercial Center', reports: 15, trend: 'stable', severity: 'low' },
];

const mockRealTimeActivity = [
  { id: 1, type: 'new_report', message: 'New pothole report on Main St', time: '2 min ago', priority: 'high' },
  { id: 2, type: 'assignment', message: 'Report #1234 assigned to Team Alpha', time: '5 min ago', priority: 'medium' },
  { id: 3, type: 'resolution', message: 'Streetlight issue resolved on Elm St', time: '8 min ago', priority: 'low' },
  { id: 4, type: 'new_report', message: 'Safety concern reported at Central Park', time: '12 min ago', priority: 'high' },
];

export default function ManagementDashboard() {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showRealTimePanel, setShowRealTimePanel] = useState(true);

  const StatCard = ({ title, value, change, icon: Icon, color, subtitle }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
          <Icon size={20} color={color} />
        </View>
        <View style={styles.statChange}>
          {change > 0 ? (
            <TrendingUp size={16} color="#10B981" />
          ) : (
            <TrendingDown size={16} color="#EF4444" />
          )}
          <Text style={[styles.changeText, { color: change > 0 ? '#10B981' : '#EF4444' }]}>
            {Math.abs(change)}%
          </Text>
        </View>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ReportCard = ({ report }: any) => {
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

    return (
      <TouchableOpacity style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <View style={styles.reportMeta}>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(report.priority) }]} />
            <Text style={styles.reportId}>#{report.id.toString().padStart(4, '0')}</Text>
            {report.autoRouted && (
              <View style={styles.autoRoutedBadge}>
                <Zap size={10} color="#2563EB" />
                <Text style={styles.autoRoutedText}>Auto-routed</Text>
              </View>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
            <Text style={styles.statusText}>{report.status.replace('-', ' ')}</Text>
          </View>
        </View>
        
        <Text style={styles.reportTitle}>{report.title}</Text>
        
        <View style={styles.reportDetails}>
          <View style={styles.reportDetail}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.reportDetailText}>{report.location}</Text>
          </View>
          <View style={styles.reportDetail}>
            <Users size={14} color="#6B7280" />
            <Text style={styles.reportDetailText}>{report.assignedTo}</Text>
          </View>
          <View style={styles.reportDetail}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.reportDetailText}>ETA: {report.estimatedResponse}</Text>
          </View>
        </View>
        
        <Text style={styles.reportTime}>
          {new Date(report.reportedAt).toLocaleDateString()} at {new Date(report.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
    );
  };

  const PriorityAreaCard = ({ area }: any) => {
    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case 'high': return '#EF4444';
        case 'medium': return '#F59E0B';
        case 'low': return '#10B981';
        default: return '#6B7280';
      }
    };

    const getTrendIcon = (trend: string) => {
      switch (trend) {
        case 'up': return TrendingUp;
        case 'down': return TrendingDown;
        default: return Activity;
      }
    };

    const TrendIcon = getTrendIcon(area.trend);

    return (
      <View style={styles.priorityAreaCard}>
        <View style={styles.priorityAreaHeader}>
          <Text style={styles.priorityAreaName}>{area.area}</Text>
          <View style={styles.priorityAreaMeta}>
            <TrendIcon size={14} color={getSeverityColor(area.severity)} />
            <Text style={[styles.priorityAreaReports, { color: getSeverityColor(area.severity) }]}>
              {area.reports}
            </Text>
          </View>
        </View>
        <View style={[styles.severityBar, { backgroundColor: `${getSeverityColor(area.severity)}20` }]}>
          <View 
            style={[
              styles.severityFill, 
              { 
                backgroundColor: getSeverityColor(area.severity),
                width: `${Math.min((area.reports / 50) * 100, 100)}%`
              }
            ]} 
          />
        </View>
      </View>
    );
  };

  const RealTimeActivityItem = ({ activity }: any) => {
    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'new_report': return Bell;
        case 'assignment': return Users;
        case 'resolution': return CheckCircle2;
        default: return Activity;
      }
    };

    const getActivityColor = (priority: string) => {
      switch (priority) {
        case 'high': return '#EF4444';
        case 'medium': return '#F59E0B';
        case 'low': return '#10B981';
        default: return '#6B7280';
      }
    };

    const ActivityIcon = getActivityIcon(activity.type);

    return (
      <View style={styles.activityItem}>
        <View style={[styles.activityIcon, { backgroundColor: `${getActivityColor(activity.priority)}15` }]}>
          <ActivityIcon size={14} color={getActivityColor(activity.priority)} />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityMessage}>{activity.message}</Text>
          <Text style={styles.activityTime}>{activity.time}</Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{t('management.dashboard.title')}</Text>
            <Text style={styles.subtitle}>{t('management.dashboard.subtitle')}</Text>
            <TouchableOpacity 
              style={styles.backToCitizenButton}
              onPress={() => router.push('/(tabs)/')}
            >
              <Text style={styles.backToCitizenText}>← Back to Citizen View</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.actionButton, showRealTimePanel && styles.activeActionButton]}
              onPress={() => setShowRealTimePanel(!showRealTimePanel)}
            >
              <Activity size={20} color={showRealTimePanel ? "#2563EB" : "#6B7280"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <RefreshCw size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Download size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Real-time Activity Panel */}
        {showRealTimePanel && (
          <View style={styles.realTimePanel}>
            <View style={styles.realTimePanelHeader}>
              <View style={styles.realTimePanelTitle}>
                <Activity size={16} color="#2563EB" />
                <Text style={styles.realTimePanelTitleText}>Live Activity Feed</Text>
              </View>
              <View style={styles.realTimeBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            <FlatList
              data={mockRealTimeActivity}
              renderItem={({ item }) => <RealTimeActivityItem activity={item} />}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activityList}
            />
          </View>
        )}

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['day', 'week', 'month', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.activePeriodButtonText
              ]}>
                {t(`management.dashboard.periods.${period}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title={t('management.dashboard.stats.totalReports')}
            value={mockStats.totalReports.toLocaleString()}
            change={mockStats.monthlyTrend}
            icon={FileText}
            color="#2563EB"
            subtitle="This month"
          />
          <StatCard
            title={t('management.dashboard.stats.pendingReports')}
            value={mockStats.pendingReports}
            change={-8.2}
            icon={Clock}
            color="#F59E0B"
            subtitle="Awaiting assignment"
          />
          <StatCard
            title="Real-time Reports"
            value={mockStats.realTimeReports}
            change={45.2}
            icon={Activity}
            color="#7C3AED"
            subtitle="Last 24 hours"
          />
          <StatCard
            title="Priority Areas"
            value={mockStats.priorityAreas}
            change={12.1}
            icon={MapPin}
            color="#DC2626"
            subtitle="High volume zones"
          />
          <StatCard
            title={t('management.dashboard.stats.inProgress')}
            value={mockStats.inProgressReports}
            change={15.3}
            icon={AlertTriangle}
            color="#2563EB"
            subtitle="Being resolved"
          />
          <StatCard
            title={t('management.dashboard.stats.resolved')}
            value={mockStats.resolvedReports.toLocaleString()}
            change={22.1}
            icon={CheckCircle2}
            color="#10B981"
            subtitle="Completed"
          />
          <StatCard
            title={t('management.dashboard.stats.avgResolution')}
            value={`${mockStats.avgResolutionTime} days`}
            change={-12.5}
            icon={TrendingUp}
            color="#7C3AED"
            subtitle="Average time"
          />
          <StatCard
            title="Response Rate"
            value={`${mockStats.responseRate}%`}
            change={3.8}
            icon={Zap}
            color="#059669"
            subtitle="Auto-routing success"
          />
          <StatCard
            title={t('management.dashboard.stats.satisfaction')}
            value={`${mockStats.citizenSatisfaction}%`}
            change={5.7}
            icon={Users}
            color="#059669"
            subtitle="Citizen rating"
          />
        </View>

        {/* Priority Areas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority Areas</Text>
          <Text style={styles.sectionSubtitle}>
            Areas with high report volume requiring immediate attention
          </Text>
          <View style={styles.priorityAreasList}>
            {mockPriorityAreas.map((area, index) => (
              <PriorityAreaCard key={index} area={area} />
            ))}
          </View>
        </View>

        {/* Recent Reports */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('management.dashboard.recentReports')}</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={16} color="#6B7280" />
              <Text style={styles.filterButtonText}>{t('management.dashboard.filter')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reportsList}>
            {mockRecentReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </View>
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>{t('management.dashboard.viewAllReports')}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('management.dashboard.quickActions')}</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Users size={24} color="#2563EB" />
              </View>
              <Text style={styles.quickActionText}>{t('management.dashboard.assignTeam')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#F0FDF4' }]}>
                <MapPin size={24} color="#10B981" />
              </View>
              <Text style={styles.quickActionText}>{t('management.dashboard.viewMap')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFFBEB' }]}>
                <Calendar size={24} color="#F59E0B" />
              </View>
              <Text style={styles.quickActionText}>{t('management.dashboard.schedule')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  backToCitizenButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  backToCitizenText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeActionButton: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  realTimePanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  realTimePanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  realTimePanelTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  realTimePanelTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  realTimeBadge: {
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
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    minWidth: 200,
    gap: 8,
  },
  activityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 10,
    color: '#6B7280',
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activePeriodButton: {
    backgroundColor: '#2563EB',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  reportsList: {
    gap: 12,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
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
  autoRoutedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  autoRoutedText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#2563EB',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reportId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  reportDetails: {
    gap: 8,
    marginBottom: 8,
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
  reportTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priorityAreasList: {
    gap: 12,
  },
  priorityAreaCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priorityAreaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityAreaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  priorityAreaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priorityAreaReports: {
    fontSize: 14,
    fontWeight: '600',
  },
  severityBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  severityFill: {
    height: '100%',
    borderRadius: 3,
  },
  viewAllButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
});