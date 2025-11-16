import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/housekeeping/providers/housekeeping_provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';
import 'package:luxeli_app/features/services/service_screen.dart';

class SpecialsScreen extends StatefulWidget {
  const SpecialsScreen({super.key});

  @override
  State<SpecialsScreen> createState() => _SpecialsScreenState();
}

class _SpecialsScreenState extends State<SpecialsScreen> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descController = TextEditingController();

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    super.dispose();
  }

  void _sendRequest() async {
    final title = _titleController.text.trim();
    final desc = _descController.text.trim();

    if (title.isEmpty && desc.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a title or description')),
      );
      return;
    }

    // Get the guest token for API authentication
    final guestProvider = Provider.of<GuestProvider>(context, listen: false);
    final token = guestProvider.guestData?.token;

    if (token == null) {
      // Show error if no token
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Authentication error. Please login again.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Show loading indicator
    final loadingSnackBar = SnackBar(
      content: Row(
        children: [
          CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
          ),
          const SizedBox(width: 16),
          const Text('Submitting request...'),
        ],
      ),
      backgroundColor: Colors.blue,
    );

    ScaffoldMessenger.of(context).showSnackBar(loadingSnackBar);

    // Submit request through the provider
    final success =
        await Provider.of<HousekeepingProvider>(
          context,
          listen: false,
        ).addRequest(
          type: 'custom cleaning', // Default type for special requests
          requestedFor: title.isNotEmpty ? title : 'Special Request',
          notes: (title.isNotEmpty ? '$title - ' : '') + desc,
        );

    // Hide loading indicator
    ScaffoldMessenger.of(context).hideCurrentSnackBar();

    if (success) {
      // Navigate to ServiceScreen for Specials so the user sees the list (filtered by 'Special')
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => ServiceScreen(
            title: 'Special',
            subtitle: 'Customized service',
            icon: Icons.star_border,
          ),
        ),
      );

      // Show success confirmation
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Special request submitted successfully!'),
          duration: const Duration(seconds: 2),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          margin: const EdgeInsets.all(16),
        ),
      );
    } else {
      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Failed to submit request. Please try again.'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          margin: const EdgeInsets.all(16),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F8),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 12),
            Expanded(
              child: Container(
                width: double.infinity,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(24),
                    topRight: Radius.circular(24),
                  ),
                ),
                padding: const EdgeInsets.fromLTRB(20, 18, 20, 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const SizedBox(width: 44),
                        Text(
                          'Customized request',
                          style: theme.textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Tell us what you need, and our team will take care of it.',
                      style: TextStyle(color: Colors.grey),
                    ),
                    const SizedBox(height: 18),

                    const Divider(height: 1),
                    const SizedBox(height: 16),

                    const Text(
                      'Title',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: TextField(
                        controller: _titleController,
                        decoration: const InputDecoration(
                          border: InputBorder.none,
                          hintText: 'Write here...',
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    const Text(
                      'Description',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        child: TextField(
                          controller: _descController,
                          maxLines: null,
                          expands: true,
                          decoration: const InputDecoration(
                            border: InputBorder.none,
                            hintText: 'Write here...',
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),

            Container(
              color: Colors.transparent,
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _sendRequest,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0A3B78),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Send request',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
