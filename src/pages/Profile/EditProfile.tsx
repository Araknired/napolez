import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Camera, X, Trash2, Check, RotateCw, ZoomIn } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';

interface PaymentCard {
  id: string;
  card_number: string;
  card_holder: string;
  expiry_date: string;
  card_type: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  nation: string;
  gender: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  twitter: string;
  linkedin: string;
  facebook: string;
  google: string;
  slogan: string;
  language: string;
}

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Creates an image element from a URL
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

/**
 * Crops an image based on pixel coordinates and rotation
 */
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, 'image/jpeg', 0.9);
  });
}

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State management
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Image cropper state
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Form data
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    password: '••••••••••',
    phone: '',
    address: '',
    nation: '',
    gender: 'Male',
    birthMonth: 'January',
    birthDay: '1',
    birthYear: '1990',
    twitter: '',
    linkedin: '',
    facebook: '',
    google: '',
    slogan: '',
    language: 'English'
  });

  // Load user data on mount
  useEffect(() => {
    fetchUserData();
    fetchPaymentCards();
  }, [user]);

  /**
   * Fetches user profile data from the database
   */
  const fetchUserData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        const nameParts = data.full_name?.split(' ') || ['', ''];
        setFormData(prev => ({
          ...prev,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          phone: data.phone || '',
          address: data.address || '',
          nation: data.nation || '',
          gender: data.gender || 'Male',
          birthMonth: data.birth_month || 'January',
          birthDay: data.birth_day || '1',
          birthYear: data.birth_year || '1990',
          twitter: data.twitter || '',
          linkedin: data.linkedin || '',
          facebook: data.facebook || '',
          google: data.google || '',
          slogan: data.slogan || '',
          language: data.language || 'English'
        }));

        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      showError('Failed to load user data');
    }
  };

  /**
   * Fetches payment cards from the database
   */
  const fetchPaymentCards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payment_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setPaymentCards(data);
        if (data.length > 0 && !selectedCard) {
          setSelectedCard(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching payment cards:', err);
    }
  };

  /**
   * Callback when crop area changes
   */
  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  /**
   * Handles file selection for avatar upload
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      showError('Please select a valid image file (JPG, PNG, or WEBP)');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      showError('Image size must be less than 5MB');
      return;
    }

    // Read file and open crop modal
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result as string);
      setShowCropModal(true);
      resetCropSettings();
    };
    reader.readAsDataURL(file);
  };

  /**
   * Resets crop settings to default
   */
  const resetCropSettings = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  };

  /**
   * Confirms and applies the crop
   */
  const handleCropConfirm = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    try {
      setUploadingAvatar(true);
      setShowCropModal(false);

      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels, rotation);
      const croppedFile = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });

      await uploadAvatar(croppedFile);
      setImageToCrop(null);
    } catch (err) {
      console.error('Error cropping image:', err);
      showError('Failed to process image');
    } finally {
      setUploadingAvatar(false);
    }
  };

  /**
   * Cancels the crop operation
   */
  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageToCrop(null);
    resetCropSettings();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Uploads avatar to storage and updates database
   */
  const uploadAvatar = async (file: File) => {
    if (!user) return;

    try {
      // Remove old avatar if exists
      if (avatarUrl) {
        const oldPath = avatarUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatar').remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const fileName = `${Date.now()}.jpg`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatar')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatar')
        .getPublicUrl(filePath);

      // Update database
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      showMessage('Avatar updated successfully!');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      showError('Failed to upload avatar');
    }
  };

  /**
   * Removes the current avatar
   */
  const handleRemoveAvatar = async () => {
    if (!user || !avatarUrl) return;
    if (!confirm('Are you sure you want to remove your avatar?')) return;

    try {
      setUploadingAvatar(true);

      // Delete from storage
      const oldPath = avatarUrl.split('/').pop();
      if (oldPath) {
        await supabase.storage.from('avatar').remove([`${user.id}/${oldPath}`]);
      }

      // Update database
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: null })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(null);
      showMessage('Avatar removed successfully');
    } catch (err) {
      console.error('Error removing avatar:', err);
      showError('Failed to remove avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  /**
   * Removes a payment card
   */
  const handleRemoveCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to remove this card?')) return;

    try {
      const { error } = await supabase
        .from('payment_cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      setPaymentCards(prev => prev.filter(card => card.id !== cardId));
      if (selectedCard === cardId) {
        setSelectedCard(paymentCards.find(c => c.id !== cardId)?.id || '');
      }
      showMessage('Card removed successfully');
    } catch (err) {
      console.error('Error removing card:', err);
      showError('Failed to remove card');
    }
  };

  /**
   * Saves profile changes
   */
  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const { error: updateError } = await supabase
        .from('users')
        .upsert({
          user_id: user.id,
          full_name: fullName,
          phone: formData.phone || null,
          address: formData.address || null,
          nation: formData.nation || null,
          gender: formData.gender,
          birth_month: formData.birthMonth,
          birth_day: formData.birthDay,
          birth_year: formData.birthYear,
          twitter: formData.twitter || null,
          linkedin: formData.linkedin || null,
          facebook: formData.facebook || null,
          google: formData.google || null,
          slogan: formData.slogan || null,
          language: formData.language,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (updateError) throw updateError;

      showMessage('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      console.error('Error saving profile:', err);
      showError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Utility functions for showing messages
   */
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 3000);
  };

  /**
   * Gets last 4 digits of card number
   */
  const getLastFourDigits = (cardNumber: string) => cardNumber.slice(-4);

  // Theme-based styling
  const isDark = theme === 'dark';
  const styles = {
    container: isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900',
    card: isDark ? 'bg-slate-800 shadow-xl shadow-black/30' : 'bg-white shadow-sm',
    textPrimary: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-500',
    textBreadcrumb: isDark ? 'text-gray-500' : 'text-gray-400',
    input: isDark 
      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500 focus:ring-blue-500' 
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500',
    select: `${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500 focus:ring-blue-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-blue-500'} appearance-none cursor-pointer`,
    btnCancel: isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900',
    msgSuccess: isDark ? 'bg-green-900 border-green-500 text-green-300' : 'bg-green-50 border-green-500 text-green-700',
    msgError: isDark ? 'bg-red-900 border-red-500 text-red-300' : 'bg-red-50 border-red-500 text-red-700',
    paymentCardDefault: isDark ? 'border-gray-600 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50',
    paymentCardChecked: isDark ? 'peer-checked:border-blue-500 peer-checked:bg-blue-900/50' : 'peer-checked:border-blue-500 peer-checked:bg-blue-50',
    paymentCardRemove: isDark ? 'text-red-500 hover:text-red-400' : 'text-red-400 hover:text-red-600',
    addPaymentButton: isDark ? 'border-gray-600 text-green-400 hover:border-green-400 hover:text-green-300' : 'border-gray-300 text-green-500 hover:border-green-500 hover:text-green-600',
    modalBg: isDark ? 'bg-slate-900' : 'bg-white'
  };

  return (
    <div className={`min-h-screen ${styles.container} pt-4 lg:pt-24`}>
      <div className="h-[calc(100vh-1rem)] lg:h-[calc(100vh-6rem)] overflow-y-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm">
            <span className={styles.textBreadcrumb}>My profile</span>
            <span className={styles.textBreadcrumb}>›</span>
            <span className={`font-medium ${styles.textPrimary}`}>Edit Profile</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-2 px-4 py-2 ${styles.btnCancel} transition-colors`}
              disabled={loading}
            >
              <span>Cancel</span>
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 border-l-4 px-4 py-3 rounded ${styles.msgSuccess}`}>
            {message}
          </div>
        )}
        {error && (
          <div className={`mb-6 border-l-4 px-4 py-3 rounded ${styles.msgError}`}>
            {error}
          </div>
        )}

        {/* Crop Modal */}
        {showCropModal && imageToCrop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={handleCropCancel} />
            <div className={`relative ${styles.modalBg} rounded-2xl shadow-2xl max-w-2xl w-full p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${styles.textPrimary}`}>Adjust Your Photo</h3>
                <button
                  onClick={handleCropCancel}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${styles.textSecondary}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative h-96 bg-black rounded-lg overflow-hidden mb-6">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-sm font-medium ${styles.textSecondary}`}>
                      <ZoomIn className="w-4 h-4 inline mr-1" />
                      Zoom
                    </label>
                    <span className={`text-sm ${styles.textSecondary}`}>{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #22c55e 0%, #22c55e ${((zoom - 1) / 2) * 100}%, ${isDark ? '#334155' : '#e5e7eb'} ${((zoom - 1) / 2) * 100}%, ${isDark ? '#334155' : '#e5e7eb'} 100%)`
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-sm font-medium ${styles.textSecondary}`}>
                      <RotateCw className="w-4 h-4 inline mr-1" />
                      Rotation
                    </label>
                    <span className={`text-sm ${styles.textSecondary}`}>{rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(rotation / 360) * 100}%, ${isDark ? '#334155' : '#e5e7eb'} ${(rotation / 360) * 100}%, ${isDark ? '#334155' : '#e5e7eb'} 100%)`
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCropCancel}
                  className={`flex-1 px-6 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg font-medium transition-colors ${styles.textSecondary} hover:bg-gray-100 dark:hover:bg-slate-700`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropConfirm}
                  className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar and Basic Info */}
          <div className="lg:col-span-1">
            <div className={`${styles.card} rounded-2xl p-6`}>
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                    </div>
                  )}

                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      formData.firstName.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>

                  {avatarUrl && (
                    <button
                      onClick={handleRemoveAvatar}
                      disabled={uploadingAvatar}
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove Avatar
                    </button>
                  )}
                </div>

                <p className={`text-xs text-center mt-8 ${styles.textSecondary}`}>
                  Click the camera icon to upload a new avatar<br />
                  (Max 5MB - JPG, PNG, WEBP)
                </p>
              </div>

              <div className="space-y-4 mt-6">
                <div>
                  <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.input}`}
                    placeholder="Arthur"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.input}`}
                    placeholder="Nancy"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                    Password
                  </label>
                  <div className="flex items-center justify-between">
                    <input
                      type="password"
                      value={formData.password}
                      className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.input}`}
                      disabled
                    />
                    <button
                      onClick={() => navigate('/forgot-password')}
                      className="ml-3 text-green-500 hover:text-green-600 text-xs font-medium whitespace-nowrap"
                    >
                      CHANGE PASSWORD
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.input}`}
                    disabled
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.input}`}
                    placeholder="477-046-1827"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.input}`}
                    placeholder="H8 Jaaskeldi Stravonus Suita 883"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                    Nation
                  </label>
                  <input
                    type="text"
                    value={formData.nation}
                    onChange={(e) => setFormData({ ...formData, nation: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.input}`}
                    placeholder="Colombia"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info and Payment */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`${styles.card} rounded-2xl p-6`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.select}`}
                  >
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>Male</option>
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>Female</option>
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>Other</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.select}`}
                  >
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>English</option>
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>Spanish</option>
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>French</option>
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>German</option>
                    <option className={isDark ? 'bg-slate-700' : 'bg-white'}>Portuguese</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                  Date of Birth
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={formData.birthMonth}
                    onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                    className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.select}`}
                  >
                    {MONTHS.map(month => (
                      <option key={month} className={isDark ? 'bg-slate-700' : 'bg-white'}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.birthDay}
                    onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                    className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.select}`}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} className={isDark ? 'bg-slate-700' : 'bg-white'}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.birthYear}
                    onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                    className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.select}`}
                  >
                    {Array.from({ length: 100 }, (_, i) => 2024 - i).map(year => (
                      <option key={year} className={isDark ? 'bg-slate-700' : 'bg-white'}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                    Twitter
                  </label>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.input}`}
                    placeholder="twitter.com/envato"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.input}`}
                    placeholder="linkedin.com/in/envato"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.input}`}
                    placeholder="facebook.com/envato"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                    Google
                  </label>
                  <input
                    type="text"
                    value={formData.google}
                    onChange={(e) => setFormData({ ...formData, google: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.input}`}
                    placeholder="zachary.rust"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className={`block text-xs font-medium ${styles.textSecondary} mb-2`}>
                  Slogan
                </label>
                <input
                  type="text"
                  value={formData.slogan}
                  onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${styles.input}`}
                  placeholder="Land acquisition Specialist"
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className={`${styles.card} rounded-2xl p-6`}>
              <label className={`block text-xs font-medium ${styles.textSecondary} mb-4`}>
                Payment Method
              </label>

              {paymentCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentCards.map((card) => (
                    <div key={card.id} className="relative">
                      <input
                        type="radio"
                        name="payment"
                        value={card.id}
                        checked={selectedCard === card.id}
                        onChange={(e) => setSelectedCard(e.target.value)}
                        className="peer sr-only"
                        id={card.id}
                      />
                      <label
                        htmlFor={card.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${styles.paymentCardDefault} ${styles.paymentCardChecked}`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src="/images/payment/tarjeta.png"
                            alt="Card"
                            className="w-12 h-8 object-cover rounded"
                          />
                          <div>
                            <div className={`text-sm font-medium ${styles.textPrimary}`}>
                              {card.card_type} ....{getLastFourDigits(card.card_number)}
                            </div>
                            <div className={`text-xs ${styles.textSecondary}`}>
                              Exp {card.expiry_date}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveCard(card.id);
                          }}
                          className={`text-xs ${styles.paymentCardRemove}`}
                        >
                          REMOVE
                        </button>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 text-sm ${styles.textSecondary}`}>
                  No payment methods added yet
                </div>
              )}

              <button
                onClick={() => navigate('/payment')}
                className={`mt-4 w-full py-3 border-2 border-dashed rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${styles.addPaymentButton}`}
              >
                <span className="text-lg">+</span>
                ADD PAYMENT METHOD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}