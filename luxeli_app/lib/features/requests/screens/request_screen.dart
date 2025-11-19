import 'package:flutter/material.dart';
import 'package:luxeli_app/features/requests/widgets/request_app_bar.dart';
import 'package:luxeli_app/features/requests/widgets/request_empty_state.dart';
import 'package:luxeli_app/features/requests/widgets/request_filter_modal.dart';
import 'package:luxeli_app/features/requests/widgets/request_list.dart';
import 'package:provider/provider.dart';
import '../providers/request_provider.dart';

class RequestScreen extends StatefulWidget {
  const RequestScreen({super.key});

  @override
  State<RequestScreen> createState() => _RequestScreenState();
}

class _RequestScreenState extends State<RequestScreen> {
  @override
  void initState() {
    super.initState();
    print('RequestScreen initState called');
    WidgetsBinding.instance.addPostFrameCallback((_) {
      print('RequestScreen post frame callback called');
      _loadRequests(context);
    });
  }

  void _loadRequests(BuildContext context) {
    print('Loading requests...');
    try {
      final requestProvider = Provider.of<RequestProvider>(
        context,
        listen: false,
      );
      print('RequestProvider obtained, calling loadAllRequests');
      requestProvider.loadAllRequests(context);
    } catch (e) {
      print('Error getting RequestProvider or loading requests: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    print('Building RequestScreen...');
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
                          print(
                            'Consumer builder called - hasRequests: ${provider.hasRequests}, requests count: ${provider.requests.length}, isLoading: ${provider.isLoading}',
                          );

                          if (provider.errorMessage != null) {
                            print(
                              'Showing error state: ${provider.errorMessage}',
                            );
                            return _buildErrorState(provider);
                          }

                          if (provider.isLoading) {
                            print('Showing loading indicator');
                            return Center(child: CircularProgressIndicator());
                          }

                          if (!provider.hasRequests) {
                            print('Showing empty state');
                            return RequestEmptyState();
                          }

                          print('Showing request list');
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
            onTap: () => _loadRequests(context),
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
