import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Settings, MapPin, FileText, Shield, Activity } from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function RoleSelection() {
  const handleRoleSelection = (role: 'citizen' | 'management') => {
    router.push(`/(auth)/signup?role=${role}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>Select how you want to use CivicConnect</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelection('citizen')}
        >
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.roleCardGradient}
          >
            <View style={styles.roleIcon}>
              <Users size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.roleTitle}>Citizen</Text>
            <Text style={styles.roleDescription}>
              Report civic issues, track progress, and help improve your community
            </Text>
            <View style={styles.roleFeatures}>
              <View style={styles.feature}>
                <FileText size={16} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.featureText}>Report Issues</Text>
              </View>
              <View style={styles.feature}>
                <MapPin size={16} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.featureText}>Track Location</Text>
              </View>
              <View style={styles.feature}>
                <Activity size={16} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.featureText}>Real-time Updates</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelection('management')}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.roleCardGradient}
          >
            <View style={styles.roleIcon}>
              <Settings size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.roleTitle}>Management</Text>
            <Text style={styles.roleDescription}>
              Manage civic reports, coordinate teams, and oversee city operations
            </Text>
            <View style={styles.roleFeatures}>
              <View style={styles.feature}>
                <Shield size={16} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.featureText}>Admin Access</Text>
              </View>
              <View style={styles.feature}>
                <Users size={16} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.featureText}>Team Management</Text>
              </View>
              <View style={styles.feature}>
                <Activity size={16} color="rgba(255, 255, 255, 0.9)" />
                <Text style={styles.featureText}>Analytics Dashboard</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 24,
  },
  roleCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  roleCardGradient: {
    padding: 24,
    alignItems: 'center',
  },
  roleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  roleFeatures: {
    gap: 12,
    alignSelf: 'stretch',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
});