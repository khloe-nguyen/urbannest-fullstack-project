import 'package:animated_search_bar/animated_search_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_advanced_avatar/flutter_advanced_avatar.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/property_calendar/property_calendar.dart';
import 'package:project4_flutter/features/trips/models/booking_minimize_dto.dart';
import 'package:project4_flutter/shared/bloc/listing_list_cubit/listing_list_cubit.dart';
import 'package:project4_flutter/shared/bloc/listing_list_cubit/listing_list_state.dart';
import 'package:project4_flutter/shared/bloc/property_calendar_cubit/property_calendar_cubit.dart';
import 'package:project4_flutter/shared/models/dchc_dto.dart';

import '../../main.dart';

class ListingList extends StatefulWidget {
  const ListingList({super.key});

  @override
  State<ListingList> createState() => _ListingListState();
}

class _ListingListState extends State<ListingList> {
  final TextEditingController textController = TextEditingController();

  ListingListCubit getListingCubit() {
    return context.read<ListingListCubit>();
  }

  List<Map<String, String>> listStatus = [
    {'label': 'Public', 'value': 'public'},
    {'label': 'In progress', 'value': 'progress'},
  ];

  @override
  void initState() {
    super.initState();

    if (getListingCubit().state is ListingListNotAvailable) {
      getListingCubit().getListing();
    }
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () {
        return getListingCubit().reFetch();
      },
      child: Scaffold(
        appBar: AppBar(
          forceMaterialTransparency: true,
          toolbarHeight: 80,
          bottom: PreferredSize(
            preferredSize:
                const Size.fromHeight(1.0), // Set the height of the border
            child: Container(
              color: const Color.fromARGB(30, 0, 0, 0), // Border color
              height: 1.0, // Border thickness
            ),
          ),
          leading: IconButton(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.keyboard_arrow_left_outlined),
          ),
          actions: [
            SizedBox(
              width: MediaQuery.of(context).size.width * 0.7,
              child: AnimatedSearchBar(
                onChanged: (value) {
                  getListingCubit().searchListing(value);
                },
              ),
            ),
          ],
        ),
        body: BlocBuilder<ListingListCubit, ListingListState>(
          builder: (context, state) {
            List<PropertyMinimizeDto> listings = getListingCubit().properties;
            List<PropertyMinimizeDto> publicListing = listings
                .where(
                  (element) => element.status == "PUBLIC",
                )
                .toList();

            return SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Your listings",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 30,
                      ),
                    ),
                    const SizedBox(
                      height: 20,
                    ),
                    if (publicListing.isNotEmpty)
                      ...publicListing.map(
                        (e) {
                          late Level1 province;
                          late Level2 district;

                          if (e.addressCode.isNotEmpty) {
                            province = dchc.data
                                .where((dchcProvince) =>
                                    dchcProvince.level1Id ==
                                    e.addressCode.split("_")[0])
                                .first;
                            district = province.level2S
                                .where((dchcDistrict) =>
                                    dchcDistrict.level2Id ==
                                    e.addressCode.split("_")[1])
                                .first;
                          }

                          return InkWell(
                            onTap: () {
                              Navigator.push(context, MaterialPageRoute(
                                builder: (context) {
                                  return BlocProvider(
                                    create: (_) => PropertyCalendarCubit(),
                                    child: PropertyCalendar(
                                      propertyId: e.id,
                                    ),
                                  );
                                },
                              ));
                            },
                            child: Padding(
                              padding:
                                  const EdgeInsets.symmetric(vertical: 10.0),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  AdvancedAvatar(
                                    name: "room",
                                    foregroundDecoration: BoxDecoration(
                                        border: Border.all(
                                            color: Colors.red, width: 2),
                                        borderRadius:
                                            BorderRadius.circular(10)),
                                    decoration: BoxDecoration(
                                        borderRadius:
                                            BorderRadius.circular(10)),
                                    statusAlignment: Alignment.topRight,
                                    image: NetworkImage(e.propertyImages[0]),
                                    size: 100,
                                  ),
                                  const SizedBox(
                                    width: 20,
                                  ),
                                  Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        e.propertyTitle,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      ),
                                      ConstrainedBox(
                                        constraints: BoxConstraints(
                                          maxWidth: MediaQuery.of(context)
                                                  .size
                                                  .width *
                                              0.5,
                                        ),
                                        child: Text(
                                          softWrap: true,
                                          "${province.name}, ${district.name}",
                                          style: const TextStyle(
                                            fontWeight: FontWeight.w400,
                                            fontSize: 14,
                                          ),
                                        ),
                                      ),
                                      Text(
                                          "Instant book: ${e.bookingType == "instant" ? "On" : "Off"}")
                                    ],
                                  )
                                ],
                              ),
                            ),
                          );
                        },
                      )
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
