import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ref, get, set } from 'firebase/database';
import { db, auth } from './firebaseConfig';

export default function AddContact() {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleAddContact = async () => {
    const currentUserId = auth.currentUser?.uid;

    if (!currentUserId || !userId) {
      setMessage('Please enter a valid UserId.');
      return;
    }

    try {
      // Memeriksa apakah UserId yang dimasukkan valid
      const userRef = ref(db, `users/${userId}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        const contactRef = ref(db, `contacts/${currentUserId}/${userId}`);
        
        // Menambahkan kontak ke database
        await set(contactRef, {
          name: userData.name || 'Unknown', // Menggunakan nama dari data user jika ada
          email: userData.email || 'No Email Provided', // Menggunakan email dari data user jika ada
        });

        setMessage('Contact added successfully!');
        setUserId('');
      } else {
        setMessage('UserId does not exist. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to add contact. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Contact</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter UserId"
        placeholderTextColor="#888"
        value={userId}
        onChangeText={setUserId}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
        <Text style={styles.addButtonText}>Add Contact</Text>
      </TouchableOpacity>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1F1F1F',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 15,
  },
});
