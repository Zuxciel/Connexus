import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue } from 'firebase/database';
import { db, auth } from './firebaseConfig';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const navigation = useNavigation(); // Untuk navigasi ke AddContact.js

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const contactsRef = ref(db, `contacts/${userId}`);
    const unsubscribe = onValue(contactsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const contactList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setContacts(contactList);
      } else {
        setContacts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleContactPress = (contact) => {
    navigation.navigate('ChatScreen', { contact });
  };

  return (
    <View style={styles.container}>
      {contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any contacts yet.</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddContact')}
          >
            <Text style={styles.addButtonText}>Add Contact</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.contactItem} onPress={() => handleContactPress(item)}>
              <Text style={styles.contactName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactItem: {
    backgroundColor: '#1F1F1F',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  contactName: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  contactEmail: {
    fontSize: 12,
    color: '#8E8E8E',
  },
}); 