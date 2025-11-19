import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';

class ProfileHeader extends StatelessWidget {
  const ProfileHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
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
              _showLogoutConfirmation(context);
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
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
              elevation: 2,
            ),
          ),
        ],
      ),
    );
  }

  void _showLogoutConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Logout'),
          content: const Text(
            'Are you sure you want to logout? You will need to scan a QR code again to log in.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close dialog
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                // Clear guest data and navigate to QR scanner
                Provider.of<GuestProvider>(
                  context,
                  listen: false,
                ).clearGuestData();
                Navigator.of(context).pop(); // Close dialog
                Navigator.pushReplacementNamed(context, '/qr-scanner');
              },
              child: const Text('Logout', style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }
}
