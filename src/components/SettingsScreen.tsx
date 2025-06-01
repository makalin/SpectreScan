import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [irDetection, setIrDetection] = useState(true);
  const [lidarEnabled, setLidarEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={darkMode ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detection</Text>
        <View style={styles.setting}>
          <Text style={styles.settingText}>IR Detection</Text>
          <Switch
            value={irDetection}
            onValueChange={setIrDetection}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={irDetection ? '#007AFF' : '#f4f3f4'}
          />
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingText}>LIDAR Scanning (Pro)</Text>
          <Switch
            value={lidarEnabled}
            onValueChange={setLidarEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={lidarEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  settingText: {
    fontSize: 16,
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SettingsScreen; 