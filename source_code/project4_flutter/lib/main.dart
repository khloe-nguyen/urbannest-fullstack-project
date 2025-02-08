import 'dart:convert';

import 'package:device_info_plus/device_info_plus.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:project4_flutter/shared/bloc/amenity_cubit/amenity_cubit.dart';
import 'package:project4_flutter/shared/bloc/booking/booking.dart';
import 'package:project4_flutter/shared/bloc/booking/date_booking.dart';
import 'package:project4_flutter/shared/bloc/booking/guest_booking.dart';
import 'package:project4_flutter/shared/bloc/booking/transaction.dart';
import 'package:project4_flutter/shared/bloc/city_cubit/city_cubit.dart';
import 'package:project4_flutter/shared/bloc/favourite_cubit/favourite_cubit.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_cubit.dart';
import 'package:project4_flutter/shared/bloc/listing_list_cubit/listing_list_cubit.dart';
import 'package:project4_flutter/shared/bloc/message_room_cubit/message_room_cubit.dart';
import 'package:project4_flutter/shared/api/firebase_api.dart';
import 'package:project4_flutter/shared/bloc/category_cubit/category_cubit.dart';
import 'package:project4_flutter/shared/bloc/policy_cubit/policy_cubit.dart';
import 'package:project4_flutter/shared/bloc/property_cubit/property_cubit.dart';
import 'package:project4_flutter/shared/bloc/read_review_cubit/review_cubit.dart';
import 'package:project4_flutter/shared/bloc/refund_list_cubit/refund_list_cubit.dart';
import 'package:project4_flutter/shared/bloc/reservation_cubit/reservation_cubit.dart';
import 'package:project4_flutter/shared/bloc/travel_cubit/travel_cubit.dart';
import 'package:project4_flutter/shared/bloc/trip_cubit/trip_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/models/dchc_dto.dart';
import 'package:provider/provider.dart';
import 'app.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

late String? fcmToken;
final navigatorKey = GlobalKey<NavigatorState>();
final format = DateFormat.yMd();
late DCHCDto dchc;
late DatabaseReference databaseRef;

Future loadJsonAsset() async {
  final String jsonString =
      await rootBundle.loadString('assets/data/dchc.json');
  dchc = DCHCDto.fromJson(jsonDecode(jsonString));
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  fcmToken = await FirebaseApi().initNotifications();
  final deviceInfo = await DeviceInfoPlugin().deviceInfo;
  final androidSdkVersion =
      deviceInfo is AndroidDeviceInfo ? deviceInfo.version.sdkInt : 0;
  await loadJsonAsset();
  databaseRef = FirebaseDatabase.instance.ref();
  await dotenv.load(fileName: ".env");

  runApp(
    MultiProvider(
      providers: [
        BlocProvider(
          create: (_) => UserCubit(), // Provide the Cubit
        ),
        BlocProvider(
          create: (_) => TravelCubit(), // Provide the Cubit
        ),
        BlocProvider(
          create: (context) => FavouriteCubit(context.read<UserCubit>()),
        ),
        BlocProvider(
          create: (_) => CategoryCubit(), // Provide the Cubit
        ),
        BlocProvider(
          create: (_) => FilterCubit(), // Provide the Cubit
        ),
        BlocProvider(
          create: (_) => AmenityCubit(), // Provide the Cubit
        ),
        BlocProvider(
          create: (_) => ListingListCubit(), // Provide the Cubit
        ),
        BlocProvider(
          create: (_) => RefundListCubit(), // Provide the Cubit
        ),
        BlocProvider(
          create: (_) => TripCubit(), // Provide the Cubit
        ),
        BlocProvider(
          create: (_) => ReservationCubit(), // Provide the Cubit
        ),
        BlocProvider(
          create: (_) => MessageRoomCubit(), // Provide the Cubit
        ),
        BlocProvider(
          create: (_) => PropertyCubit(),
        ),
        BlocProvider(
          create: (_) => ReviewCubit(),
        ),
        BlocProvider(
          create: (_) => PolicyCubit(),
        ),
        BlocProvider(
          create: (_) => DateBookingCubit(),
        ),
        BlocProvider(
          create: (_) => GuestBookingCubit(),
        ),
        BlocProvider(
          create: (_) => BookingCubit(),
        ),
        BlocProvider(
          create: (_) => TransactionCubit(),
        ),
        BlocProvider(
          create: (_) => CityCubit(), // Provide the Cubit
        ),
      ],
      child: App(androidSdkVersion: androidSdkVersion),
    ),
  );
}
