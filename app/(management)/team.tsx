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
import { Search, Plus, MoveVertical as MoreVertical, User, MapPin, Clock, CircleCheck as CheckCircle2, Phone, Mail, Calendar, Award, TrendingUp, X, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const mockTeamMembers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Senior Field Technician',
    department: 'Public Works',
    email: 'sarah.johnson@city.gov',
    phone: '+1 (555) 123-4567',
    status: 'active',
    location: 'Downtown District',
    assignedReports: 8,
    completedReports: 156,
    avgResolutionTime: 3.2,
    rating: 4.8,
    joinedDate: '2022-03-15',
    specialties: ['Potholes', 'Street Lights', 'Traffic Signs'],
    availability: 'available',
  },
  {
    id: 2,
    name: 'Mike Davis',
    role: 'Waste Management Specialist',
    department: 'Sanitation',
    email: 'mike.davis@city.gov',
    phone: '+1 (555) 234-5678',
    status: 'active',
    location: 'Central Park Area',
    assignedReports: 5,
    completedReports: 203,
    avgResolutionTime: 2.1,
    rating: 4.9,
    joinedDate: '2021-08-22',
    specialties: ['Garbage Collection', 'Recycling', 'Park Maintenance'],
    availability: 'busy',
  },
  {
    id: 3,
    name: 'Lisa Wilson',
    role: 'Parks & Recreation Coordinator',
    department: 'Parks & Recreation',
    email: 'lisa.wilson@city.gov',
    phone: '+1 (555) 345-6789',
    status: 'active',
    location: 'Riverside Park',
    assignedReports: 12,
    completedReports: 89,
    avgResolutionTime: 4.5,
    rating: 4.6,
    joinedDate: '2023-01-10',
    specialties: ['Tree Maintenance', 'Playground Equipment', 'Landscaping'],
    availability: 'available',
  },
  {
    id: 4,
    name: 'John Smith',
    role: 'Infrastructure Inspector',
    department: 'Engineering',
    email: 'john.smith@city.gov',
    phone: '+1 (555) 456-7890',
    status: 'active',
    location: 'Industrial District',
    assignedReports: 6,
    completedReports: 134,
    avgResolutionTime: 5.8,
    rating: 4.7,
    joinedDate: '2020-11-05',
    specialties: ['Road Inspection', 'Bridge Maintenance', 'Drainage Systems'],
    availability: 'offline',
  },
];

