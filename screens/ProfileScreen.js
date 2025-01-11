import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Clipboard, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from './firebaseConfig'; // Pastikan firestore terhubung dengan Firebase
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    userId: '',
  });

  const [contacts, setContacts] = useState([]);

  const navigation = useNavigation(); // Untuk navigasi ke layar lain jika diperlukan

  // Mendapatkan data pengguna
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserInfo({
        name: user.displayName || 'User Name',
        email: user.email || 'example@gmail.com',
        userId: user.uid || 'User ID not available',
      });
    }
  }, []);

  const copyUserId = () => {
    Clipboard.setString(userInfo.userId);
    Alert.alert('Copied to Clipboard', 'User ID has been copied to clipboard.');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Alert.alert('Logged Out', 'You have successfully logged out.');
      navigation.navigate('Login'); // Navigasi ke layar login setelah logout
    } catch (error) {
      console.error("Error logging out: ", error);
      Alert.alert('Logout Failed', 'There was an error logging you out.');
    }
  };

  const handleAddContact = () => {
    navigation.navigate('AddContact')
  }
  

  return (
    <View style={styles.container}>
      {/* Konten Profil */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userInfo.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userInfo.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>UserID:</Text>
        <Text style={styles.value}>{userInfo.userId}</Text>
        <Button title="Copy UserID" onPress={copyUserId} />
      </View>
      <View style={styles.infoContainer}>
      <Button title="Add Contact" onPress={handleAddContact} />
      </View>

      {/* Logout Button */}
      <Button title="Logout" onPress={handleLogout} color="#f44336" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  topBarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    color: '#bbb',
    fontSize: 16,
  },
  value: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  contactsContainer: {
    marginBottom: 20,
  },
  contactsTitle: {
    color: '#bbb',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactItem: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 10,
  },
  contactName: {
    color: '#fff',
    fontSize: 16,
  },
});
