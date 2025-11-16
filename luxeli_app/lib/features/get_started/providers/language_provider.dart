import 'package:flutter/material.dart';
import 'package:luxeli_app/features/get_started/model/language_model.dart';

class LanguageProvider extends ChangeNotifier {
  List<LanguageModel> _languages = [];
  String? _selectedLanguageCode;

  List<LanguageModel> get languages => _languages;
  String? get selectedLanguageCode => _selectedLanguageCode;

  LanguageModel? get selectedLanguage {
    if (_selectedLanguageCode == null) return null;
    return _languages.firstWhere(
      (lang) => lang.code == _selectedLanguageCode,
      orElse: () => _languages.first,
    );
  }

  void initializeLanguages() {
    _languages = [
      LanguageModel(
        code: 'en',
        name: 'English',
        flagEmoji: '🇺🇸',
        isSelected: true,
      ),
      LanguageModel(
        code: 'fr',
        name: 'Français',
        flagEmoji: '🇫🇷',
        isSelected: false,
      ),
      LanguageModel(
        code: 'ar',
        name: 'العربية',
        flagEmoji: '🇸🇦',
        isSelected: false,
      ),
    ];
    _selectedLanguageCode = 'en';
    notifyListeners();
  }

  void selectLanguage(String languageCode) {
    _selectedLanguageCode = languageCode;
    _languages = _languages.map((lang) {
      return lang.copyWith(isSelected: lang.code == languageCode);
    }).toList();
    notifyListeners();
  }

  void confirmLanguageSelection() {
  
  }
}