export default function ManagementTeam() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const filteredMembers = mockTeamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'offline': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const renderTeamMember = ({ item }: { item: typeof mockTeamMembers[0] }) => {
    const availabilityColor = getAvailabilityColor(item.availability);

    return (
      <TouchableOpacity 
        style={styles.memberCard}
        onPress={() => {
          setSelectedMember(item);
          setShowMemberModal(true);
        }}
      >
        <View style={styles.memberHeader}>
          <View style={styles.memberInfo}>
            <View style={styles.avatar}>
              <User size={24} color="#FFFFFF" />
            </View>
            <View style={styles.memberDetails}>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberRole}>{item.role}</Text>
              <Text style={styles.memberDepartment}>{item.department}</Text>
            </View>
          </View>
          <View style={styles.memberActions}>
            <View style={[styles.availabilityDot, { backgroundColor: availabilityColor }]} />
            <TouchableOpacity style={styles.moreButton}>
              <MoreVertical size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.memberStats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.assignedReports}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.completedReports}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.avgResolutionTime}d</Text>
            <Text style={styles.statLabel}>Avg Time</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{item.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.memberFooter}>
          <View style={styles.locationInfo}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          <View style={[styles.availabilityBadge, { backgroundColor: `${availabilityColor}15` }]}>
            <Text style={[styles.availabilityText, { color: availabilityColor }]}>
              {getAvailabilityText(item.availability)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const MemberDetailModal = () => {
    if (!selectedMember) return null;

    return (
      <Modal
        visible={showMemberModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Team Member Details</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMemberModal(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.memberProfile}>
              <View style={styles.profileAvatar}>
                <User size={32} color="#FFFFFF" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{selectedMember.name}</Text>
                <Text style={styles.profileRole}>{selectedMember.role}</Text>
                <Text style={styles.profileDepartment}>{selectedMember.department}</Text>
                <View style={styles.profileAvailability}>
                  <View style={[
                    styles.availabilityDot, 
                    { backgroundColor: getAvailabilityColor(selectedMember.availability) }
                  ]} />
                  <Text style={styles.availabilityText}>
                    {getAvailabilityText(selectedMember.availability)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.contactItem}>
                <Mail size={16} color="#6B7280" />
                <Text style={styles.contactText}>{selectedMember.email}</Text>
              </View>
              <View style={styles.contactItem}>
                <Phone size={16} color="#6B7280" />
                <Text style={styles.contactText}>{selectedMember.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.contactText}>{selectedMember.location}</Text>
              </View>
            </View>

            <View style={styles.performanceSection}>
              <Text style={styles.sectionTitle}>Performance Metrics</Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <View style={styles.metricIcon}>
                    <Clock size={20} color="#2563EB" />
                  </View>
                  <Text style={styles.metricValue}>{selectedMember.assignedReports}</Text>
                  <Text style={styles.metricLabel}>Active Reports</Text>
                </View>
                <View style={styles.metricCard}>
                  <View style={styles.metricIcon}>
                    <CheckCircle2 size={20} color="#10B981" />
                  </View>
                  <Text style={styles.metricValue}>{selectedMember.completedReports}</Text>
                  <Text style={styles.metricLabel}>Completed</Text>
                </View>
                <View style={styles.metricCard}>
                  <View style={styles.metricIcon}>
                    <TrendingUp size={20} color="#F59E0B" />
                  </View>
                  <Text style={styles.metricValue}>{selectedMember.avgResolutionTime}d</Text>
                  <Text style={styles.metricLabel}>Avg Resolution</Text>
                </View>
                <View style={styles.metricCard}>
                  <View style={styles.metricIcon}>
                    <Award size={20} color="#7C3AED" />
                  </View>
                  <Text style={styles.metricValue}>{selectedMember.rating}</Text>
                  <Text style={styles.metricLabel}>Rating</Text>
                </View>
              </View>
            </View>

            <View style={styles.specialtiesSection}>
              <Text style={styles.sectionTitle}>Specialties</Text>
              <View style={styles.specialtiesList}>
                {selectedMember.specialties.map((specialty: string, index: number) => (
                  <View key={index} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.memberActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Edit size={16} color="#2563EB" />
                <Text style={styles.actionButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Calendar size={16} color="#2563EB" />
                <Text style={styles.actionButtonText}>View Schedule</Text>
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
        <Text style={styles.title}>{t('management.team.title')}</Text>
        <Text style={styles.subtitle}>{t('management.team.subtitle')}</Text>
      </View>

      {/* Search and Add */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('management.team.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Team Stats */}
      <View style={styles.teamStats}>
        <View style={styles.teamStatCard}>
          <Text style={styles.teamStatValue}>{mockTeamMembers.length}</Text>
          <Text style={styles.teamStatLabel}>Total Members</Text>
        </View>
        <View style={styles.teamStatCard}>
          <Text style={styles.teamStatValue}>
            {mockTeamMembers.filter(m => m.availability === 'available').length}
          </Text>
          <Text style={styles.teamStatLabel}>Available</Text>
        </View>
        <View style={styles.teamStatCard}>
          <Text style={styles.teamStatValue}>
            {mockTeamMembers.reduce((sum, m) => sum + m.assignedReports, 0)}
          </Text>
          <Text style={styles.teamStatLabel}>Active Reports</Text>
        </View>
        <View style={styles.teamStatCard}>
          <Text style={styles.teamStatValue}>
            {(mockTeamMembers.reduce((sum, m) => sum + m.rating, 0) / mockTeamMembers.length).toFixed(1)}
          </Text>
          <Text style={styles.teamStatLabel}>Avg Rating</Text>
        </View>
      </View>

      {/* Team Members List */}
      <FlatList
        data={filteredMembers}
        renderItem={renderTeamMember}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <MemberDetailModal />
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
    marginBottom: 20,
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
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  teamStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  teamStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  teamStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  memberInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  memberDepartment: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  memberActions: {
    alignItems: 'center',
    gap: 8,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  moreButton: {
    padding: 4,
  },
  memberStats: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  memberFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '500',
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
  memberProfile: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
  },
  profileDepartment: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  profileAvailability: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
  },
  performanceSection: {
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  specialtiesSection: {
    marginBottom: 24,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  memberActions: {
    flexDirection: 'row',
    gap: 12,
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