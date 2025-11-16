import 'package:flutter/material.dart';

class ActivityCard extends StatelessWidget {
  final String label;
  final String? sublabel;
  final bool isEmpty;
  final IconData? emptyIcon;
  final String? emptyMessage;
  final Widget? child;

  const ActivityCard({
    super.key,
    required this.label,
    this.sublabel,
    this.isEmpty = false,
    this.emptyIcon,
    this.emptyMessage,
    this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: BoxConstraints(minWidth: 112, minHeight: 98),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Color.fromARGB(255, 217, 219, 219), Color(0xFF56C6FF)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Container(
        margin: EdgeInsets.all(1),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Padding(
          padding: EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontFamily: 'Fustat',
                  fontSize: 10,
                  fontWeight: FontWeight.w300,
                  color: Colors.black.withValues(alpha: 0.6),
                ),
              ),

              if (sublabel != null) ...[
                SizedBox(height: 2),
                Text(
                  sublabel!,
                  style: TextStyle(
                    fontFamily: 'Fustat',
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
              ],

              SizedBox(height: 8),

              if (isEmpty) _buildEmptyState() else if (child != null) child!,
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Column(
      children: [
        if (emptyIcon != null)
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: Color(0xFF56C6FF).withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(emptyIcon, size: 14, color: Color(0xFF56C6FF)),
          ),
        if (emptyMessage != null) ...[
          SizedBox(height: 6),
          Text(
            emptyMessage!,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Fustat',
              fontSize: 10,
              fontWeight: FontWeight.w400,
              color: Colors.black.withValues(alpha: 0.6),
              height: 1.4,
            ),
          ),
        ],
      ],
    );
  }
}
