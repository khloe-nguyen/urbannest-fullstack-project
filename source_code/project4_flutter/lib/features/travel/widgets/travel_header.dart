import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:project4_flutter/features/travel/widgets/filter_popup.dart';
import 'package:project4_flutter/features/travel/widgets/search_popup.dart';
import 'package:project4_flutter/features/travel/widgets/travel_category.dart';

class TravelHeader extends StatelessWidget implements PreferredSizeWidget {
  const TravelHeader({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(170);

  void _showFilterPopup(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(16), // Bo góc phía trên
        ),
      ),
      isScrollControlled: true, // Cho phép nội dung cuộn nếu cần
      builder: (context) {
        return const FilterPopup(); // Hiển thị widget FilterPopup
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return AppBar(
      forceMaterialTransparency: true,
      toolbarHeight: 170,
      actions: [
        SizedBox(
          width: MediaQuery.of(context).size.width,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Column(
              mainAxisSize:
                  MainAxisSize.min, // Ensures the Column doesn't overflow
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    //SearchBar here
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 0, vertical: 16),
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(35),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.5),
                              spreadRadius: -5,
                              blurRadius: 9,
                              offset: const Offset(0, 1),
                            ),
                          ],
                        ),
                        child: ElevatedButton(
                          onPressed: () {
                            showModalBottomSheet(
                              context: context,
                              isScrollControlled: true,
                              shape: const RoundedRectangleBorder(
                                borderRadius: BorderRadius.vertical(
                                  top: Radius.circular(20),
                                ),
                              ),
                              builder: (BuildContext context) {
                                return const SearchPopup();
                              },
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            padding: const EdgeInsetsDirectional.symmetric(
                              vertical: 10,
                              horizontal: 15,
                            ),
                          ),
                          child: const Row(
                            children: [
                              Icon(
                                Icons.search,
                                color: Colors.black,
                                weight: 20,
                                size: 30,
                              ),
                              SizedBox(width: 10),
                              Column(
                                mainAxisSize: MainAxisSize.min,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "Where to?",
                                    textAlign: TextAlign.left,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: 16,
                                      color: Colors.black,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    "Any where - any week - any time",
                                    overflow: TextOverflow.ellipsis,
                                    maxLines: 1,
                                    softWrap: false,
                                    style: TextStyle(
                                      color: Color.fromARGB(150, 0, 0, 0),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    //FilterButton here
                    SizedBox(
                      width: 40,
                      child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            shape: const LinearBorder(),
                            padding: const EdgeInsets.all(0),
                          ),
                          onPressed: () {
                            _showFilterPopup(context);
                          },
                          child: const HugeIcon(
                            icon: HugeIcons.strokeRoundedPreferenceHorizontal,
                            color: Colors.black,
                            size: 25.0,
                          )),
                    )
                  ],
                ),
                const Expanded(
                  child: TravelCategory(),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
