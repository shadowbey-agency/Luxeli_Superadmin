import 'package:flutter/material.dart';

class RequestEmptyState extends StatelessWidget {
  const RequestEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Icon
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: Color(0xFFEEF9FF),
              shape: BoxShape.circle,
              border: Border.all(color: Color(0xFFCBEDFF), width: 0.8),
            ),
            child: Center(
              child: Icon(
                Icons.description_outlined,
                size: 28,
                color: Color(0xFF4195BF),
              ),
            ),
          ),

          SizedBox(height: 16),

          // Message
          Text(
            'No requests available',
            style: TextStyle(
              fontFamily: 'Fustat',
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: Color(0xFF212121).withValues(alpha: 0.6),
            ),
          ),
        ],
      ),
    );
  }
}
