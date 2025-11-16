import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/get_started/widgets/primary_button.dart';
import 'package:luxeli_app/ui_components/widgets/custom_confirmation_dialog.dart';
import 'package:luxeli_app/features/get_started/providers/scanner_provider.dart';

class ConfirmInfoScreen extends StatelessWidget {
  const ConfirmInfoScreen({super.key});

  static const double hp = 28.0;
  static const Color darkStrip = Colors.black;
  static const Color topTitleColor = Color(0xFF222222);
  static const double titleSmallSize = 14;
  static const double headingSize = 36;
  static const Color subtitleGray = Color(0xFF9EA3A8);
  static const Color cardBorder = Color(0xFFE9EAEC);
  static const Color iconBg = Color(0xFFF6F7F8);

  Widget _topBar(BuildContext c) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: hp, vertical: 12),
      child: Row(
        children: [
          const Spacer(),
          Text(
            "Let's Confirm Your Stay",
            style: TextStyle(
              fontSize: titleSmallSize,
              fontWeight: FontWeight.w600,
              color: topTitleColor,
            ),
          ),
          const Spacer(),
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: const Color(0xFFF6F7F8),
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Icon(Icons.close, color: Color(0xFF8A9096), size: 18),
          ),
        ],
      ),
    );
  }

  Widget _headingSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: hp),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 6),
          Text(
            "Confirm your\ninformation",
            style: const TextStyle(
              fontSize: headingSize,
              fontWeight: FontWeight.w800,
              height: 1.02,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            "Please verify that the details below match\nyour booking before continuing.",
            style: TextStyle(fontSize: 14, color: subtitleGray, height: 1.4),
          ),
          const SizedBox(height: 22),
        ],
      ),
    );
  }

  Widget _infoLine(IconData icon, String label, String value) {
    return Row(
      children: [
        Container(
          width: 30,
          height: 30,
          decoration: BoxDecoration(
            color: iconBg,
            borderRadius: BorderRadius.circular(10),
          ),
          alignment: Alignment.center,
          child: Icon(icon, size: 16, color: const Color(0xFF5F666B)),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(fontSize: 13, color: Color(0xFF6B6F73)),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          value,
          textAlign: TextAlign.right,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: Colors.black87,
          ),
        ),
      ],
    );
  }

  Widget _infoCard(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: hp),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: cardBorder),
        ),
        child: Consumer<ScannerProvider>(
          builder: (context, scannerProvider, child) {
            // Get the parsed data from the provider
            final parsedData = scannerProvider.getParsedData();

            if (parsedData == null || parsedData.isEmpty) {
              return Column(
                children: [
                  _infoLine(Icons.person_outline, 'Full Name', 'Unknown Guest'),
                  const Divider(
                    height: 8,
                    thickness: 1,
                    color: Color(0xFFF1F2F3),
                  ),
                  _infoLine(Icons.phone, 'Phone Number', 'Unknown'),
                  const Divider(
                    height: 8,
                    thickness: 1,
                    color: Color(0xFFF1F2F3),
                  ),
                  _infoLine(Icons.meeting_room, 'Room Number', 'Unknown'),
                  const Divider(
                    height: 8,
                    thickness: 1,
                    color: Color(0xFFF1F2F3),
                  ),
                  _infoLine(Icons.calendar_today, 'Check In', 'Unknown'),
                  const Divider(
                    height: 8,
                    thickness: 1,
                    color: Color(0xFFF1F2F3),
                  ),
                  _infoLine(Icons.calendar_today, 'Check Out', 'Unknown'),
                ],
              );
            }

            // Extract specific fields with fallback values
            final fullName =
                parsedData['guestName'] ??
                parsedData['resident'] ??
                'Unknown Guest';
            final phoneNumber =
                parsedData['guestPhone'] ??
                parsedData['residentPhoneNo'] ??
                'Unknown';
            final roomNumber =
                parsedData['roomName'] ??
                parsedData['roomNumber'] ??
                'Unknown Room';
            final checkIn =
                parsedData['checkInDate'] ?? parsedData['checkIn'] ?? 'Unknown';
            final checkOut =
                parsedData['checkOutDate'] ??
                parsedData['checkOut'] ??
                'Unknown';

            return Column(
              children: [
                _infoLine(Icons.person_outline, 'Full Name', fullName),
                const Divider(
                  height: 8,
                  thickness: 1,
                  color: Color(0xFFF1F2F3),
                ),
                _infoLine(Icons.phone, 'Phone Number', phoneNumber),
                const Divider(
                  height: 8,
                  thickness: 1,
                  color: Color(0xFFF1F2F3),
                ),
                _infoLine(Icons.meeting_room, 'Room Number', roomNumber),
                const Divider(
                  height: 8,
                  thickness: 1,
                  color: Color(0xFFF1F2F3),
                ),
                _infoLine(Icons.calendar_today, 'Check In', checkIn),
                const Divider(
                  height: 8,
                  thickness: 1,
                  color: Color(0xFFF1F2F3),
                ),
                _infoLine(Icons.calendar_today, 'Check Out', checkOut),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _bottomButton(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(
        hp,
        0,
        hp,
        16 + MediaQuery.of(context).viewPadding.bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          PrimaryButton(
            text: "It's me",
            onPressed: () {
              showModalBottomSheet(
                context: context,
                isScrollControlled: true,
                backgroundColor: Colors.transparent,
                builder: (BuildContext context) {
                  return Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                    ),
                    padding: const EdgeInsets.all(12),
                    margin: const EdgeInsets.only(top: 50),
                    child: CustomConfirmationDialog(
                      icon: Icons.check_circle,
                      title: 'Verification successful',
                      message:
                          'Your identity has been confirmed. You can now start using the hotel app and access all services.',
                      confirmButtonText: 'Start using the app',
                      onConfirm: () {
                        Navigator.of(context).pop(); // Close the bottom sheet
                        // Navigate to the home screen where OnboardingOverlay is displayed
                        Navigator.pushReplacementNamed(context, '/home');
                      },
                    ),
                  );
                },
              );
            },
            width: double.infinity,
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height;
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                Container(height: 6, color: darkStrip),
                Expanded(
                  child: Container(
                    color: Colors.white,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _topBar(context),
                        const SizedBox(height: 8),
                        _headingSection(),
                        _infoCard(context),
                        SizedBox(height: height * 0.22),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: _bottomButton(context),
            ),
          ],
        ),
      ),
    );
  }
}
