import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:project4_flutter/features/messages/message.dart';
import 'package:project4_flutter/features/messages/widgets/messages_body.dart';
import 'package:project4_flutter/home_screen.dart';
import 'package:project4_flutter/main.dart';

Future<void> handleBackgroundMessage(RemoteMessage message) async {
  print("zzzzzzzzzzzzzzzzzzzzzzzzz");
}

void handleMessage(RemoteMessage? message) {
  if (message == null) return;

  navigatorKey.currentState!.push(MaterialPageRoute(
    builder: (context) {
      return const HomeScreen();
    },
    settings: const RouteSettings(
      arguments: 'Hello, this is your message!',
    ),
  ));
}

class FirebaseApi {
  final _firebaseMessaging = FirebaseMessaging.instance;

  Future initPushNotifications() async {
    await FirebaseMessaging.instance
        .setForegroundNotificationPresentationOptions(
            alert: true, badge: true, sound: true);

    FirebaseMessaging.instance.getInitialMessage().then(handleMessage);
    FirebaseMessaging.onMessageOpenedApp.listen(handleMessage);
    FirebaseMessaging.onBackgroundMessage(handleBackgroundMessage);
  }

  Future<String?> initNotifications() async {
    await _firebaseMessaging.requestPermission();
    final fCMToken = await _firebaseMessaging.getToken();
    print(fCMToken);
    initPushNotifications();
    return fCMToken;
  }
}
