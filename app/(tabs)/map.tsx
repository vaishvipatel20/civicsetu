import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { MapPin, Filter, Layers, Navigation, Car, Lightbulb, Trash2, TriangleAlert as AlertTriangle, TreePine, Construction, Clock, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Search, X, Calendar, User, Zap } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

// Ahmedabad-based mock data with real coordinates
const mockIssues = [
  { 
    id: 1, 
    type: 'pothole', 
    lat: 23.0225, 
    lng: 72.5714, 
    status: 'pending', 
    priority: 'high',
    title: 'Large pothole on SG Highway',
    location: 'SG Highway, Bodakdev',
    reportedAt: '2024-01-20T10:30:00Z',
    assignedTo: 'Rajesh Patel',
    reportVolume: 8,
    autoRouted: true,
    department: 'Public Works'
  },
  { 
    id: 2, 
    type: 'streetlight', 
    lat: 23.0395, 
    lng: 72.5660, 
    status: 'in-progress', 
    priority: 'medium',
    title: 'Broken streetlight near Vastrapur Lake',
    location: 'Vastrapur Lake Road',
    reportedAt: '2024-01-20T09:15:00Z',
    assignedTo: 'Priya Shah',
    reportVolume: 3,
    autoRouted: true,
    department: 'Electrical'
  },
  { 
    id: 3, 
    type: 'garbage', 
    lat: 23.0726, 
    lng: 72.5905, 
    status: 'resolved', 
    priority: 'low',
    title: 'Overflowing garbage bin at Law Garden',
    location: 'Law Garden, Ellisbridge',
    reportedAt: '2024-01-19T16:45:00Z',
    assignedTo: 'Amit Kumar',
    reportVolume: 1,
    autoRouted: true,
    department: 'Sanitation'
  },
  { 
    id: 4, 
    type: 'safety', 
    lat: 23.0258, 
    lng: 72.5873, 
    status: 'pending', 
    priority: 'high',
    title: 'Missing traffic signal at CG Road',
    location: 'CG Road, Navrangpura',
    reportedAt: '2024-01-20T08:20:00Z',
    assignedTo: null,
    reportVolume: 12,
    autoRouted: true,
    department: 'Traffic Safety'
  },
  { 
    id: 5, 
    type: 'parks', 
    lat: 23.0732, 
    lng: 72.6347, 
    status: 'in-progress', 
    priority: 'medium',
    title: 'Damaged benches at Sabarmati Riverfront',
    location: 'Sabarmati Riverfront',
    reportedAt: '2024-01-18T14:30:00Z',
    assignedTo: 'Neha Joshi',
    reportVolume: 2,
    autoRouted: true,
    department: 'Parks & Recreation'
  },
  { 
    id: 6, 
    type: 'construction', 
    lat: 23.0449, 
    lng: 72.5197, 
    status: 'pending', 
    priority: 'low',
    title: 'Road construction debris on Sarkhej Road',
    location: 'Sarkhej Road, Makarba',
    reportedAt: '2024-01-19T11:15:00Z',
    assignedTo: null,
    reportVolume: 1,
    autoRouted: false,
    department: 'Public Works'
  },
  { id: 7, type: 'pothole', lat: 40.7595, lng: -73.9845, status: 'pending', priority: 'high', title: 'Multiple potholes cluster', assignedTo: null, reportVolume: 15, autoRouted: true, department: 'Public Works' },
  { id: 8, type: 'safety', lat: 40.7610, lng: -73.9820, status: 'pending', priority: 'high', title: 'Dangerous intersection', assignedTo: null, reportVolume: 9, autoRouted: true, department: 'Traffic Safety' },
];

const priorityZones = [
  { id: 1, name: 'Downtown Cluster', lat: 40.7590, lng: -73.9850, radius: 200, reportCount: 23, severity: 'high' },
  { id: 2, name: 'Industrial Zone', lat: 40.7615, lng: -73.9780, radius: 150, reportCount: 12, severity: 'medium' },
  { id: 3, name: 'Park District', lat: 40.7580, lng: -73.9855, radius: 100, reportCount: 8, severity: 'low' },
];

