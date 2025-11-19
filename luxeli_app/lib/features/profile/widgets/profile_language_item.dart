import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/profile_screen_provider.dart';

class ProfileLanguageItem extends StatelessWidget {
  final IconData icon;
  final String title;

  const ProfileLanguageItem({
    super.key,
    required this.icon,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: 24.0,
        vertical: 10.0,
      ), // Adjusted vertical padding
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF424242), size: 24),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                color: Color(0xFF424242),
                fontWeight: FontWeight.w500,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Consumer<ProfileScreenProvider>(
            builder: (context, provider, child) {
              return SizedBox(
                width: 120,
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: provider.selectedLanguage,
                    icon: const Icon(
                      Icons.keyboard_arrow_down,
                      color: Color(0xFF757575),
                    ),
                    style: const TextStyle(
                      fontSize: 16,
                      color: Color(0xFF757575),
                      fontWeight: FontWeight.w400,
                    ),
                    onChanged: (String? newValue) {
                      if (newValue != null) {
                        provider.setSelectedLanguage(newValue);
                      }
                    },
                    items: <String>['English', 'Spanish', 'French', 'German']
                        .map<DropdownMenuItem<String>>((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          );
                        })
                        .toList(),
                    isExpanded: false,
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
