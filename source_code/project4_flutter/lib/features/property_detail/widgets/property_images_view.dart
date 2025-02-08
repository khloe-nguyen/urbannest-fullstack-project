import 'package:flutter/material.dart';

class PropertyImagesView extends StatelessWidget {
  final List<String> images;
  final int initialIndex;

  PropertyImagesView({required this.images, required this.initialIndex});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 280,
      child: PageView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: images.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 0.0),
            child: GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => FullScreenImageView(
                      images: images,
                      initialIndex: index,
                    ),
                  ),
                );
              },
              child: ClipRRect(
                child: Image.network(
                  images[index],
                  fit: BoxFit.cover,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class FullScreenImageView extends StatelessWidget {
  final List<String> images;
  final int initialIndex;

  FullScreenImageView({required this.images, required this.initialIndex});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        iconTheme: IconThemeData(color: Colors.white),
      ),
      body: OrientationBuilder(
        builder: (context, orientation) {
          return Center(
            child: PageView.builder(
              scrollDirection: Axis.horizontal,
              controller: PageController(initialPage: initialIndex),
              itemCount: images.length,
              itemBuilder: (context, index) {
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 0.0),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.network(
                      images[index],
                      fit: orientation == Orientation.portrait
                          ? BoxFit.contain
                          : BoxFit.cover,
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
