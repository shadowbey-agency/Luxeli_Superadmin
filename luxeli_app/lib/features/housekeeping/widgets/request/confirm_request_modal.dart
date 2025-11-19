import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/housekeeping/models/housekeeping_item_model.dart';
import 'package:luxeli_app/features/housekeeping/providers/housekeeping_provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';
import 'package:luxeli_app/features/housekeeping/widgets/request/selected_items_list_widget.dart';
import 'package:luxeli_app/features/housekeeping/widgets/request/delivery_details_widget.dart';

class ConfirmRequestModal extends StatefulWidget {
  final String serviceTitle;
  final Map<String, int> selectedItems; // key: item id, value: qty
  final List<HousekeepingItem> allItems;

  const ConfirmRequestModal({
    super.key,
    required this.serviceTitle,
    required this.selectedItems,
    required this.allItems,
  });

  @override
  State<ConfirmRequestModal> createState() => _ConfirmRequestModalState();
}

class _ConfirmRequestModalState extends State<ConfirmRequestModal> {
  String deliveryMethod = 'Drop at door';
  TimeOfDay? startTime;
  TimeOfDay? endTime;
  String priority = 'Normal';

  @override
  void initState() {
    super.initState();
    startTime = TimeOfDay.now();
    // Fix the hour calculation to ensure it's within valid range (0-23)
    final currentHour = TimeOfDay.now().hour;
    final nextHour = (currentHour + 1) % 24; // Wrap around if exceeds 23
    endTime = TimeOfDay.now().replacing(hour: nextHour);
  }

  Future<void> _pickTime(bool isStart) async {
    final t = await showTimePicker(
      context: context,
      initialTime: isStart
          ? (startTime ?? TimeOfDay.now())
          : (endTime ?? TimeOfDay.now()),
    );
    if (t != null) setState(() => isStart ? startTime = t : endTime = t);
  }

  void _sendRequest() async {
    final guestProvider = Provider.of<GuestProvider>(context, listen: false);
    final token = guestProvider.guestData?.token;

    if (token == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
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
          SizedBox(width: 16),
          Text('Submitting request...'),
        ],
      ),
      backgroundColor: Colors.blue,
    );

    ScaffoldMessenger.of(context).showSnackBar(loadingSnackBar);

    // Build items map for notes
    final List<String> itemsList = [];
    widget.selectedItems.forEach((itemId, qty) {
      final item = widget.allItems.firstWhere((i) => i.id == itemId);
      itemsList.add('${item.title} (x$qty)');
    });

    final itemsString = itemsList.join(', ');

    final notes =
        'Items: $itemsString; Method: $deliveryMethod; Window: ${startTime?.format(context) ?? ''} - ${endTime?.format(context) ?? ''}; Priority: $priority';

    // Calculate total quantity
    final totalQuantity = widget.selectedItems.values.fold<int>(
      0,
      (sum, qty) => sum + qty,
    );

    // Submit request through the provider
    final success =
        await Provider.of<HousekeepingProvider>(
          context,
          listen: false,
        ).addRequest(
          type: 'item needed',
          requestedFor: itemsString,
          itemQuantity: totalQuantity,
          deliveryDetail: {
            'deliveryMethod': deliveryMethod,
            'deliveryWindow':
                '${startTime?.format(context) ?? ''} - ${endTime?.format(context) ?? ''}',
          },
          priority: priority.toLowerCase(),
          notes: notes,
        );

    // Hide loading indicator
    ScaffoldMessenger.of(context).hideCurrentSnackBar();

    if (success) {
      // Close modal and the underlying items sheet, then navigate to the service screen so user sees the new request
      Navigator.of(context).pop(); // close confirm modal
      Navigator.of(context).pop(); // close items sheet

      // Show success confirmation
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Request submitted successfully!'),
          duration: Duration(seconds: 2),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          margin: EdgeInsets.all(16),
        ),
      );
    } else {
      // Show error message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to submit request. Please try again.'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          margin: EdgeInsets.all(16),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SafeArea(
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
          ),
        ),
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                SizedBox(width: 44),
                Text(
                  'Confirm request',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              widget.serviceTitle,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 12),
            SelectedItemsListWidget(
              selectedItems: widget.selectedItems,
              allItems: widget.allItems,
            ),
            const SizedBox(height: 16),
            Text(
              'Delivery details',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            DeliveryDetailsWidget(
              onDeliveryMethodChanged: (value) =>
                  setState(() => deliveryMethod = value),
              onPickTime: _pickTime,
              deliveryMethod: deliveryMethod,
              startTime: startTime,
              endTime: endTime,
              priority: priority,
              onPriorityChanged: (value) => setState(() => priority = value),
            ),
            const SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: _sendRequest,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.indigo[900],
                  padding: const EdgeInsets.symmetric(
                    horizontal: 36,
                    vertical: 14,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text('Send request'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
