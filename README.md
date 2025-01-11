# 🌐 Connexus - Your All-in-One Contact Manager 📱

Welcome to **Connexus**, a user-friendly mobile app designed to organize and manage your contacts with ease. With its seamless integration and sleek design, Connexus ensures you stay connected like never before! 🚀

---

## ✨ Features
- 📋 **Add, Edit, and Delete Contacts**: Manage your contacts effortlessly.
- 🌟 **Real-time Updates**: Synchronize contacts across devices using Firebase.
- 🔍 **Search Functionality**: Quickly find any contact with a powerful search bar.
- 🖼️ **Customizable Profiles**: Add profile pictures to make your contact list visually engaging.
- 🎨 **Dark Mode**: A beautiful interface optimized for both light and dark themes.

---

## 🛠️ Technologies Used
- **Frontend**: [React Native](https://reactnative.dev/) (Expo Framework)
- **Backend**: [Firebase](https://firebase.google.com/) for Authentication and Realtime Database
- **State Management**: React Hooks (useState, useEffect)
- **Navigation**: React Navigation

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
- Node.js (v16 or higher)
- Expo CLI
- A Firebase account with Realtime Database and Auth enabled

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Connexus.git

2. Navigate to the project directory:
   ```bash
   cd Connexus
3. Install dependencies:
   ```bash
   npx expo install
4. Start the development server:
   ```bash
   npx expo start

##⚙️ Firebase Configuration
To connect Connexus to your Firebase project:

Go to the Firebase Console.
1. Create a new project or use an existing one.
2. Enable Authentication and Realtime Database.
3. Download the google-services.json file (for Android) or GoogleService-Info.plist (for iOS).
4. Replace the placeholder Firebase configuration in the firebaseConfig.js file with your project's credentials:
   ```javascript
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID",
   };

##🤝 Contributing
Contributions are welcome! 🎉

##🛡️ License
This project is licensed under the MIT License. See the LICENSE file for details.

##❤️ Acknowledgments
- Thanks to the React Native and Firebase communities.
- Special thanks to contributors and testers.

**"Stay connected, stay efficient with Connexus!" 🌟**
