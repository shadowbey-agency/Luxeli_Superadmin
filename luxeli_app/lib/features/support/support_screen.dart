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
          SizedBox(width: 16),
          Icon(icon, size: 16, color: const Color(0xFF4C5054)),
          SizedBox(width: 8),
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
    return Scaffold(
      backgroundColor: Color(0xFF24314f),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Align(
          alignment: Alignment.bottomCenter,
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
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
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
                          size: 14,
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
                    color: Color(0xFFE3F2FD), // Light blue background color
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFFF1F2F3)),
                  ),
                  child: _infoRow(context, Icons.phone, '+212/56486234'),
                ),
                const SizedBox(height: 8),
                Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Color(0xFFE3F2FD),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFFF1F2F3)),
                  ),
                  child: _infoRow(
                    context,
                    Icons.email_outlined,
                    'hotel@gmail.com',
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
