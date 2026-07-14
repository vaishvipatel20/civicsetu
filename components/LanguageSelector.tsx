import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Check, Globe } from 'lucide-react-native';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

interface LanguageSelectorProps {
  onPress?: () => void;
  showAsMenuItem?: boolean;
}

export default function LanguageSelector({ onPress, showAsMenuItem = false }: LanguageSelectorProps) {
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setModalVisible(false);
    onPress?.();
  };

  const openModal = () => {
    setModalVisible(true);
    onPress?.();
  };

  if (showAsMenuItem) {
    return (
      <>
        <TouchableOpacity style={styles.menuItem} onPress={openModal}>
          <View style={styles.menuIconContainer}>
            <Globe size={20} color="#7C3AED" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>{t('profile.menu.language.title')}</Text>
            <Text style={styles.menuSubtitle}>
              {t('profile.menu.language.subtitle')} • {currentLanguage.nativeName}
            </Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <SafeAreaView style={styles.modalSafeArea}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{t('profile.menu.language.title')}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>{t('common.close')}</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.languageList}>
                  {languages.map((language) => (
                    <TouchableOpacity
                      key={language.code}
                      style={styles.languageItem}
                      onPress={() => handleLanguageChange(language.code)}
                    >
                      <View style={styles.languageInfo}>
                        <Text style={styles.languageName}>{language.nativeName}</Text>
                        <Text style={styles.languageEnglishName}>{language.name}</Text>
                      </View>
                      {i18n.language === language.code && (
                        <Check size={20} color="#2563EB" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </SafeAreaView>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <TouchableOpacity style={styles.selector} onPress={openModal}>
      <Globe size={20} color="#6B7280" />
      <Text style={styles.selectorText}>{currentLanguage.nativeName}</Text>
      <ChevronRight size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalSafeArea: {
    flex: 1,
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
  closeButtonText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  languageList: {
    flex: 1,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  languageEnglishName: {
    fontSize: 14,
    color: '#6B7280',
  },
});