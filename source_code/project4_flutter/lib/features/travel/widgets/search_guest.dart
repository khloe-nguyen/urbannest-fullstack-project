import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_cubit.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_state.dart';

class SearchGuest extends StatefulWidget {
  const SearchGuest({super.key});

  @override
  State<SearchGuest> createState() => _SearchGuestState();
}

class _SearchGuestState extends State<SearchGuest> {
  int adult = 1;
  int children = 1;

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
          padding: const EdgeInsets.symmetric(vertical: 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                "With Who?",
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                mainAxisSize: MainAxisSize.max,
                children: [
                  const Text("Adult"),
                  Row(
                    children: [
                      getFilterCubit.adult > 1
                          ? IconButton(
                              onPressed: () {
                                getFilterCubit
                                    .changeAdult(getFilterCubit.adult - 1);
                              },
                              icon: const Icon(
                                HugeIcons.strokeRoundedMinusSignCircle,
                              ),
                            )
                          : const SizedBox(
                              width: 48,
                              height: 48,
                            ),
                      Text("${getFilterCubit.adult}+"),
                      getFilterCubit.adult < 16
                          ? IconButton(
                              onPressed: () {
                                getFilterCubit
                                    .changeAdult(getFilterCubit.adult + 1);
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
                  const Text("Children"),
                  Row(
                    children: [
                      getFilterCubit.children > 0
                          ? IconButton(
                              onPressed: () {
                                getFilterCubit.changeChildren(
                                    getFilterCubit.children - 1);
                              },
                              icon: const Icon(
                                HugeIcons.strokeRoundedMinusSignCircle,
                              ),
                            )
                          : const SizedBox(
                              width: 48,
                              height: 48,
                            ),
                      Text("${getFilterCubit.children}+"),
                      getFilterCubit.children < 16
                          ? IconButton(
                              onPressed: () {
                                getFilterCubit.changeChildren(
                                    getFilterCubit.children + 1);
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
