import 'package:flutter/material.dart';

class ImageContainer extends StatelessWidget {
  final int length;
  final List<String> imageUrls;

  const ImageContainer({
    super.key,
    required this.length,
    required this.imageUrls,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: ListView.builder(
        itemCount: length,
        itemBuilder: (context, index) {
          // Check if the image URL is valid
          final imageUrl = imageUrls[index];
          return SizedBox(
            width: 50,
            height: 50,
            child: Image.network(
              imageUrl,
              fit: BoxFit.cover,
              loadingBuilder: (context, child, loadingProgress) {
                if (loadingProgress == null) {
                  return child;
                } else {
                  return Center(
                    child: CircularProgressIndicator(
                      value: loadingProgress.expectedTotalBytes != null
                          ? loadingProgress.cumulativeBytesLoaded /
                              (loadingProgress.expectedTotalBytes ?? 1)
                          : null,
                    ),
                  );
                }
              },
            ),
          );
        },
      ),
    );
  }
}
