import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';
import 'profile_list_item.dart';
import 'profile_language_item.dart';
import 'profile_notification_item.dart';

class ProfileInfoCard extends StatelessWidget {
  const ProfileInfoCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(13),
            spreadRadius: 0,
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 20.0),
        child: Consumer<GuestProvider>(
          builder: (context, guestProvider, child) {
            final guestData = guestProvider.guestData;

            // Default values if guest data is not available
            final name = guestData?.guestName ?? 'Yassine ZABIR';
            final phone = guestData?.guestPhone ?? '+212/56486234';
            final email = guestData?.guestEmail ?? 'Email@gmail.com';
            final hotel =
                'Chateau Meridian'; // This should come from partner data
            final room = guestData?.roomName ?? '304';
            final checkIn = guestData?.checkInDate ?? 'Jan 15, 10:30 AM';
            final checkOut = guestData?.checkOutDate ?? 'Jan 15, 10:30 AM';

            return Column(
              children: [
                ProfileListItem(
                  icon: Icons.person_outline,
                  title: 'Name',
                  value: name,
                ),
                const Divider(
                  indent: 24,
                  endIndent: 24,
                  height: 0,
                  thickness: 0.8,
                  color: Color(0xFFE0E0E0),
                ),
                ProfileListItem(
                  icon: Icons.phone_outlined,
                  title: 'Phone Number',
                  value: phone,
                ),
                const Divider(
                  indent: 24,
                  endIndent: 24,
                  height: 0,
                  thickness: 0.8,
                  color: Color(0xFFE0E0E0),
                ),
                ProfileListItem(
                  icon: Icons.email_outlined,
                  title: 'Email Address',
                  value: email,
                ),
                const Divider(
                  indent: 24,
                  endIndent: 24,
                  height: 0,
                  thickness: 0.8,
                  color: Color(0xFFE0E0E0),
                ),
                ProfileListItem(
                  icon: Icons.apartment_outlined,
                  title: 'Hotel',
                  value: hotel,
                ),
                const Divider(
                  indent: 24,
                  endIndent: 24,
                  height: 0,
                  thickness: 0.8,
                  color: Color(0xFFE0E0E0),
                ),
                ProfileListItem(
                  icon: Icons.bed_outlined,
                  title: 'Room Number',
                  value: room,
                ),
                const Divider(
                  indent: 24,
                  endIndent: 24,
                  height: 0,
                  thickness: 0.8,
                  color: Color(0xFFE0E0E0),
                ),
                ProfileListItem(
                  icon: Icons.access_time,
                  title: 'Check-in',
                  value: checkIn,
                ),
                const Divider(
                  indent: 24,
                  endIndent: 24,
                  height: 0,
                  thickness: 0.8,
                  color: Color(0xFFE0E0E0),
                ),
                ProfileListItem(
                  icon: Icons.access_time,
                  title: 'Check-out',
                  value: checkOut,
                ),
                const Divider(
                  indent: 24,
                  endIndent: 24,
                  height: 0,
                  thickness: 0.8,
                  color: Color(0xFFE0E0E0),
                ),
                ProfileLanguageItem(icon: Icons.language, title: 'Language'),
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
            );
          },
        ),
      ),
    );
  }
}
