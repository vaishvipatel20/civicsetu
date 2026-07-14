import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { Camera, MapPin, Upload, CircleCheck as CheckCircle2, Car, Lightbulb, Trash2, TriangleAlert as AlertTriangle, TreePine, Construction, X, Mic, MicOff, Send } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ReportScreen() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  const categories = [
    { id: 'pothole', name: t('report.categories.pothole'), icon: Car, color: '#EF4444' },
    { id: 'streetlight', name: t('report.categories.streetlight'), icon: Lightbulb, color: '#F59E0B' },
    { id: 'garbage', name: t('report.categories.garbage'), icon: Trash2, color: '#10B981' },
    { id: 'safety', name: t('report.categories.safety'), icon: AlertTriangle, color: '#DC2626' },
    { id: 'parks', name: t('report.categories.parks'), icon: TreePine, color: '#059669' },
    { id: 'construction', name: t('report.categories.construction'), icon: Construction, color: '#7C3AED' },
  ];

  const priorityLevels = [
    { id: 'low', name: 'Low Priority', color: '#10B981', description: 'Non-urgent, can wait' },
    { id: 'medium', name: 'Medium Priority', color: '#F59E0B', description: 'Moderate urgency' },
    { id: 'high', name: 'High Priority', color: '#EF4444', description: 'Urgent, needs immediate attention' },
  ];

  // Get current location
  React.useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for accurate reporting.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const fullAddress = address[0] ? 
        `${address[0].streetNumber || ''} ${address[0].street || ''}, ${address[0].city || ''}, ${address[0].region || ''}`.trim().replace(/^,\s*/, '') : 
        'Location detected';

      setLocation({
        coords: currentLocation.coords,
        address: fullAddress,
      });
      setLocationAddress(fullAddress);
      
      // Animate location card
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get current location. Please try again.');
    }
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload photos.'
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos.'
        );
        return;
      }
    }
    setShowCamera(true);
  };

  const capturePhoto = async (camera: any) => {
    try {
      const photo = await camera.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      if (photo?.uri) {
        setPhotos(prev => [...prev, photo.uri]);
        setShowCamera(false);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const uploadPhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotos(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, you would start/stop audio recording here
    if (!isRecording) {
      Alert.alert('Recording Started', 'Speak now to add a voice note to your report.');
    } else {
      Alert.alert('Recording Stopped', 'Voice note has been added to your report.');
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedCategory) {
      Alert.alert(t('report.categoryRequired'), t('report.categoryRequiredMessage'));
      return;
    }
    if (!description.trim()) {
      Alert.alert(t('report.descriptionRequired'), t('report.descriptionRequiredMessage'));
      return;
    }
    if (!location) {
      Alert.alert('Location Required', 'Please wait for location to be detected or enable location services.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call with real-time submission
      const reportData = {
        category: selectedCategory,
        description: description.trim(),
        priority,
        location: location.coords,
        address: location.address,
        photos: photos.length,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        t('report.reportSubmitted'),
        `${t('report.reportSubmittedMessage')}\n\nReport ID: #${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}\nPriority: ${priority.toUpperCase()}\nEstimated response: ${priority === 'high' ? '2-4 hours' : priority === 'medium' ? '24-48 hours' : '3-5 days'}`,
        [{ text: t('report.ok'), onPress: resetForm }]
      );
    } catch (error) {
      Alert.alert('Submission Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setDescription('');
    setPhotos([]);
    setPriority('medium');
    getCurrentLocation(); // Refresh location
  };

  const inferPriorityFromCategory = (categoryId: string) => {
    const highPriorityCategories = ['safety', 'pothole'];
    const mediumPriorityCategories = ['streetlight', 'construction'];
    
    if (highPriorityCategories.includes(categoryId)) {
      setPriority('high');
    } else if (mediumPriorityCategories.includes(categoryId)) {
      setPriority('medium');
    } else {
      setPriority('low');
    }
  };

  if (showCamera) {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          ref={(ref) => {
            if (ref) {
              // Store camera ref for capture
              (ref as any).capturePhoto = () => capturePhoto(ref);
            }
          }}
        >
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.closeCamera}
              onPress={() => setShowCamera(false)}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={() => {
                  const cameraRef = document.querySelector('video')?.parentElement;
                  if (cameraRef) {
                    capturePhoto(cameraRef);
                  }
                }}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('report.title')}</Text>
          <Text style={styles.subtitle}>{t('report.subtitle')}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* Location Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>{t('report.location')}</Text>
          
          {/* Live Map View */}
          <View style={styles.mapContainer}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.mapGradient}
            >
              {/* Citizen Report Map */}
              <View style={styles.citizenMapBackground}>
                {/* Local Area Streets */}
                <View style={styles.localStreets}>
                  {/* Main Street */}
                  <View style={[styles.localRoad, { top: '30%', left: '10%', width: '80%', height: 3 }]} />
                  <View style={[styles.localRoad, { top: '50%', left: '15%', width: '70%', height: 3 }]} />
                  <View style={[styles.localRoad, { top: '70%', left: '20%', width: '60%', height: 3 }]} />
                  
                  {/* Cross Streets */}
                  <View style={[styles.localRoad, { top: '20%', left: '35%', width: 3, height: '60%' }]} />
                  <View style={[styles.localRoad, { top: '25%', left: '60%', width: 3, height: '50%' }]} />
                  
                  {/* Neighborhood Blocks */}
                  <View style={[styles.neighborhoodBlock, { top: '15%', left: '20%', width: '12%', height: '12%' }]} />
                  <View style={[styles.neighborhoodBlock, { top: '15%', left: '65%', width: '15%', height: '10%' }]} />
                  <View style={[styles.neighborhoodBlock, { top: '35%', left: '25%', width: '8%', height: '10%' }]} />
                  <View style={[styles.neighborhoodBlock, { top: '55%', left: '30%', width: '12%', height: '8%' }]} />
                  <View style={[styles.neighborhoodBlock, { top: '75%', left: '40%', width: '10%', height: '10%' }]} />
                  
                  {/* Local Park */}
                  <View style={[styles.localPark, { top: '40%', left: '70%', width: '18%', height: '15%' }]} />
                  
                  {/* Your Location Indicator */}
                  <View style={styles.yourLocationIndicator}>
                    <View style={styles.yourLocationPulse} />
                    <View style={styles.yourLocationDot} />
                    <Text style={styles.yourLocationText}>You</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.mapPlaceholder}>
                <MapPin size={32} color="#FFFFFF" />
                <Text style={styles.mapText}>Live Map View</Text>
                {location && (
                  <View style={styles.coordinatesDisplay}>
                    <Text style={styles.coordinatesText}>
                      {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                    </Text>
                  </View>
                )}
              </View>
              
              {/* Location Marker */}
              {location && (
                <View style={styles.locationMarker}>
                  <View style={styles.markerPulse} />
                  <View style={styles.markerCenter} />
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Location Info Card */}
          <View style={[styles.locationCard, !location && styles.locationCardLoading]}>
            <LinearGradient
              colors={location ? ['#667eea', '#764ba2'] : ['#f8f9fa', '#e9ecef']}
              style={styles.locationCardGradient}
            >
              <MapPin size={20} color={location ? "#FFFFFF" : "#6B7280"} />
              <View style={styles.locationText}>
                <Text style={[styles.locationTitle, location && styles.locationTitleActive]}>
                  {t('report.currentLocation')}
                </Text>
                <Text style={[styles.locationSubtitle, location && styles.locationSubtitleActive]}>
                  {location ? locationAddress : 'Detecting location...'}
                </Text>
              </View>
              {location ? (
                <CheckCircle2 size={20} color="#FFFFFF" />
              ) : (
                <ActivityIndicator size="small" color="#6B7280" />
              )}
            </LinearGradient>
          </View>
          
          <TouchableOpacity style={styles.refreshLocationButton} onPress={getCurrentLocation}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.refreshButtonGradient}
            >
              <Text style={styles.refreshLocationText}>Refresh Location</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('report.issueCategory')}</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard]}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    inferPriorityFromCategory(category.id);
                  }}
                >
                  <LinearGradient
                    colors={isSelected ? [category.color, `${category.color}CC`] : ['#FFFFFF', '#F8F9FA']}
                    style={styles.categoryCardGradient}
                  >
                    <IconComponent
                      size={24}
                      color={isSelected ? '#FFFFFF' : category.color}
                    />
                    <Text style={[
                      styles.categoryText,
                      isSelected && { color: '#FFFFFF', fontWeight: '600' }
                    ]}>
                      {category.name}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Priority Selection */}
        {selectedCategory && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Priority Level</Text>
            <Text style={styles.sectionSubtitle}>
              Help us prioritize your report based on urgency
            </Text>
            <View style={styles.priorityGrid}>
              {priorityLevels.map((level) => {
                const isSelected = priority === level.id;
                return (
                  <TouchableOpacity
                    key={level.id}
                    style={styles.priorityCard}
                    onPress={() => setPriority(level.id as any)}
                  >
                    <LinearGradient
                      colors={isSelected ? [level.color, `${level.color}CC`] : ['#FFFFFF', '#F8F9FA']}
                      style={styles.priorityCardGradient}
                    >
                      <View style={[styles.priorityDot, { backgroundColor: isSelected ? '#FFFFFF' : level.color }]} />
                      <Text style={[
                        styles.priorityName,
                        isSelected && { color: '#FFFFFF', fontWeight: '600' }
                      ]}>
                        {level.name}
                      </Text>
                      <Text style={[styles.priorityDescription, isSelected && { color: '#FFFFFF' }]}>
                        {level.description}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}


        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('report.description')}</Text>
          <View style={styles.descriptionContainer}>
          <TextInput
            style={styles.descriptionInput}
            placeholder={t('report.descriptionPlaceholder')}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#9CA3AF"
          />
            <TouchableOpacity
              style={[styles.voiceButton, isRecording && styles.voiceButtonActive]}
              onPress={toggleRecording}
            >
              {isRecording ? (
                <MicOff size={20} color="#FFFFFF" />
              ) : (
                <Mic size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Recording voice note...</Text>
            </View>
          )}
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('report.addPhotos')}</Text>
          <View style={styles.photoActions}>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={takePhoto}
            >
              <Camera size={20} color="#2563EB" />
              <Text style={styles.photoButtonText}>{t('report.takePhoto')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={uploadPhoto}
            >
              <Upload size={20} color="#2563EB" />
              <Text style={styles.photoButtonText}>{t('report.uploadPhoto')}</Text>
            </TouchableOpacity>
          </View>
          
          {photos.length > 0 && (
            <View style={styles.photosContainer}>
              <Text style={styles.photosTitle}>Added Photos ({photos.length})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
                {photos.map((photoUri, index) => (
                  <View key={index} style={styles.photoItem}>
                    <Image source={{ uri: photoUri }} style={styles.photoThumbnail} />
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => removePhoto(index)}
                    >
                      <X size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.photoSuccessIndicator}>
                <CheckCircle2 size={20} color="#10B981" />
                <Text style={styles.photoSuccessText}>
                  {photos.length === 1 ? t('report.photoAdded') : `${photos.length} photos added`}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmitReport} disabled={isSubmitting}>
          <LinearGradient
            colors={isSubmitting ? ['#9CA3AF', '#6B7280'] : ['#667eea', '#764ba2']}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submitting...</Text>
              </>
            ) : (
              <>
                <Send size={18} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>{t('report.submitReport')}</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Real-time Status */}
        {location && (
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.statusCard}
          >
            <CheckCircle2 size={16} color="#FFFFFF" />
            <Text style={styles.statusText}>
              Ready to submit • Location verified • {photos.length} photo{photos.length !== 1 ? 's' : ''} attached
            </Text>
          </LinearGradient>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    // Prevent visible white gap between header gradient and category section
    paddingTop: 0,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  mapGradient: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  citizenMapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  localStreets: {
    flex: 1,
    position: 'relative',
  },
  localRoad: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  neighborhoodBlock: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  localPark: {
    position: 'absolute',
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  yourLocationIndicator: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yourLocationPulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  yourLocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  yourLocationText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
  },
  locationMarker: {
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
  markerPulse: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  markerCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  locationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  locationCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  locationText: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  locationTitleActive: {
    color: '#FFFFFF',
  },
  locationSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 20,
  },
  locationSubtitleActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  locationCardLoading: {
    opacity: 0.7,
  },
  refreshLocationButton: {
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  refreshButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  refreshLocationText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    minHeight: 80,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryCardGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  categoryText: {
    fontSize: 15,
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  priorityGrid: {
    gap: 12,
  },
  priorityCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  priorityCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  priorityName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  priorityDescription: {
    fontSize: 13,
    color: '#6B7280',
    flex: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  descriptionContainer: {
    position: 'relative',
  },
  descriptionInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    textAlignVertical: 'top',
    minHeight: 120,
    paddingRight: 50,
  },
  voiceButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#EF4444',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  recordingText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563EB',
  },
  photosContainer: {
    marginTop: 12,
  },
  photosTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  photosScroll: {
    marginBottom: 12,
  },
  photoItem: {
    position: 'relative',
    marginRight: 12,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoSuccessIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    backgroundColor: '#ECFDF5',
    gap: 8,
  },
  photoSuccessText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  submitButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statusText: {
    fontSize: 15,
    color: '#FFFFFF',
    flex: 1,
    fontWeight: '500',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  closeCamera: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  cameraControls: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
});