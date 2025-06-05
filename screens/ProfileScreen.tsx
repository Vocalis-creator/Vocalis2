import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { TopNavigationBar } from '../components/TopNavigationBar';
import { AuthModal } from '../components/AuthModal';
import { useAuth } from '../contexts/AuthContext';

interface MenuItem {
  id: string;
  title: string;
  iconName: keyof typeof Feather.glyphMap;
  divider: boolean;
}

export const ProfileScreen = () => {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const { user, loading, signOut } = useAuth();

  const handleAuthPress = () => {
    if (user) {
      // Show sign out confirmation
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Sign Out', 
            style: 'destructive',
            onPress: handleSignOut 
          },
        ]
      );
    } else {
      // Show auth modal
      setAuthModalVisible(true);
    }
  };

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.error) {
        Alert.alert('Error', result.error);
      } else {
        console.log('✅ ProfileScreen: User signed out successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
      console.error('❌ ProfileScreen: Sign out error:', error);
    }
  };

  const handleMenuItemPress = (itemId: string) => {
    // TODO: Implement menu item navigation in future phases
    console.log(`Navigate to ${itemId}`);
  };

  const menuItems: MenuItem[] = [
    {
      id: 'interests',
      title: 'Configure Interests',
      iconName: 'heart',
      divider: false
    },
    {
      id: 'history',
      title: 'Tour History',
      iconName: 'clock',
      divider: true
    },
    {
      id: 'share',
      title: 'Share App',
      iconName: 'share',
      divider: false
    },
    {
      id: 'rate',
      title: 'Rate App',
      iconName: 'star',
      divider: true
    },
    {
      id: 'faq',
      title: 'FAQ',
      iconName: 'help-circle',
      divider: false
    },
    {
      id: 'terms',
      title: 'Terms of Use',
      iconName: 'file-text',
      divider: false
    },
    {
      id: 'privacy',
      title: 'Privacy Notice',
      iconName: 'shield',
      divider: false
    },
    {
      id: 'contact',
      title: 'Contact Us',
      iconName: 'message-square',
      divider: false
    }
  ];

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <TopNavigationBar currentScreen="Profile" />

      {/* Main Content */}
      <SafeAreaView style={styles.content}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
          </View>
          
          {/* User Status Section */}
          <View style={styles.userSection}>
            {user ? (
              <>
                <View style={styles.userInfo}>
                  <View style={styles.userIconContainer}>
                    <Feather 
                      name={user.isGuest ? "user" : "user-check"} 
                      size={24} 
                      color="#D4B46E" 
                    />
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userStatusText}>
                      {user.isGuest ? 'Guest User' : 'Signed In'}
                    </Text>
                    {user.email && (
                      <Text style={styles.userEmailText}>{user.email}</Text>
                    )}
                    {user.isGuest && (
                      <Text style={styles.userHintText}>
                        Sign up to save tours and sync across devices
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.signOutButton} 
                  onPress={handleAuthPress}
                  disabled={loading}
                >
                  <Text style={styles.signOutButtonText}>
                    {loading ? 'Signing Out...' : 'Sign Out'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Join Vocalis Button */}
                <TouchableOpacity 
                  style={styles.joinButton} 
                  onPress={handleAuthPress}
                  disabled={loading}
                >
                  <Text style={styles.joinButtonText}>
                    {loading ? 'Loading...' : 'Sign Up / Log In'}
                  </Text>
                </TouchableOpacity>
                
                {/* Guest Mode Option */}
                <View style={styles.guestSection}>
                  <Text style={styles.guestText}>or</Text>
                  <TouchableOpacity 
                    style={styles.guestButton}
                    onPress={handleAuthPress}
                    disabled={loading}
                  >
                    <Feather name="user" size={16} color="#D4B46E" />
                    <Text style={styles.guestButtonText}>Continue as Guest</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => handleMenuItemPress(item.id)}
                >
                  <View style={styles.menuItemLeft}>
                    <Feather 
                      name={item.iconName} 
                      size={20} 
                      color="#D4B46E" 
                      style={styles.menuIcon}
                    />
                    <Text style={styles.menuTitle}>{item.title}</Text>
                  </View>
                  <Feather 
                    name="chevron-right" 
                    size={20} 
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
                {item.divider && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Auth Modal */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSuccess={() => {
          console.log('✅ ProfileScreen: Authentication successful');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1929', // navy-900 from prototype
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24, // px-6 from prototype
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '400', // font-serif equivalent
    color: '#FFFFFF',
    fontFamily: 'Arial',
  },
  userSection: {
    marginBottom: 32,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#0F2942',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#14385C',
  },
  userIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 180, 110, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userStatusText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Arial',
    marginBottom: 4,
  },
  userEmailText: {
    fontSize: 14,
    color: '#D4B46E',
    fontFamily: 'Arial',
    marginBottom: 4,
  },
  userHintText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Arial',
  },
  joinButton: {
    backgroundColor: '#D4B46E', // gold-500 from prototype
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  joinButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A1929', // navy-900 for contrast
    fontFamily: 'Arial',
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: '#DC2626', // red-600
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#DC2626',
    fontFamily: 'Arial',
  },
  guestSection: {
    alignItems: 'center',
  },
  guestText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Arial',
    marginBottom: 12,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4B46E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  guestButtonText: {
    fontSize: 14,
    color: '#D4B46E',
    fontFamily: 'Arial',
    marginLeft: 8,
  },
  menuContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#0F2942', // navy-800 from prototype
    borderBottomWidth: 1,
    borderBottomColor: '#14385C', // navy-600
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Arial',
  },
  divider: {
    height: 8, // py-2 equivalent for visual spacing
    backgroundColor: 'transparent',
  },
}); 