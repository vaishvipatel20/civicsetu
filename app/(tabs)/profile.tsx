import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  User,
  Settings,
  Bell,
  CircleHelp as HelpCircle,
  FileText,
  Shield,
  LogOut,
  ChevronRight,
  Award,
  MapPin,
  Calendar,
  TrendingUp,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import LanguageSelector from '@/components/LanguageSelector';

interface MenuItem {
  icon: React.ComponentType<any>;
  title: string;
  subtitle: string;
  color: string;
  action?: () => void;
}

export default function ProfileScreen() {
  const { t } = useTranslation();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // This project currently uses mocked auth in `app/(auth)/login.tsx`.
            // Still, we defensively clear any locally stored user/session keys.
            try {
              // If AsyncStorage is later introduced, uncomment and keep these keys aligned.
              // await AsyncStorage.multiRemove(['user', 'token', 'session']);
              // For now we only clear anything on the JS side by navigating.
            } catch {
              // no-op
            }

            // Reset navigation so user can't go back into authenticated screens.
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };
  const menuItems: MenuItem[] = [
    {
      icon: Settings,
      title: t('profile.menu.accountSettings.title'),
      subtitle: t('profile.menu.accountSettings.subtitle'),
      color: '#6B7280',
    },
    {
      icon: Bell,
      title: t('profile.menu.notifications.title'),
      subtitle: t('profile.menu.notifications.subtitle'),
      color: '#2563EB',
    },
    {
      icon: HelpCircle,
      title: t('profile.menu.helpSupport.title'),
      subtitle: t('profile.menu.helpSupport.subtitle'),
      color: '#059669',
    },
    {
      icon: FileText,
      title: t('profile.menu.termsPrivacy.title'),
      subtitle: t('profile.menu.termsPrivacy.subtitle'),
      color: '#7C3AED',
    },
    {
      icon: Shield,
      title: t('profile.menu.safety.title'),
      subtitle: t('profile.menu.safety.subtitle'),
      color: '#DC2626',
    },
  ];

  const stats = [
    { label: t('profile.stats.reportsSubmitted'), value: '12', icon: FileText },
    { label: t('profile.stats.issuesResolved'), value: '8', icon: Award },
    { label: t('profile.stats.communityScore'), value: '95', icon: TrendingUp },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile.title')}</Text>
          <Text style={styles.subtitle}>{t('profile.subtitle')}</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={32} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Sarah Johnson</Text>
            <Text style={styles.userEmail}>sarah.johnson@email.com</Text>
            <View style={styles.userLocation}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.locationText}>Downtown District</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>{t('profile.edit')}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>{t('profile.yourImpact')}</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <IconComponent size={20} color="#2563EB" />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Achievement Badge */}
        <View style={styles.achievementCard}>
          <View style={styles.achievementIcon}>
            <Award size={24} color="#F59E0B" />
          </View>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>{t('profile.achievement.title')}</Text>
            <Text style={styles.achievementDescription}>
              {t('profile.achievement.description', { count: 8 })}
            </Text>
          </View>
        </View>


        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action || (() => {})}>
                <View style={styles.menuIconContainer}>
                  <IconComponent size={20} color={item.color} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            );
          })}
          
          {/* Language Selector */}
          <LanguageSelector showAsMenuItem={true} />
        </View>

        {/* Account Info */}
        <View style={styles.accountInfo}>
          <View style={styles.infoRow}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.infoText}>{t('profile.memberSince', { date: 'January 2024' })}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.versionText}>{t('profile.appVersion', { version: '1.0.0' })}</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color="#DC2626" />
          <Text style={styles.signOutText}>{t('profile.signOut')}</Text>
        </TouchableOpacity>
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
  userCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  userLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  editButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  achievementCard: {
    backgroundColor: '#FFFBEB',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#B45309',
    lineHeight: 18,
  },
  menuContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  accountInfo: {
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#DC2626',
  },
});