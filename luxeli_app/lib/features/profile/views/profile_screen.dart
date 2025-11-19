import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/profile_provider.dart';
import '../widgets/profile_info_card.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF1A2B47),
      body: Stack(
        children: [
          SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 45, left: 24, right: 24),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Profile',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 34,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      ElevatedButton.icon(
                        onPressed: () {
                          // Handle logout
                          print('Logout pressed');
                        },
                        icon: const Icon(
                          Icons.logout,
                          color: Color(0xFFE53935),
                          size: 20,
                        ), // Red icon
                        label: const Text(
                          'Log out',
                          style: TextStyle(
                            color: Color(0xFFE53935), // Red text
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 18,
                            vertical: 10,
                          ),
                          elevation: 2,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(
                  height: 16,
                ), // Space between header and white card
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(20),
                        topRight: Radius.circular(20),
                      ),
                    ),
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(vertical: 20.0),
                      child: Column(
                        children: [
                          const ProfileInfoCard(),
                          const Divider(
                            indent: 24,
                            endIndent: 24,
                            height: 0,
                            thickness: 0.8,
                            color: Color(0xFFE0E0E0),
                          ),
                          ProfileLanguageItem(
                            icon: Icons.language,
                            title: 'Language',
                            selectedValue:
                                'English', // Default selected language
                            onChanged: (String? newValue) {
                              // Handle language change
                              print('Language changed to: $newValue');
                            },
                          ),
                          const Divider(
                            indent: 24,
                            endIndent: 24,
                            height: 0,
                            thickness: 0.8,
                            color: Color(0xFFE0E0E0),
                          ),
                          ProfileNotificationItem(
                            icon: Icons.notifications_none,
                            title: 'Notifications',
                          ),
                          const Divider(
                            indent: 24,
                            endIndent: 24,
                            height: 0,
                            thickness: 0.8,
                            color: Color(0xFFE0E0E0),
                          ),
                          ProfileListItem(
                            icon: Icons.description_outlined,
                            title: 'Terms & Conditions',
                            showArrow: true,
                            onTap: () => print('Terms & Conditions tapped'),
                          ),
                          const Divider(
                            indent: 24,
                            endIndent: 24,
                            height: 0,
                            thickness: 0.8,
                            color: Color(0xFFE0E0E0),
                          ),
                          ProfileListItem(
                            icon: Icons.privacy_tip_outlined,
                            title: 'Privacy Policy',
                            showArrow: true,
                            onTap: () => print('Privacy Policy tapped'),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class ProfileListItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? value;
  final bool showArrow;
  final VoidCallback? onTap;

  const ProfileListItem({
    super.key,
    required this.icon,
    required this.title,
    this.value,
    this.showArrow = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Row(
          children: [
            Icon(
              icon,
              color: const Color(0xFF424242),
              size: 13.333333969116211,
            ), // Dark grey icon
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF424242), // Dark grey text
                  fontWeight: FontWeight.w500,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (value != null)
              Text(
                value!,
                style: const TextStyle(
                  fontSize: 13,
                  color: Color(0xFF757575),
                  fontWeight: FontWeight.w400,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            if (showArrow) ...[
              const SizedBox(width: 8),
              Icon(
                Icons.arrow_forward_ios,
                color: const Color(0xFFBDBDBD),
                size: 16,
              ), // Light grey arrow
            ],
          ],
        ),
      ),
    );
  }
}

class ProfileLanguageItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String selectedValue;
  final ValueChanged<String?>? onChanged;

  const ProfileLanguageItem({
    super.key,
    required this.icon,
    required this.title,
    required this.selectedValue,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: 24.0,
        vertical: 2.0,
      ), // Adjusted vertical padding
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF424242), size: 13.333333969116211),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 13,
                color: Color(0xFF424242),
                fontWeight: FontWeight.w500,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: selectedValue,
              icon: const Icon(
                Icons.keyboard_arrow_down,
                color: Color(0xFF757575),
              ),
              style: const TextStyle(
                fontSize: 13,
                color: Color(0xFF757575),
                fontWeight: FontWeight.w400,
              ),
              onChanged: onChanged,
              items: <String>['English', 'Spanish', 'French', 'German']
                  .map<DropdownMenuItem<String>>((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value),
                    );
                  })
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class ProfileNotificationItem extends StatelessWidget {
  final IconData icon;
  final String title;

  const ProfileNotificationItem({
    super.key,
    required this.icon,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 2.0),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF424242), size: 13.333333969116211),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 13,
                color: Color(0xFF424242),
                fontWeight: FontWeight.w500,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Builder(
            builder: (BuildContext context) {
              try {
                final profileProvider = Provider.of<ProfileProvider>(
                  context,
                  listen: false,
                );
                return Switch(
                  value: profileProvider.notificationsEnabled,
                  onChanged: (newValue) {
                    profileProvider.toggleNotifications(newValue);
                  },
                  activeThumbColor: const Color(
                    0xFF66BB6A,
                  ), // Green color for active switch
                  inactiveThumbColor: const Color(
                    0xFFE0E0E0,
                  ), // Light grey for inactive thumb
                  inactiveTrackColor: const Color(
                    0xFFF5F5F5,
                  ), // Very light grey for inactive track
                );
              } catch (e) {
                // Fallback if provider is not available
                return Switch(
                  value: true,
                  onChanged: (newValue) {
                    print('ProfileProvider not available: $e');
                  },
                  activeThumbColor: const Color(0xFF66BB6A),
                  inactiveThumbColor: const Color(0xFFE0E0E0),
                  inactiveTrackColor: const Color(0xFFF5F5F5),
                );
              }
            },
          ),
        ],
      ),
    );
  }
}
