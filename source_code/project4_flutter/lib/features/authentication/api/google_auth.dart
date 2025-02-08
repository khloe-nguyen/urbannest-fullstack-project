import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

class GoogleAuth {
  Future<String?> handleGoogleSignIn() async {
    await GoogleSignIn().signOut();
    final GoogleSignInAccount? gUser = await GoogleSignIn().signIn();

    if (gUser == null) return null;

    return gUser.email;
  }
}
