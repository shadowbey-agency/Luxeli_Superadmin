import 'package:flutter/material.dart';
import 'package:luxeli_app/features/get_started/providers/app_provider.dart';
import 'package:luxeli_app/features/get_started/widgets/primary_button.dart';
import 'package:luxeli_app/features/get_started/widgets/qr_icon.dart';
import 'package:provider/provider.dart';

class CustomConfirmationDialog extends StatelessWidget {
  final String title;
  final String message;
  final IconData? icon;
  final String confirmButtonText;
  final String? cancelButtonText;
  final VoidCallback? onConfirm;
  final VoidCallback? onCancel;

  const CustomConfirmationDialog({
    super.key,
    this.title = 'Scan your room QR',
    this.message =
        'Scan the QR code placed in your room to start your check-in and access hotel services instantly.',
    this.icon,
    this.confirmButtonText = 'Scan',
    this.cancelButtonText,
    this.onConfirm,
    this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 8),
          if (icon != null)
            Icon(icon, size: 40, color: Colors.blue)
          else
            const QrIcon(),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(
              fontFamily: 'Fustat',
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: Colors.black,
              height: 1.39,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            message,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontFamily: 'Fustat',
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: Color(0xFF212121),
              height: 1.4,
            ),
          ),
          const SizedBox(height: 28),
          PrimaryButton(
            text: confirmButtonText,
            onPressed:
                onConfirm ??
                () {
                  context.read<GetStartedScreenProvider>().navigateToScanner();
                },
            width: 318,
          ),
          if (cancelButtonText != null) ...[
            const SizedBox(height: 12),
            SizedBox(
              width: 318,
              height: 48,
              child: OutlinedButton(
                onPressed: onCancel,
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFF06336A)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: Text(
                  cancelButtonText!,
                  style: const TextStyle(
                    fontFamily: 'Fustat',
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF06336A),
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
