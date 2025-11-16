import 'package:flutter/material.dart';

class ConfirmationWidget extends StatelessWidget {
  final VoidCallback? onConfirm;
  final String message;
  final String confirmButtonText;

  const ConfirmationWidget({
    super.key,
    this.onConfirm,
    this.message = 'Your account has been successfully created!',
    this.confirmButtonText = 'Start using the app',
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            alignment: Alignment.center,
            children: [
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  color: const Color(0xFF22C55E),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.green.withAlpha(102),
                      blurRadius: 12,
                      spreadRadius: 2,
                    ),
                  ],
                ),
              ),

              const Icon(Icons.check, color: Colors.white, size: 64),
              Positioned(top: 10, left: 20, child: _DecorativeDot()),
              Positioned(top: 15, right: 25, child: _DecorativeStar()),
              Positioned(bottom: 20, left: 40, child: _DecorativeStar()),
              Positioned(bottom: 15, right: 40, child: _DecorativeDot()),
            ],
          ),
          const SizedBox(height: 24),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: Color(0xFF111827), // Tailwind gray-900
              ),
            ),
          ),
          const SizedBox(height: 32),

          // Blue button labeled 'Start using the app'
          SizedBox(
            width: 200,
            height: 48,
            child: ElevatedButton(
              onPressed: onConfirm,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF3B82F6), // Tailwind blue-500
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24),
                ),
                elevation: 4,
              ),
              child: Text(
                confirmButtonText,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _DecorativeDot extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 8,
      height: 8,
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(204),
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: Colors.white.withAlpha(153),
            blurRadius: 4,
            spreadRadius: 1,
          ),
        ],
      ),
    );
  }
}

class _DecorativeStar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Icon(
      Icons.star,
      size: 12,
      color: Colors.white.withAlpha(216),
      shadows: [Shadow(color: Colors.white.withAlpha(153), blurRadius: 4)],
    );
  }
}
