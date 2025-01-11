import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import { ref, onValue, push, remove, set } from 'firebase/database';
import { db, auth } from './firebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ChatScreen({ route, navigation }) {
  const { contact } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false); // Block state
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu open state
  const [isSearchMode, setIsSearchMode] = useState(false); // Search mode state
  const [originalMessages, setOriginalMessages] = useState([]); // Store original messages
  const currentUserId = auth.currentUser?.uid;

  const chatId = [currentUserId, contact.id].sort().join('_'); // Unique chat ID
  const chatRef = ref(db, `chats/${chatId}`);
  const contactsRef = ref(db, `contacts/${contact.id}`); // Reference to contacts for the other user
  const userContactsRef = ref(db, `contacts/${currentUserId}`); // Reference to your own contacts

  useEffect(() => {
    // Check if user already has your contact, if not add it
    const userContactRef = ref(db, `contacts/${currentUserId}/${contact.id}`);
    onValue(userContactRef, (snapshot) => {
      if (!snapshot.exists()) {
        set(userContactRef, {
          name: contact.name,
          id: contact.id,
        });
      }
    });

    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data).map((msg) => ({
          ...msg,
        }));
        setMessages(messageList);
        setOriginalMessages(messageList); // Save the original messages
      } else {
        setMessages([]);
        setOriginalMessages([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSend = () => {
    if (input.trim() === '') return;

    if (isBlocked) {
      Alert.alert('Blocked', 'You cannot send messages to this user as they are blocked.');
      return;
    }

    const newMessage = {
      text: input,
      senderId: currentUserId,
      timestamp: Date.now(),
      private: isPrivate,
    };

    push(chatRef, newMessage);
    setInput('');
  };

  const handleBlock = () => {
    setIsBlocked(!isBlocked);
    if (!isBlocked) {
      // Mark as blocked in both contacts (yourself and the other user)
      set(ref(db, `blocked/${currentUserId}/${contact.id}`), true);
      set(ref(db, `blocked/${contact.id}/${currentUserId}`), true);
    } else {
      // Unblock user
      remove(ref(db, `blocked/${currentUserId}/${contact.id}`));
      remove(ref(db, `blocked/${contact.id}/${currentUserId}`));
    }
    Alert.alert(isBlocked ? 'Unblocked' : 'Blocked', isBlocked ? 'You have unblocked this user.' : 'You have blocked this user.');
    setIsMenuOpen(false); // Close menu after action
  };

  const handleExportChat = () => {
    const chatText = messages.map((msg) => `${msg.senderId === currentUserId ? 'You' : contact.name}: ${msg.text}`).join('\n');
    Alert.alert('Exported Chat', chatText);
    setIsMenuOpen(false); // Close menu after action
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const filteredMessages = originalMessages.filter((message) =>
      message.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setMessages(filteredMessages);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setMessages(originalMessages); // Reset to original messages
    setIsSearchMode(false); // Exit search mode
    setIsMenuOpen(false); // Close menu after clearing search
  };

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Auto-delete messages after 7 days
    const interval = setInterval(() => {
      onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          Object.keys(data).forEach((key) => {
            if (Date.now() - data[key].timestamp > 7 * 24 * 60 * 60 * 1000) {
              remove(ref(db, `chats/${chatId}/${key}`));
            }
          });
        }
      });
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.contactName}>{contact.name}</Text>
        <TouchableOpacity onPress={openMenu}>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Menu Options Modal */}
      {isMenuOpen && (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleBlock}>
            <Text style={styles.menuText}>{isBlocked ? 'Unblock' : 'Block'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleExportChat}>
            <Text style={styles.menuText}>Export Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setIsSearchMode(true)}>
            <Text style={styles.menuText}>Search Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
            <Text style={styles.menuText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Input */}
      {isSearchMode && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
            <Ionicons name="close-circle" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.senderId === currentUserId ? styles.myMessage : styles.theirMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor="#888"
        value={input}
        onChangeText={setInput}
      />
      <View style={styles.actions}>
        <TouchableOpacity style={styles.privateButton} onPress={() => setIsPrivate(!isPrivate)}>
          <Text style={styles.privateText}>
            {isPrivate ? 'Private On' : 'Private Off'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuContainer: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 10,
    zIndex: 1,
  },
  menuItem: {
    padding: 10,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
  },
  clearSearchButton: {
    marginLeft: 10,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#4caf50',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#1F1F1F',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#1F1F1F',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  privateButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 10,
  },
  privateText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 10,
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