export default function ManagementMapScreen() {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [showLayers, setShowLayers] = useState(false);
  const [showPriorityZones, setShowPriorityZones] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // Get current location on component mount
  React.useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const fullAddress = address[0] ? 
        `${address[0].streetNumber || ''} ${address[0].street || ''}, ${address[0].city || 'Ahmedabad'}, ${address[0].region || 'Gujarat'}`.trim().replace(/^,\s*/, '') : 
        'Ahmedabad, Gujarat';

      setCurrentLocation({
        coords: location.coords,
        address: fullAddress,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      // Set default Ahmedabad location
      setCurrentLocation({
        coords: { latitude: 23.0225, longitude: 72.5714 },
        address: 'Ahmedabad, Gujarat, India',
      });
    }
  };

  const categories = [
    { id: 'all', name: t('management.map.categories.all'), icon: MapPin, color: '#6B7280' },
    { id: 'pothole', name: t('management.map.categories.pothole'), icon: Car, color: '#EF4444' },
    { id: 'streetlight', name: t('management.map.categories.streetlight'), icon: Lightbulb, color: '#F59E0B' },
    { id: 'garbage', name: t('management.map.categories.garbage'), icon: Trash2, color: '#10B981' },
    { id: 'safety', name: t('management.map.categories.safety'), icon: AlertTriangle, color: '#DC2626' },
    { id: 'parks', name: t('management.map.categories.parks'), icon: TreePine, color: '#059669' },
    { id: 'construction', name: t('management.map.categories.construction'), icon: Construction, color: '#7C3AED' },
  ];

  const filteredIssues = mockIssues.filter(issue => {
    const matchesCategory = selectedFilter === 'all' || issue.type === selectedFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesLocation = !locationFilter || issue.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesSearch = !searchQuery || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPriority && matchesStatus && matchesLocation && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'in-progress': return '#2563EB';
      case 'resolved': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
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

  const MapControls = () => (
    <View style={styles.mapControls}>
      <TouchableOpacity style={styles.controlButton}>
        <Navigation size={20} color="#374151" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.controlButton, showLayers && styles.activeControlButton]}
        onPress={() => setShowLayers(!showLayers)}
      >
        <Layers size={20} color={showLayers ? "#2563EB" : "#374151"} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.controlButton}>
        <Filter size={20} color="#374151" />
      </TouchableOpacity>
    </View>
  );

  const LayersPanel = () => {
    if (!showLayers) return null;

    return (
      <View style={styles.layersPanel}>
        <Text style={styles.layersPanelTitle}>Map Layers</Text>
        <TouchableOpacity style={styles.layerOption}>
          <View style={styles.layerCheckbox} />
          <Text style={styles.layerText}>Traffic</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.layerOption}>
          <View style={[styles.layerCheckbox, showHeatmap && styles.layerCheckboxActive]} />
          <Text style={styles.layerText}>Report Heatmap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.layerOption}>
          <View style={styles.layerCheckbox} />
          <Text style={styles.layerText}>Team Locations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.layerOption}>
          <View style={[styles.layerCheckbox, showPriorityZones && styles.layerCheckboxActive]} />
          <Text style={styles.layerText}>Priority Areas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.layerOption}>
          <View style={[styles.layerCheckbox, styles.layerCheckboxActive]} />
          <Text style={styles.layerText}>Auto-routing</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const AdvancedFiltersModal = () => (
    <Modal
      visible={showAdvancedFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Advanced Filters</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowAdvancedFilters(false)}
          >
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Search */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Search</Text>
            <View style={styles.searchContainer}>
              <Search size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by title or location..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Priority Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Priority</Text>
            <View style={styles.filterOptions}>
              {['all', 'high', 'medium', 'low'].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.filterOption,
                    priorityFilter === priority && styles.activeFilterOption
                  ]}
                  onPress={() => setPriorityFilter(priority)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    priorityFilter === priority && styles.activeFilterOptionText
                  ]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Status Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Status</Text>
            <View style={styles.filterOptions}>
              {['all', 'pending', 'in-progress', 'resolved'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    statusFilter === status && styles.activeFilterOption
                  ]}
                  onPress={() => setStatusFilter(status)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    statusFilter === status && styles.activeFilterOptionText
                  ]}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Location</Text>
            <TextInput
              style={styles.locationInput}
              placeholder="Filter by area (e.g., Bodakdev, CG Road)"
              value={locationFilter}
              onChangeText={setLocationFilter}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Quick Location Filters */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Quick Areas</Text>
            <View style={styles.quickAreas}>
              {['SG Highway', 'CG Road', 'Vastrapur', 'Bodakdev', 'Navrangpura', 'Sabarmati'].map((area) => (
                <TouchableOpacity
                  key={area}
                  style={styles.quickAreaChip}
                  onPress={() => setLocationFilter(area)}
                >
                  <Text style={styles.quickAreaText}>{area}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Clear Filters */}
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => {
              setSelectedFilter('all');
              setPriorityFilter('all');
              setStatusFilter('all');
              setLocationFilter('');
              setSearchQuery('');
            }}
          >
            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('management.map.title')}</Text>
          <Text style={styles.subtitle}>{t('management.map.subtitle')}</Text>
          {currentLocation && (
            <View style={styles.currentLocationCard}>
              <MapPin size={16} color="#FFFFFF" />
              <Text style={styles.currentLocationText}>{currentLocation.address}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Search and Advanced Filters */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInputMain}
            placeholder="Search reports..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity
          style={[styles.advancedFilterButton, (priorityFilter !== 'all' || statusFilter !== 'all' || locationFilter) && styles.activeAdvancedFilter]}
          onPress={() => setShowAdvancedFilters(true)}
        >
          <Filter size={20} color={(priorityFilter !== 'all' || statusFilter !== 'all' || locationFilter) ? "#FFFFFF" : "#6B7280"} />
        </TouchableOpacity>
      </View>

      {/* Filter Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedFilter === category.id;
          
          return (
            <TouchableOpacity
              key={category.id}
              style={styles.filterChip}
              onPress={() => setSelectedFilter(category.id)}
            >
              <LinearGradient
                colors={isSelected ? [category.color, `${category.color}CC`] : ['#FFFFFF', '#F8F9FA']}
                style={styles.filterChipGradient}
              >
                <IconComponent
                  size={16}
                  color={isSelected ? '#FFFFFF' : category.color}
                />
                <Text style={[
                  styles.filterText,
                  isSelected && { color: '#FFFFFF', fontWeight: '600' }
                ]}>
                  {category.name}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <LinearGradient
          colors={['#4facfe', '#00f2fe']}
          style={styles.mapGradient}
        >
          {/* Interactive Management Map Background */}
          <View style={styles.mapBackground}>
            <View style={styles.mapGrid}>
              {/* Enhanced grid for management view */}
              {Array.from({ length: 10 }).map((_, i) => (
                <View key={`h-${i}`} style={[styles.gridLine, styles.horizontalLine, { top: `${i * 10}%` }]} />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <View key={`v-${i}`} style={[styles.gridLine, styles.verticalLine, { left: `${i * 12.5}%` }]} />
              ))}
            </View>
            
            {/* District Boundaries */}
            <View style={[styles.district, { top: '10%', left: '15%', width: '25%', height: '30%' }]}>
              <Text style={styles.districtLabel}>North Zone</Text>
            </View>
            <View style={[styles.district, { top: '10%', left: '45%', width: '30%', height: '25%' }]}>
              <Text style={styles.districtLabel}>Central Zone</Text>
            </View>
            <View style={[styles.district, { top: '40%', left: '20%', width: '35%', height: '25%' }]}>
              <Text style={styles.districtLabel}>West Zone</Text>
            </View>
            <View style={[styles.district, { top: '45%', left: '60%', width: '25%', height: '30%' }]}>
              <Text style={styles.districtLabel}>East Zone</Text>
            </View>
            <View style={[styles.district, { top: '70%', left: '25%', width: '40%', height: '20%' }]}>
              <Text style={styles.districtLabel}>South Zone</Text>
            </View>
            
            {/* Major Roads and Infrastructure */}
            <View style={[styles.majorRoad, { top: '25%', left: '5%', width: '90%', height: 4 }]} />
          </View>

          {/* Current Location Marker */}
          {currentLocation && (
            <View style={styles.currentLocationMarker}>
              <View style={styles.currentMarkerPulse} />
              <View style={styles.currentMarkerCenter} />
            </View>
          )}
        </LinearGradient>

        {/* Map Markers Simulation */}
        <View style={styles.markersOverlay}>
          {/* Priority Zones */}
          {showPriorityZones && priorityZones.map((zone) => (
            <View
              key={`zone-${zone.id}`}
              style={[
                styles.priorityZone,
                {
                  left: 50 + (zone.id * 80),
                  top: 60 + (zone.id * 40),
                  width: zone.radius / 2,
                  height: zone.radius / 2,
                  backgroundColor: zone.severity === 'high' ? 'rgba(239, 68, 68, 0.2)' : 
                                   zone.severity === 'medium' ? 'rgba(245, 158, 11, 0.2)' : 
                                   'rgba(16, 185, 129, 0.2)',
                  borderColor: zone.severity === 'high' ? '#EF4444' : 
                              zone.severity === 'medium' ? '#F59E0B' : 
                              '#10B981',
                }
              ]}
            >
              <Text style={[styles.zoneLabel, { 
                color: zone.severity === 'high' ? '#EF4444' : 
                       zone.severity === 'medium' ? '#F59E0B' : 
                       '#10B981'
              }]}>
                {zone.reportCount}
              </Text>
            </View>
          ))}

          {/* Report Markers */}
          {filteredIssues.slice(0, 10).map((issue, index) => {
            const category = categories.find(cat => cat.id === issue.type);
            const IconComponent = category?.icon || MapPin;
            const statusColor = getStatusColor(issue.status);
            const priorityColor = getPriorityColor(issue.priority);
            const markerSize = Math.max(28, Math.min(40, 28 + (issue.reportVolume * 2)));
            // Position issues at specific locations on the dummy map
            const getIssuePosition = (issueId: number) => {
              const positions = [
                { x: 28, y: 32 }, // Near intersection
                { x: 52, y: 48 }, // Main road
                { x: 76, y: 28 }, // Near park
                { x: 42, y: 68 }, // Residential area
                { x: 18, y: 55 }, // Side street
                { x: 65, y: 38 }, // Commercial area
                { x: 35, y: 25 }, // Highway
                { x: 58, y: 72 }, // Near river
                { x: 82, y: 45 }, // Industrial area
                { x: 25, y: 78 }, // Suburb
              ];
              return positions[issueId - 1] || positions[0];
            };
            
            const position = getIssuePosition(issue.id);
            
            return (
              <TouchableOpacity
                key={issue.id}
                style={[
                  styles.marker,
                  {
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    width: markerSize,
                    height: markerSize,
                    borderRadius: markerSize / 2,
                  }
                ]}
                onPress={() => setSelectedIssue(issue)}
              >
                <LinearGradient
                  colors={[statusColor, `${statusColor}CC`]}
                  style={[styles.markerGradient, {
                    borderColor: priorityColor,
                    borderWidth: issue.priority === 'high' ? 3 : 1,
                  }]}
                >
                  <IconComponent size={14} color="#FFFFFF" />
                  {issue.reportVolume > 1 && (
                    <View style={styles.volumeBadge}>
                      <Text style={styles.volumeText}>{issue.reportVolume}</Text>
                    </View>
                  )}
                  {issue.autoRouted && (
                    <View style={styles.autoRoutedIndicator}>
                      <Zap size={8} color="#FFD700" />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Map Controls */}
        <MapControls />
        <LayersPanel />
        
        {/* Expand/Collapse Button */}
        {isMapExpanded && (
          <TouchableOpacity 
            style={styles.collapseButton}
            onPress={() => setIsMapExpanded(false)}
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Issue Details Modal */}
      {selectedIssue && (
        <View style={styles.issueModal}>
          <LinearGradient
            colors={['#FFFFFF', '#F8F9FA']}
            style={styles.issueCard}
          >
            <View style={styles.issueHeader}>
              <View style={styles.issueHeaderLeft}>
                <Text style={styles.issueTitle}>{selectedIssue.title}</Text>
                <View style={styles.issueMeta}>
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(selectedIssue.priority) }]} />
                  <Text style={styles.priorityText}>{selectedIssue.priority.toUpperCase()} PRIORITY</Text>
                  {selectedIssue.autoRouted && (
                    <View style={styles.autoRoutedBadge}>
                      <Zap size={10} color="#2563EB" />
                      <Text style={styles.autoRoutedText}>AUTO-ROUTED</Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={() => setSelectedIssue(null)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.issueStatus}>
              <LinearGradient
                colors={[getStatusColor(selectedIssue.status), `${getStatusColor(selectedIssue.status)}CC`]}
                style={styles.statusBadge}
              >
                <Text style={styles.statusText}>{selectedIssue.status.replace('-', ' ').toUpperCase()}</Text>
              </LinearGradient>
            </View>
            
            <Text style={styles.issueLocation}>📍 {selectedIssue.location}</Text>
            
            <Text style={styles.issueDepartment}>🏢 {selectedIssue.department}</Text>
            
            {selectedIssue.reportVolume > 1 && (
              <Text style={styles.issueVolume}>
                📊 {selectedIssue.reportVolume} similar reports in this area
              </Text>
            )}
            
            {selectedIssue.assignedTo ? (
              <Text style={styles.assignedTo}>👤 Assigned to {selectedIssue.assignedTo}</Text>
            ) : (
              <Text style={styles.unassigned}>⚠️ Unassigned</Text>
            )}
            
            <Text style={styles.issueDate}>
              📅 {new Date(selectedIssue.reportedAt).toLocaleDateString()} at {new Date(selectedIssue.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            
            <View style={styles.issueActions}>
              <TouchableOpacity style={styles.actionButton}>
                <LinearGradient
                  colors={['#F3F4F6', '#E5E7EB']}
                  style={styles.actionButtonGradient}
                >
                  <Text style={styles.actionButtonText}>Assign Team</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <LinearGradient
                  colors={['#2563EB', '#1D4ED8']}
                  style={styles.actionButtonGradient}
                >
                  <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>View Details</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Stats Summary */}
      {!isMapExpanded && (
        <View style={styles.statsContainer}>
        <LinearGradient
          colors={['#F59E0B', '#D97706']}
          style={styles.statCard}
        >
          <Text style={styles.statNumber}>{filteredIssues.filter(i => i.status === 'pending').length}</Text>
          <Text style={styles.statLabel}>{t('management.map.stats.pending')}</Text>
        </LinearGradient>
        <LinearGradient
          colors={['#2563EB', '#1D4ED8']}
          style={styles.statCard}
        >
          <Text style={styles.statNumber}>{filteredIssues.filter(i => i.status === 'in-progress').length}</Text>
          <Text style={styles.statLabel}>{t('management.map.stats.inProgress')}</Text>
        </LinearGradient>
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.statCard}
        >
          <Text style={styles.statNumber}>{filteredIssues.filter(i => i.status === 'resolved').length}</Text>
          <Text style={styles.statLabel}>{t('management.map.stats.resolved')}</Text>
        </LinearGradient>
        <LinearGradient
          colors={['#7C3AED', '#6D28D9']}
          style={styles.statCard}
        >
          <Text style={styles.statNumber}>{filteredIssues.filter(i => i.autoRouted).length}</Text>
          <Text style={styles.statLabel}>Auto-routed</Text>
        </LinearGradient>
      </View>
      )}

      <AdvancedFiltersModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: 16,
  },
  currentLocationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  currentLocationText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  searchInputMain: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    paddingVertical: 12,
  },
  advancedFilterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeAdvancedFilter: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  filterChipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  mapContainer: {
    height: 400,
    margin: 20,
    marginTop: 0,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  expandedMapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    borderRadius: 0,
    zIndex: 1000,
    height: '100%',
  },
  mapGradient: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mapPlaceholderSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  coordinatesDisplay: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  currentLocationMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -15,
    marginLeft: -15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentMarkerPulse: {
    position: 'absolute',
    width: 30,
  streetNetwork: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mainRoad: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2,
  },
  secondaryRoad: {
    borderRadius: 15,
  building: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  park: {
    position: 'absolute',
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
    bottom: '15%',
    left: '55%',
    right: '8%',
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    borderColor: '#667eea',
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 235, 0.8)',
  },
  markersOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  marker: {
    position: 'absolute',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  markerGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  volumeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  volumeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  autoRoutedIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoRoutedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
    marginLeft: 8,
  },
  autoRoutedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#2563EB',
  },
  priorityZone: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  activeControlButton: {
    backgroundColor: '#EFF6FF',
  },
  layersPanel: {
    position: 'absolute',
    top: 16,
    right: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    minWidth: 150,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  layersPanelTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  layerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  layerCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  layerCheckboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  layerText: {
    fontSize: 14,
    color: '#374151',
  },
  issueModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  issueCard: {
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  issueHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  issueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  closeButton: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  issueStatus: {
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  issueLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  issueDepartment: {
    fontSize: 14,
    color: '#7C3AED',
    marginBottom: 6,
  },
  issueVolume: {
    fontSize: 14,
    color: '#F59E0B',
    marginBottom: 6,
  },
  assignedTo: {
    fontSize: 14,
    color: '#2563EB',
    marginBottom: 6,
  },
  unassigned: {
    fontSize: 14,
    color: '#F59E0B',
    marginBottom: 6,
  },
  issueDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  issueActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 0,
    gap: 6,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '600',
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
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
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
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  activeFilterOptionText: {
    color: '#FFFFFF',
  },
  locationInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#374151',
  },
  quickAreas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickAreaChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quickAreaText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  clearFiltersButton: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  clearFiltersText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
  },
  collapseButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});