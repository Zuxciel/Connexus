import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db, auth } from './firebaseConfig';

export default function GroupsScreen() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    const groupsRef = ref(db, `users/${userId}/groups`);
    const unsubscribe = onValue(groupsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const groupList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setGroups(groupList);
      } else {
        setGroups([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Groups (Comming Soon)</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.groupItem}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupDesc}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
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
  groupItem: {
    backgroundColor: '#1F1F1F',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  groupName: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  groupDesc: {
    fontSize: 12,
    color: '#8E8E8E',
  },
});
