import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

window.DarkNotesNativeAuth = {
  isAvailable() {
    return Capacitor.isNativePlatform();
  },
  async signInWithGoogle() {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('Google-вход доступен в Android-приложении');
    }
    const result = await FirebaseAuthentication.signInWithGoogle({ skipNativeAuth: true });
    const idToken = result.credential?.idToken;
    if (!idToken) {
      throw new Error('Google не вернул токен авторизации');
    }
    return idToken;
  }
};
