import 'package:flutter/material.dart';

class CircularProgressIndicatorWithText extends StatelessWidget {
  final int currentStep;
  final int totalSteps;
  final double radius;
  final double strokeWidth;
  final Color progressColor;
  final Color backgroundColor;
  final TextStyle textStyle;

  const CircularProgressIndicatorWithText({
    super.key,
    required this.currentStep,
    required this.totalSteps,
    this.radius = 20.0,
    this.strokeWidth = 2.0,
    this.progressColor = Colors.blue,
    this.backgroundColor = Colors.grey,
    this.textStyle = const TextStyle(
      fontSize: 12,
      fontWeight: FontWeight.bold,
      color: Colors.blue,
    ),
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: radius * 2,
      height: radius * 2,
      child: Stack(
        alignment: Alignment.center,
        children: [
          CustomPaint(
            painter: _CircularProgressPainter(
              progress: currentStep / totalSteps,
              progressColor: progressColor,
              backgroundColor: backgroundColor,
              strokeWidth: strokeWidth,
            ),
            child: Container(),
          ),
          Text('$currentStep/$totalSteps', style: textStyle),
        ],
      ),
    );
  }
}

class _CircularProgressPainter extends CustomPainter {
  final double progress;
  final Color progressColor;
  final Color backgroundColor;
  final double strokeWidth;

  _CircularProgressPainter({
    required this.progress,
    required this.progressColor,
    required this.backgroundColor,
    required this.strokeWidth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Background circle
    final backgroundPaint = Paint()
      ..color = backgroundColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;
    canvas.drawCircle(center, radius, backgroundPaint);

    // Progress arc
    final progressPaint = Paint()
      ..color = progressColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round; // Rounded ends for the arc

    final double sweepAngle = 2 * 3.1415926535 * progress;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -3.1415926535 / 2, // Start from top
      sweepAngle,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _CircularProgressPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.progressColor != progressColor ||
        oldDelegate.backgroundColor != backgroundColor ||
        oldDelegate.strokeWidth != strokeWidth;
  }
}
