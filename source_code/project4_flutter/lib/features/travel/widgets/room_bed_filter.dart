import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_cubit.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_state.dart';

class RoomBedFilter extends StatefulWidget {
  const RoomBedFilter({super.key});

  @override
  State<RoomBedFilter> createState() => _RoomBedFilterState();
}

class _RoomBedFilterState extends State<RoomBedFilter> {
  int roomValue = 1;
  int bedroomValue = 1;
  int bathroomValue = 1;

  late FilterCubit getFilterCubit;

  @override
  void initState() {
    super.initState();
    getFilterCubit = context.read<FilterCubit>();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FilterCubit, FilterState>(
      builder: (context, state) {
        return Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: const BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: Color.fromRGBO(128, 128, 128, 0.3),
                width: 1,
              ),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                "Rooms and Beds",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                mainAxisSize: MainAxisSize.max,
                children: [
                  const Text("Room"),
                  Row(
                    children: [
                      getFilterCubit.room > 1
                          ? IconButton(
                              onPressed: () {
                                getFilterCubit
                                    .changeRoom(getFilterCubit.room - 1);
                              },
                              icon: const Icon(
                                HugeIcons.strokeRoundedMinusSignCircle,
                              ),
                            )
                          : const SizedBox(
                              width: 48,
                              height: 48,
                            ),
                      Text("${getFilterCubit.room}+"),
                      getFilterCubit.room < 16
                          ? IconButton(
                              onPressed: () {
                                getFilterCubit
                                    .changeRoom(getFilterCubit.room + 1);
                              },
                              icon: const Icon(
                                HugeIcons.strokeRoundedPlusSignCircle,
                              ),
                            )
                          : const SizedBox(
                              width: 48,
                              height: 48,
                            ),
                    ],
                  ),
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                mainAxisSize: MainAxisSize.max,
                children: [
                  const Text("Bedroom"),
                  Row(
                    children: [
                      getFilterCubit.bed > 1
                          ? IconButton(
                              onPressed: () {
                                getFilterCubit
                                    .changeBed(getFilterCubit.bed - 1);
                              },
                              icon: const Icon(
                                HugeIcons.strokeRoundedMinusSignCircle,
                              ),
                            )
                          : const SizedBox(
                              width: 48,
                              height: 48,
                            ),
                      Text("${getFilterCubit.bed}+"),
                      getFilterCubit.bed < 16
                          ? IconButton(
                              onPressed: () {
                                getFilterCubit
                                    .changeBed(getFilterCubit.bed + 1);
                              },
                              icon: const Icon(
                                HugeIcons.strokeRoundedPlusSignCircle,
                              ),
                            )
                          : const SizedBox(
                              width: 48,
                              height: 48,
                            ),
                    ],
                  ),
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                mainAxisSize: MainAxisSize.max,
                children: [
                  const Text("Bathroom"),
                  Row(
                    children: [
                      getFilterCubit.bathRoom > 1
                          ? IconButton(
                              onPressed: () {
                                getFilterCubit.changeBathroom(
                                    getFilterCubit.bathRoom - 1);
                              },
                              icon: const Icon(
                                HugeIcons.strokeRoundedMinusSignCircle,
                              ),
                            )
                          : const SizedBox(
                              width: 48,
                              height: 48,
                            ),
                      Text("${getFilterCubit.bathRoom}+"),
                      getFilterCubit.bathRoom < 16
                          ? IconButton(
                              onPressed: () {
                                getFilterCubit.changeBathroom(
                                    getFilterCubit.bathRoom + 1);
                              },
                              icon: const Icon(
                                HugeIcons.strokeRoundedPlusSignCircle,
                              ),
                            )
                          : const SizedBox(
                              width: 48,
                              height: 48,
                            ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
