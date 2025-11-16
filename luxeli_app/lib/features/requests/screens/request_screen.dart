import 'package:flutter/material.dart';
import 'package:luxeli_app/features/requests/widgets/request_app_bar.dart';
import 'package:luxeli_app/features/requests/widgets/request_empty_state.dart';
import 'package:luxeli_app/features/requests/widgets/request_filter_modal.dart';
import 'package:luxeli_app/features/requests/widgets/request_list.dart';
import 'package:provider/provider.dart';
import '../providers/request_provider.dart';

class RequestScreen extends StatelessWidget {
  const RequestScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF1F2A44),
      body: Stack(
        children: [
          SafeArea(
            bottom: false,
            child: Column(
              children: [
                // App Bar
                RequestAppBar(),

                // Main Content
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(30),
                        topRight: Radius.circular(30),
                      ),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(30),
                        topRight: Radius.circular(30),
                      ),
                      child: Consumer<RequestProvider>(
                        builder: (context, provider, child) {
                          if (provider.errorMessage != null) {
                            return _buildErrorState(provider);
                          }

                          if (!provider.hasRequests) {
                            return RequestEmptyState();
                          }

                          return RequestList();
                        },
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Consumer<RequestProvider>(
            builder: (context, provider, child) {
              if (provider.showFilterModal) {
                return RequestFilterModal();
              }
              return SizedBox.shrink();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(RequestProvider provider) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            provider.errorMessage!,
            style: TextStyle(
              fontFamily: 'Fustat',
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: Color(0xFF212121).withValues(alpha: 0.6),
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 16),
          GestureDetector(
            onTap: provider.loadRequestsFromAPI,
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              decoration: BoxDecoration(
                color: Color(0xFF01286B),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'Retry',
                style: TextStyle(
                  fontFamily: 'Fustat',
                  fontSize: 14,
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
