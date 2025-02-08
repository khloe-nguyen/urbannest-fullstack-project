import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:project4_flutter/features/property_detail/property_detail.dart';

import 'package:project4_flutter/features/travel/widgets/travel_card.dart';

import 'package:project4_flutter/features/travel/widgets/travel_header.dart';
import 'package:project4_flutter/shared/bloc/amenity_cubit/amenity_cubit.dart';
import 'package:project4_flutter/shared/bloc/amenity_cubit/amenity_state.dart';
import 'package:project4_flutter/shared/bloc/category_cubit/category_cubit.dart';
import 'package:project4_flutter/shared/bloc/favourite_cubit/favourite_cubit.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_cubit.dart';
import 'package:project4_flutter/shared/bloc/filter_cubit/filter_state.dart';
import 'package:project4_flutter/shared/bloc/travel_cubit/travel_cubit.dart';
import 'package:project4_flutter/shared/bloc/travel_cubit/travel_state.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_cubit.dart';
import 'package:project4_flutter/shared/bloc/user_cubit/user_state.dart';
import 'package:project4_flutter/shared/models/travel_entity.dart';

import '../../shared/bloc/city_cubit/city_cubit.dart';
import '../../shared/bloc/city_cubit/city_state.dart';

class Travel extends StatefulWidget {
  const Travel({super.key});

  @override
  State<Travel> createState() => _TravelState();
}

class _TravelState extends State<Travel> {
  final _myController = ScrollController();
  late TravelCubit getTravelCubit;
  late CategoryCubit getCategoryCubit;
  late AmenityCubit getAmenityCubit;
  late FilterCubit getFilterCubit;
  late List<TravelEntity>? _travels;
  late CityCubit getCityCubit;

  void _myScrollListener() {
    if (_myController.offset >= _myController.position.maxScrollExtent &&
        !_myController.position.outOfRange &&
        !getTravelCubit.isLoading) {
      //scroll up => get more with this category
      getTravelCubit.getPropertyList();
    }
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _myController.addListener(_myScrollListener);
    getTravelCubit = context.read<TravelCubit>();
    getCategoryCubit = context.read<CategoryCubit>();
    getAmenityCubit = context.read<AmenityCubit>();
    getFilterCubit = context.read<FilterCubit>();
    getCityCubit = context.read<CityCubit>();

    //get new at begin
    if (getTravelCubit.state is TravelNotAvailable) {
      getTravelCubit.changeCategory(getCategoryCubit.categoryId);
    }
  }

  @override
  void dispose() {
    super.dispose();
    _myController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const TravelHeader(),
      body: RefreshIndicator(
        onRefresh: () {
          return getTravelCubit.reRender();
        },
        displacement: 0.0,
        child: MultiBlocListener(
          listeners: [
            BlocListener<UserCubit, UserState>(
              listener: (context, state) {
                if (state is UserSuccess) {
                  context.read<FavouriteCubit>().getFavourites();
                }
              },
            ),
            BlocListener<AmenityCubit, AmenityState>(
              listener: (context, state) {
                if (state is ChangeSuccess) {
                  getTravelCubit
                      .changeAmenity(getAmenityCubit.selectedAmenityIdList);
                }
              },
            ),
            BlocListener<CityCubit, CityState>(
              listener: (context, state) {
                if (state is CityChangeSuccess) {
                  getTravelCubit.changeCity(getCityCubit.city);
                }
                if (state is DistrictChangeSuccess) {
                  getTravelCubit.changeDistrict(getCityCubit.district);
                }
                if (state is WardChangeSuccess) {
                  getTravelCubit.changeWard(getCityCubit.ward);
                }
              },
            ),
            BlocListener<FilterCubit, FilterState>(
              listener: (context, state) {
                if (state is SearchNameChangeSuccess) {
                  getTravelCubit.changeSearchName(getFilterCubit.searchName);
                }
                if (state is DateChangeSuccess) {
                  getTravelCubit.changeDates(
                      getFilterCubit.startDate, getFilterCubit.endDate);
                }
                if (state is GuestChangeSuccess) {
                  getTravelCubit.changeGuest(getFilterCubit.guest);
                }
                if (state is PropertyTypeChangeSuccess) {
                  getTravelCubit
                      .changePropertyType(getFilterCubit.propertyType);
                }
                if (state is PriceChangeSuccess) {
                  getTravelCubit.changePrice(getFilterCubit.priceRange);
                }
                if (state is RoomChangeSuccess) {
                  getTravelCubit.changeRoom(getFilterCubit.room);
                }
                if (state is BedChangeSuccess) {
                  getTravelCubit.changeBed(getFilterCubit.bed);
                }
                if (state is BathChangeSuccess) {
                  getTravelCubit.changeBathRoom(getFilterCubit.bathRoom);
                }
                if (state is IsPetAllowedChangeSuccess) {
                  getTravelCubit.changePet(getFilterCubit.isPetAllow);
                }
                if (state is SelfCheckInChangeSuccess) {
                  getTravelCubit
                      .changeSelfCheckIn(getFilterCubit.isSelfCheckIn);
                }
                if (state is IsInstantChangeSuccess) {
                  getTravelCubit.changeInstant(getFilterCubit.isInstant);
                }
              },
            ),
            BlocListener<CategoryCubit, int?>(
                //BlocListener: state(categoryId) thay đổi thì get lại list mới
                listener: (BuildContext context, state) {
              getTravelCubit.changeCategory(state);
            })
          ],
          child:
              BlocBuilder<TravelCubit, TravelState>(builder: (context, state) {
            if (state is TravelNotAvailable) {
              return const Center(
                child: CircularProgressIndicator(),
              );
            }
            _travels = context.read<TravelCubit>().travelList;
            return Column(
              children: [
                Expanded(
                    child: ListView.builder(
                  itemCount: _travels!.length + 1,
                  // Thêm 1 phần tử để hiển thị loading hoặc thông báo
                  controller: _myController,
                  itemBuilder: (context, index) {
                    if (index == _travels!.length) {
                      if (getTravelCubit.isLoading) {
                        // Đang tải thêm dữ liệu
                        return const Padding(
                          padding: EdgeInsets.all(8.0),
                          child: Center(child: CircularProgressIndicator()),
                        );
                      } else {
                        // Hết dữ liệu, hiển thị thông báo
                        return const Padding(
                          padding: EdgeInsets.all(8.0),
                          child: Center(
                            child: Text(
                              "Nothing to show more",
                              style:
                                  TextStyle(color: Colors.grey, fontSize: 16),
                            ),
                          ),
                        );
                      }
                    }
                    // Hiển thị dữ liệu
                    return InkWell(
                      onTap: () {
                        print(_travels![index].id);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                PropertyDetail(_travels![index].id),
                          ),
                        );
                      },
                      splashColor:
                          Colors.blue.withOpacity(0.3), // Ripple effect color
                      highlightColor: Colors.blue.withOpacity(0.1), // Ho
                      child: Container(
                        padding: const EdgeInsets.all(13),
                        child: TravelCard(travel: _travels![index]),
                      ),
                    );
                  },
                ))
              ],
            );
          }),
        ),
      ),
    );
  }
}
