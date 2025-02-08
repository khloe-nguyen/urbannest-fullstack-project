import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_cubit.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_state.dart';
import 'package:table_calendar/table_calendar.dart';

class SearchDate extends StatefulWidget {
  const SearchDate({super.key});

  @override
  State<SearchDate> createState() => _SearchDateState();
}

class _SearchDateState extends State<SearchDate> {
  late FilterCubit getFilterCubit;

  @override
  void initState() {
    super.initState();
    getFilterCubit = context.read<FilterCubit>();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FilterCubit, FilterState>(builder: (context, state) {
      var start = getFilterCubit.startDate;
      var end = getFilterCubit.endDate;

      return Container(
          child: TableCalendar(
        headerStyle: const HeaderStyle(
          formatButtonVisible: false,
          titleCentered: true,
        ),
        focusedDay: start ?? DateTime.now(),
        firstDay: DateTime.now(),
        lastDay: DateTime(DateTime.now().year + 2),
        headerVisible: true,
        selectedDayPredicate: (day) {
          if (start != null && end != null) {
            return day.isAfter(start!) && day.isBefore(end!) ||
                day.isAtSameMomentAs(start!) ||
                day.isAtSameMomentAs(end!);
          } else if (start != null && end == null) {
            return day.isAtSameMomentAs(start!);
          }
          return false;
        },
        onDaySelected: (selectedDay, focusedDay) {
          //mởi mở lên => chọn hnay
          if (start == null && end == null) {
            start = selectedDay;
          }
          //khi click làn 2 (chọn cái end)
          else if (start != null && end == null) {
            end = selectedDay;

            if (end!.isBefore(start!)) {
              final temp = start;
              start = end;
              end = temp;
              //tới đây, đã chọn được cả 2
            }
          }
          //click lần 3 => chọn lại start nên end null
          else {
            start = selectedDay;
            end = null;
          }

          getFilterCubit.updateDates(start, end);
        },
      )); //hiện 2 năm
    });
  }
}
