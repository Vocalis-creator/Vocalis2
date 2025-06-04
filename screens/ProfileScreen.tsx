import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { TopNavigationBar } from '../components/TopNavigationBar';

interface MenuItem {
  id: string;
  title: string;
  iconName: keyof typeof Feather.glyphMap;
  divider: boolean;
}

export const ProfileScreen = () => {

  const handleJoinVocalis = () => {
    // TODO: Implement registration flow in Phase 3
    console.log('Join Vocalis pressed');
  };

  const handleLogIn = () => {
    // TODO: Implement login flow in Phase 3
    console.log('Log In pressed');
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
          
          {/* Join Vocalis Button */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.joinButton} onPress={handleJoinVocalis}>
              <Text style={styles.joinButtonText}>Join Vocalis</Text>
            </TouchableOpacity>
            
            {/* Have an Account Section */}
            <View style={styles.loginSection}>
              <Text style={styles.haveAccountText}>Have an Account?</Text>
              <TouchableOpacity onPress={handleLogIn}>
                <Text style={styles.loginText}>Log In</Text>
              </TouchableOpacity>
            </View>
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
  actionSection: {
    marginBottom: 32,
  },
  joinButton: {
    backgroundColor: '#D4B46E', // gold-500 from prototype
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1929', // navy-900 for contrast
    fontFamily: 'Arial',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  haveAccountText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Arial',
  },
  loginText: {
    fontSize: 16,
    color: '#D4B46E', // gold-400 from prototype
    fontWeight: '500',
    fontFamily: 'Arial',
  },
  menuContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F2942', // navy-800 from prototype
    paddingVertical: 16,
    paddingHorizontal: 16,
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
    height: 8,
    backgroundColor: '#0A1929', // navy-900 divider
  },
}); 