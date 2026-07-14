import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Users, 
  MapPin,
  Clock,
  Globe,
  Download,
  Upload,
  RefreshCw,
  ChevronRight,
  X,
  Save
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

export default function ManagementSettings() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState({
    newReports: true,
    statusUpdates: true,
    teamAssignments: true,
    systemAlerts: false,
    emailDigest: true,
  });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configType, setConfigType] = useState('');

  const settingSections = [
    {
      title: 'System Configuration',
      items: [
        {
          icon: Database,
          title: 'Database Settings',
          subtitle: 'Manage data retention and backup settings',
          action: () => openConfigModal('database'),
          color: '#2563EB',
        },
        {
          icon: Users,
          title: 'User Management',
          subtitle: 'Configure user roles and permissions',
          action: () => openConfigModal('users'),
          color: '#059669',
        },
        {
          icon: MapPin,
          title: 'Geographic Settings',
          subtitle: 'Set service areas and boundaries',
          action: () => openConfigModal('geography'),
          color: '#7C3AED',
        },
        {
          icon: Clock,
          title: 'Response Time Targets',
          subtitle: 'Configure SLA and response time goals',
          action: () => openConfigModal('sla'),
          color: '#F59E0B',
        },
      ],
    },
    {
      title: 'Security & Privacy',
      items: [
        {
          icon: Shield,
          title: 'Security Settings',
          subtitle: 'Manage authentication and access controls',
          action: () => openConfigModal('security'),
          color: '#DC2626',
        },
        {
          icon: Database,
          title: 'Data Privacy',
          subtitle: 'Configure data retention and privacy policies',
          action: () => openConfigModal('privacy'),
          color: '#6B7280',
        },
      ],
    },
    {
      title: 'Integration & API',
      items: [
        {
          icon: RefreshCw,
          title: 'API Configuration',
          subtitle: 'Manage external integrations and webhooks',
          action: () => openConfigModal('api'),
          color: '#2563EB',
        },
        {
          icon: Download,
          title: 'Data Export',
          subtitle: 'Export reports and analytics data',
          action: () => openConfigModal('export'),
          color: '#10B981',
        },
        {
          icon: Upload,
          title: 'Data Import',
          subtitle: 'Import historical data and configurations',
          action: () => openConfigModal('import'),
          color: '#F59E0B',
        },
      ],
    },
  ];

  const openConfigModal = (type: string) => {
    setConfigType(type);
    setShowConfigModal(true);
  };

  const NotificationSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Notification Settings</Text>
      <View style={styles.notificationsList}>
        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>New Reports</Text>
            <Text style={styles.notificationSubtitle}>Get notified when new reports are submitted</Text>
          </View>
          <Switch
            value={notifications.newReports}
            onValueChange={(value) => setNotifications(prev => ({ ...prev, newReports: value }))}
            trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
            thumbColor={notifications.newReports ? '#2563EB' : '#F3F4F6'}
          />
        </View>
        
        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Status Updates</Text>
            <Text style={styles.notificationSubtitle}>Notifications when report status changes</Text>
          </View>
          <Switch
            value={notifications.statusUpdates}
            onValueChange={(value) => setNotifications(prev => ({ ...prev, statusUpdates: value }))}
            trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
            thumbColor={notifications.statusUpdates ? '#2563EB' : '#F3F4F6'}
          />
        </View>
        
        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Team Assignments</Text>
            <Text style={styles.notificationSubtitle}>Alerts for new team assignments</Text>
          </View>
          <Switch
            value={notifications.teamAssignments}
            onValueChange={(value) => setNotifications(prev => ({ ...prev, teamAssignments: value }))}
            trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
            thumbColor={notifications.teamAssignments ? '#2563EB' : '#F3F4F6'}
          />
        </View>
        
        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>System Alerts</Text>
            <Text style={styles.notificationSubtitle}>Critical system notifications</Text>
          </View>
          <Switch
            value={notifications.systemAlerts}
            onValueChange={(value) => setNotifications(prev => ({ ...prev, systemAlerts: value }))}
            trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
            thumbColor={notifications.systemAlerts ? '#2563EB' : '#F3F4F6'}
          />
        </View>
        
        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>Email Digest</Text>
            <Text style={styles.notificationSubtitle}>Daily summary email</Text>
          </View>
          <Switch
            value={notifications.emailDigest}
            onValueChange={(value) => setNotifications(prev => ({ ...prev, emailDigest: value }))}
            trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
            thumbColor={notifications.emailDigest ? '#2563EB' : '#F3F4F6'}
          />
        </View>
      </View>
    </View>
  );

  const ConfigModal = () => {
    const getModalTitle = () => {
      switch (configType) {
        case 'database': return 'Database Settings';
        case 'users': return 'User Management';
        case 'geography': return 'Geographic Settings';
        case 'sla': return 'Response Time Targets';
        case 'security': return 'Security Settings';
        case 'privacy': return 'Data Privacy';
        case 'api': return 'API Configuration';
        case 'export': return 'Data Export';
        case 'import': return 'Data Import';
        default: return 'Settings';
      }
    };

    return (
      <Modal
        visible={showConfigModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{getModalTitle()}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowConfigModal(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {configType === 'database' && (
              <View>
                <Text style={styles.configSectionTitle}>Data Retention</Text>
                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>Report Data Retention (days)</Text>
                  <TextInput
                    style={styles.configInput}
                    value="365"
                    placeholder="365"
                  />
                </View>
                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>Backup Frequency</Text>
                  <TouchableOpacity style={styles.configSelect}>
                    <Text style={styles.configSelectText}>Daily</Text>
                    <ChevronRight size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {configType === 'sla' && (
              <View>
                <Text style={styles.configSectionTitle}>Response Time Targets</Text>
                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>High Priority (hours)</Text>
                  <TextInput
                    style={styles.configInput}
                    value="4"
                    placeholder="4"
                  />
                </View>
                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>Medium Priority (hours)</Text>
                  <TextInput
                    style={styles.configInput}
                    value="24"
                    placeholder="24"
                  />
                </View>
                <View style={styles.configItem}>
                  <Text style={styles.configLabel}>Low Priority (hours)</Text>
                  <TextInput
                    style={styles.configInput}
                    value="72"
                    placeholder="72"
                  />
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.saveButton}>
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('management.settings.title')}</Text>
          <Text style={styles.subtitle}>{t('management.settings.subtitle')}</Text>
        </View>

        <NotificationSettings />

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language & Localization</Text>
          <LanguageSelector showAsMenuItem={true} />
        </View>

        {/* Configuration Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingsList}>
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={itemIndex}
                    style={styles.settingItem}
                    onPress={item.action}
                  >
                    <View style={[styles.settingIcon, { backgroundColor: `${item.color}15` }]}>
                      <IconComponent size={20} color={item.color} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* System Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Information</Text>
          <View style={styles.systemInfo}>
            <View style={styles.systemInfoItem}>
              <Text style={styles.systemInfoLabel}>Version</Text>
              <Text style={styles.systemInfoValue}>2.1.0</Text>
            </View>
            <View style={styles.systemInfoItem}>
              <Text style={styles.systemInfoLabel}>Last Updated</Text>
              <Text style={styles.systemInfoValue}>January 20, 2024</Text>
            </View>
            <View style={styles.systemInfoItem}>
              <Text style={styles.systemInfoLabel}>Database Status</Text>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                <Text style={[styles.systemInfoValue, { color: '#10B981' }]}>Healthy</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <ConfigModal />
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
  section: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  notificationsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  systemInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  systemInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  systemInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  systemInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  configSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  configItem: {
    marginBottom: 16,
  },
  configLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  configInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#374151',
  },
  configSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  configSelectText: {
    fontSize: 16,
    color: '#374151',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});