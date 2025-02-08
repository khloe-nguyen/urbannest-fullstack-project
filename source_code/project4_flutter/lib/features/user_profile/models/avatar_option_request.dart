import 'package:image_picker/image_picker.dart';

class AvatarOptionRequest{
    String avatarFileImageUri;
    String avatarOption;

    AvatarOptionRequest({required this.avatarFileImageUri, required this.avatarOption});

    Map<String, dynamic> toJson() {
      return {
        'avatarOption': avatarOption,
      };
    }
}