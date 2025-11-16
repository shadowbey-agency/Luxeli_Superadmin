import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/request_provider.dart';

class RequestAppBar extends StatelessWidget {
  const RequestAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        children: [
          SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Requests',
                style: TextStyle(
                  fontFamily: 'Fustat',
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
              GestureDetector(
                onTap: () {
                  context.read<RequestProvider>().toggleFilterModal();
                },
                child: Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.2),
                      width: 0.818,
                    ),
                  ),
                  child: Center(
                    child: Icon(Icons.tune, size: 18, color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
