import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../profile/providers/profile_provider.dart';

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
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
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
          Builder(
            builder: (BuildContext context) {
              try {
                // Try to access the provider
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
