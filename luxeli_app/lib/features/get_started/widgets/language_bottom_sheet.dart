import 'package:flutter/material.dart';
import 'package:luxeli_app/features/get_started/providers/language_provider.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/ui_components/buttons/primary_button.dart';

class LanguageBottomSheet extends StatelessWidget {
  const LanguageBottomSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(32),
          topRight: Radius.circular(32),
          bottomRight: Radius.circular(32),
          bottomLeft: Radius.circular(32),
        ),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildTitle(),
              SizedBox(height: 24),
              _buildLanguageOptions(context),
              SizedBox(height: 32),
              _buildConfirmButton(context),
              SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTitle() {
    return Text(
      'Choose Your Language',
      style: TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: Colors.black,
        letterSpacing: -0.5,
      ),
    );
  }

  Widget _buildLanguageOptions(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, provider, child) {
        return Column(
          children: provider.languages.map((language) {
            return Material(
              color: language.isSelected
                  ? const Color(0xFF003366).withAlpha(25)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(12),
              child: InkWell(
                onTap: () {
                  provider.selectLanguage(language.code);
                },
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ClipOval(
                        child: SizedBox(
                          width: 40,
                          height: 40,
                          child: Center(
                            child: Text(
                              language.flagEmoji,
                              style: const TextStyle(fontSize: 28),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Center(
                        child: Text(
                          language.name,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        );
      },
    );
  }

  Widget _buildConfirmButton(BuildContext context) {
    return PrimaryButton(
      onPressed: () {
        Navigator.pushReplacementNamed(context, '/onboarding');
      },
      text: 'Confirm',
    );
  }
}
