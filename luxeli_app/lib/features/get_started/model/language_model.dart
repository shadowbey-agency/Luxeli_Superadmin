class LanguageModel {
  final String code;
  final String name;
  final String flagEmoji;
  final bool isSelected;

  LanguageModel({
    required this.code,
    required this.name,
    required this.flagEmoji,
    this.isSelected = false,
  });

  LanguageModel copyWith({
    String? code,
    String? name,
    String? flagEmoji,
    bool? isSelected,
  }) {
    return LanguageModel(
      code: code ?? this.code,
      name: name ?? this.name,
      flagEmoji: flagEmoji ?? this.flagEmoji,
      isSelected: isSelected ?? this.isSelected,
    );
  }
}
