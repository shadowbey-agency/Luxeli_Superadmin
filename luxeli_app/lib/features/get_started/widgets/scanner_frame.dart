import 'package:flutter/material.dart';

class ScannerFrame extends StatefulWidget {
  const ScannerFrame({super.key});

  @override
  State<ScannerFrame> createState() => _ScannerFrameState();
}

class _ScannerFrameState extends State<ScannerFrame>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _animation = Tween<double>(begin: 20, end: 270).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 350,
      height: 350,
      child: Stack(
        children: [
          CustomPaint(size: Size(350, 350), painter: ScannerOverlayPainter()),

          _buildCorners(),
          AnimatedBuilder(
            animation: _animation,
            builder: (context, child) {
              return Positioned(
                left: 20,
                right: 20,
                top: _animation.value,
                child: Container(
                  height: 2,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.transparent,
                        Color(0xFFCD3C14),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildCorners() {
    return Stack(
      children: [
        Positioned(left: 20, top: 20, child: _buildCorner(topLeft: true)),
        Positioned(right: 20, top: 20, child: _buildCorner(topRight: true)),
        Positioned(left: 20, bottom: 20, child: _buildCorner(bottomLeft: true)),
        Positioned(
          right: 20,
          bottom: 20,
          child: _buildCorner(bottomRight: true),
        ),
      ],
    );
  }

  Widget _buildCorner({
    bool topLeft = false,
    bool topRight = false,
    bool bottomLeft = false,
    bool bottomRight = false,
  }) {
    return SizedBox(
      width: 34,
      height: 34,
      child: CustomPaint(
        painter: CornerPainter(
          topLeft: topLeft,
          topRight: topRight,
          bottomLeft: bottomLeft,
          bottomRight: bottomRight,
        ),
      ),
    );
  }
}

class ScannerOverlayPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = Color(0xFFDADADA).withValues(alpha: 0.25);

    // Draw the outer transparent overlay with a hole in the center
    final rect = Rect.fromLTWH(0, 0, size.width, size.height);
    final holeRect = Rect.fromLTWH(20, 20, size.width - 40, size.height - 40);

    // Create a path for the overlay with a hole
    final path = Path()
      ..addRect(rect)
      ..addRect(holeRect)
      ..fillType = PathFillType.evenOdd;

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class CornerPainter extends CustomPainter {
  final bool topLeft;
  final bool topRight;
  final bool bottomLeft;
  final bool bottomRight;

  CornerPainter({
    this.topLeft = false,
    this.topRight = false,
    this.bottomLeft = false,
    this.bottomRight = false,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round;

    if (topLeft) {
      canvas.drawLine(Offset(2, 0), Offset(2, size.height), paint);
      canvas.drawLine(Offset(0, 2), Offset(size.width, 2), paint);
    } else if (topRight) {
      canvas.drawLine(
        Offset(size.width - 2, 0),
        Offset(size.width - 2, size.height),
        paint,
      );
      canvas.drawLine(Offset(0, 2), Offset(size.width, 2), paint);
    } else if (bottomLeft) {
      canvas.drawLine(Offset(2, 0), Offset(2, size.height), paint);
      canvas.drawLine(
        Offset(0, size.height - 2),
        Offset(size.width, size.height - 2),
        paint,
      );
    } else if (bottomRight) {
      canvas.drawLine(
        Offset(size.width - 2, 0),
        Offset(size.width - 2, size.height),
        paint,
      );
      canvas.drawLine(
        Offset(0, size.height - 2),
        Offset(size.width, size.height - 2),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
