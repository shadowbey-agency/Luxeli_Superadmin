import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class SupportScreen extends StatelessWidget {
  const SupportScreen({super.key});

  static const double horizontalPadding = 22.0;
  static const double sheetRadius = 28.0;
  static const Color sheetBorder = Color(0xFFF0F1F3);
  static const Color iconBg = Color(0xFFF6F7F8);
  static const Color labelGray = Color(0xFF6B6F73);
  static const double cardHeight = 64.0;
  static const Color navyOverlay = Color.fromRGBO(6, 51, 106, 0.25);
  void _copyAndShow(BuildContext context, String text) async {
    await Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).removeCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Copied to clipboard'),
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
      ),
    );
  }

  Widget _infoRow(BuildContext ctx, IconData icon, String text) {
    return SizedBox(
      height: cardHeight,
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            margin: const EdgeInsets.only(right: 12),
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(12),
            ),
            alignment: Alignment.center,
            child: Icon(icon, size: 20, color: const Color(0xFF4C5054)),
          ),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
            ),
          ),
          TextButton(
            onPressed: () => _copyAndShow(ctx, text),
            style: TextButton.styleFrom(
              foregroundColor: const Color(0xFF9EA6B2),
              minimumSize: const Size(0, 0),
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: const Text(
              'Copy',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bottomPadding = MediaQuery.of(context).viewPadding.bottom;
    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: Container(
              color:
                  Colors.blueGrey[900], // Using a dark blue-grey as background
            ),
          ),

          Positioned.fill(
            child: Container(color: Colors.black.withOpacity(0.28)),
          ),
          Positioned.fill(child: Container(color: navyOverlay)),
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
              child: Container(color: Colors.transparent),
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: EdgeInsets.only(
                left: horizontalPadding,
                right: horizontalPadding,
                bottom: 22 + bottomPadding,
              ),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(sheetRadius),
                  border: Border.all(color: sheetBorder),
                ),
                padding: const EdgeInsets.fromLTRB(18, 18, 18, 18),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        const Expanded(
                          child: Center(
                            child: Text(
                              'Support',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w800,
                                color: Colors.black,
                              ),
                            ),
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            Navigator.pop(context);
                          },
                          child: SizedBox(
                            width: 36,
                            height: 36,

                            child: const Icon(
                              Icons.close,
                              size: 18,
                              color: Color(0xFF8A9096),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFF1F2F3)),
                      ),
                      child: Builder(
                        builder: (ctx) =>
                            _infoRow(ctx, Icons.phone, '+212/56486234'),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFF1F2F3)),
                      ),
                      child: Builder(
                        builder: (ctx) => _infoRow(
                          ctx,
                          Icons.email_outlined,
                          'Hotel@gmail.com',
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
