import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_cubit.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_state.dart';

class PropertyTypeFilter extends StatefulWidget {
  const PropertyTypeFilter({super.key});

  @override
  State<PropertyTypeFilter> createState() => _PropertyTypeFilterState();
}

class _PropertyTypeFilterState extends State<PropertyTypeFilter> {
  late FilterCubit getFilterCubit;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getFilterCubit = context.read<FilterCubit>();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FilterCubit, FilterState>(
      builder: (context, state) {
        return Container(
          decoration: const BoxDecoration(
            border: Border(
              bottom: BorderSide(
                  color: Color.fromRGBO(128, 128, 128, 0.3), width: 1),
              // Border dưới
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                "Property Type",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              Row(
                children: [
                  Expanded(
                      child: GestureDetector(
                    onTap: () {
                      getFilterCubit.changePropertyType("sharedroom");
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(
                          horizontal: 5, vertical: 0),
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      decoration: BoxDecoration(
                          border: Border.all(
                              width: 1.5,
                              color: getFilterCubit
                                      .selectedPropertyType("sharedroom")
                                  ? Colors.black
                                  : Colors.grey.shade300),
                          borderRadius: BorderRadius.circular(8)),
                      child: const Text(
                        "Shared Room",
                        textAlign: TextAlign.center,
                      ),
                    ),
                  )),
                  Expanded(
                      child: GestureDetector(
                    onTap: () {
                      getFilterCubit.changePropertyType("hotel");
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(
                          horizontal: 5, vertical: 20),
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      decoration: BoxDecoration(
                          border: Border.all(
                              width: 1.5,
                              color:
                                  getFilterCubit.selectedPropertyType("hotel")
                                      ? Colors.black
                                      : Colors.grey.shade300),
                          borderRadius: BorderRadius.circular(8)),
                      child: const Text(
                        "Hotel",
                        textAlign: TextAlign.center,
                      ),
                    ),
                  )),
                  Expanded(
                      child: GestureDetector(
                    onTap: () {
                      getFilterCubit.changePropertyType("fullhouse");
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(
                          horizontal: 5, vertical: 20),
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      decoration: BoxDecoration(
                          border: Border.all(
                              width: 1.5,
                              color: getFilterCubit
                                      .selectedPropertyType("fullhouse")
                                  ? Colors.black
                                  : Colors.grey.shade300),
                          borderRadius: BorderRadius.circular(8)),
                      child: const Text(
                        "Full House",
                        textAlign: TextAlign.center,
                      ),
                    ),
                  )),
                ],
              )
            ],
          ),
        );
      },
    );
  }
}
