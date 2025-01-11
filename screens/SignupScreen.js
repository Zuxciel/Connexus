import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set, onValue } from 'firebase/database';
import { auth, db } from './firebaseConfig'; // Import Firebase auth and db

function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState(''); // Input for user name
    const [error, setError] = useState('');
    const [nameExists, setNameExists] = useState(false); // To track if the name exists
  
    useEffect(() => {
      // Real-time listener to check if name already exists
      const usersRef = ref(db, 'users/');
      const unsubscribe = onValue(usersRef, (snapshot) => {
        let exists = false;
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().name === name) {
            exists = true;
          }
        });
        setNameExists(exists);
      });
  
      // Cleanup listener
      return () => unsubscribe();
    }, [name]);
  
    const handleSubmit = () => {
      setError(''); // Reset error message
  
      // Validasi password dan konfirmasi password
      if (password !== confirmPassword) {
        setError("Passwords don't match!");
        return;
      }
  
      // Validasi nama, pastikan tidak kosong
      if (name.trim() === '') {
        setError("Name can't be empty!");
        return;
      }
  
      // Validasi nama, pastikan nama tidak digunakan
      if (nameExists) {
        setError("Name already taken. Please choose another one.");
        return;
      }
  
      // Daftarkan user menggunakan Firebase Authentication
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
  
          // Menyimpan data pengguna (email, nama, displayName) ke Firebase Realtime Database
          set(ref(db, 'users/' + user.uid), {
            email: user.email,
            name: name,
            createdAt: new Date().toISOString(),
          });
  
          // Mengatur displayName di Firebase Authentication
          updateProfile(user, {
            displayName: name, // Menyimpan nama pengguna sebagai displayName
          })
            .then(() => {
              alert('Welcome!', `Welcome, ${user.email}!`);
              // Redirect user ke halaman explore
              navigation.replace('Home'); // Navigate to 'Explore' screen
            })
            .catch((err) => {
              setError("Failed to update user profile: " + err.message);
            });
        })
        .catch((err) => {
          setError(err.message); // Menampilkan error jika ada masalah
        });
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexus</Text>
      <Text style={styles.subtitle}>Create an Account</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        value={name}
        onChangeText={setName}
        placeholderTextColor="#6E6E6E" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#6E6E6E" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#6E6E6E" 
        secureTextEntry 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Confirm your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#6E6E6E" 
        secureTextEntry 
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signupText}>
          Already have an account? <Text style={styles.highlight}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3A86FF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#3A86FF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 20,
  },
  highlight: {
    color: '#3A86FF',
    fontWeight: 'bold',
  },
  error: {
    color: '#ff0000',
    fontWeight: 'bold',
  },
});

export default SignupScreen;