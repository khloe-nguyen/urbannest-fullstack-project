String limitTextTo300Words(String text) {
  List<String> words = text.split(' ');

  if (words.length > 40) {
    words = words.sublist(0, 40);
  }

  return words.join(' ') + (words.length == 40 ? '...' : '');
}
