import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_cubit.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_state.dart';

class PriceFilter extends StatefulWidget {
  const PriceFilter({super.key});

  @override
  State<PriceFilter> createState() => _PriceFilterState();
}

class _PriceFilterState extends State<PriceFilter> {
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
        decoration: const BoxDecoration(
          border: Border(
            bottom:
                BorderSide(color: Color.fromRGBO(128, 128, 128, 0.3), width: 1),
            // Border dưới
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              "Price",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            RangeSlider(
              values: getFilterCubit.currentRangeValues,
              max: 1000,
              activeColor: Colors.red,
              labels: RangeLabels(
                getFilterCubit.currentRangeValues.start.round().toString(),
                getFilterCubit.currentRangeValues.end.round().toString(),
              ),
              onChanged: (RangeValues values) {
                getFilterCubit.changePrice([values.start, values.end]);
              },
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "${getFilterCubit.currentRangeValues.start.round()}\$",
                  style: const TextStyle(fontSize: 14),
                ),
                Text(
                  "${getFilterCubit.currentRangeValues.end.round()}\$",
                  style: const TextStyle(fontSize: 14),
                ),
              ],
            ),
            const SizedBox(
              height: 8,
            )
          ],
        ),
      );
    });
  }
}
