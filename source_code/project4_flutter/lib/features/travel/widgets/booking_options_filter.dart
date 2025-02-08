import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/shared/bloc/amenity_cubit/amenity_cubit.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_cubit.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_state.dart';

class BookingOptionsFilter extends StatefulWidget {
  const BookingOptionsFilter({super.key});

  @override
  State<BookingOptionsFilter> createState() => _BookingOptionsFilterState();
}

class _BookingOptionsFilterState extends State<BookingOptionsFilter> {
  late FilterCubit getFilterCubit;

  @override
  void initState() {
    super.initState();
    getFilterCubit = context.read<FilterCubit>();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FilterCubit, FilterState>(builder: (context, state) {
      return Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                "Booking Options",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 5),
              Wrap(
                  spacing: 8.0, // Khoảng cách giữa các item theo chiều ngang
                  runSpacing: 8.0, // Khoảng cách giữa các dòng
                  children: [
                    GestureDetector(
                      onTap: () {
                        // Cập nhật trạng thái ở đây
                        getFilterCubit.changeInstant("instant");
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: getFilterCubit.selectedInstant("instant")
                                ? Colors.black
                                : Colors.grey.shade300,
                            width: 1.5,
                          ),
                          color: Colors.white,
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.bolt),
                            const SizedBox(width: 6),
                            Text(
                              "Instant",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight:
                                    getFilterCubit.selectedInstant("instant")
                                        ? FontWeight.bold
                                        : FontWeight.w500,
                                color: Colors.black,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        getFilterCubit.changeSelfCheckIn(true);
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: getFilterCubit.selectedSelfCheckIn(true)
                                ? Colors.black
                                : Colors.grey.shade300,
                            width: 1.5,
                          ),
                          color: Colors.white,
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.key_outlined),
                            const SizedBox(width: 6),
                            Text(
                              "Self Check-in",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight:
                                    getFilterCubit.selectedSelfCheckIn(true)
                                        ? FontWeight.bold
                                        : FontWeight.w500,
                                color: Colors.black,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        getFilterCubit.changePet(true);
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: getFilterCubit.selectedPetAllow(true)
                                ? Colors.black
                                : Colors.grey.shade300,
                            width: 1.5,
                          ),
                          color: Colors.white,
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.savings_outlined),
                            const SizedBox(width: 6),
                            Text(
                              "Pet Allowed",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight:
                                    getFilterCubit.selectedPetAllow(true)
                                        ? FontWeight.bold
                                        : FontWeight.w500,
                                color: Colors.black,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  ]),
            ]),
      );
    });
  }
}
