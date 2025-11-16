import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/request_provider.dart';
import 'request_card.dart';

class RequestList extends StatelessWidget {
  const RequestList({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<RequestProvider>(
      builder: (context, provider, child) {
        return SingleChildScrollView(
          physics: BouncingScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (provider.todayRequests.isNotEmpty) ...[
                  Text(
                    'Today',
                    style: TextStyle(
                      fontFamily: 'Fustat',
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.black,
                    ),
                  ),
                  SizedBox(height: 12),
                  ...provider.todayRequests.map((request) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: RequestCard(
                        key: ValueKey(request.id),
                        request: request,
                      ),
                    );
                  }),
                  SizedBox(height: 20),
                ],
                if (provider.yesterdayRequests.isNotEmpty) ...[
                  Text(
                    'Yesterday',
                    style: TextStyle(
                      fontFamily: 'Fustat',
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.black,
                    ),
                  ),
                  SizedBox(height: 12),
                  ...provider.yesterdayRequests.map((request) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: RequestCard(
                        key: ValueKey(request.id),
                        request: request,
                      ),
                    );
                  }),
                ],

                SizedBox(height: 100),
              ],
            ),
          ),
        );
      },
    );
  }
}
