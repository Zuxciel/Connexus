import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Import Firebase auth

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(null); // Track authenticated user
  
    useEffect(() => {
      // Set up listener to check for auth state changes
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in
          setUser(user);
          navigation.replace('Home'); // Navigate to home after login
        } else {
          // No user is signed in
          setUser(null);
        }
      });
  
      // Cleanup listener on unmount
      return () => unsubscribe();
    }, [navigation]);
  
    const handleSubmit = () => {
      setError(''); // Reset error message
  
      // Firebase authentication
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Logged in successfully
          const user = userCredential.user;
          alert('Welcome back!', `Welcome back, ${user.email}!`);
          // No need to navigate here because it's handled by onAuthStateChanged
        })
        .catch((err) => {
          setError(err.message); // Show error message
        });
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexus</Text>
      <Text style={styles.subtitle}>Welcome Back</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholderTextColor="#6E6E6E" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Enter your password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholderTextColor="#6E6E6E" 
        secureTextEntry 
      />
      
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>
          Don’t have an account? <Text style={styles.highlight}>Sign up</Text>
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

export default LoginScreen;