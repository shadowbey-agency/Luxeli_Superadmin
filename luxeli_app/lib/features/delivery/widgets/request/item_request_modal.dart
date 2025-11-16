import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/housekeeping/providers/housekeeping_provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';
import 'package:luxeli_app/features/delivery/models/delivery_item.dart';

class ItemRequestModal extends StatefulWidget {
  final List<DeliveryItem> items;

  const ItemRequestModal({Key? key, required this.items}) : super(key: key);

  @override
  State<ItemRequestModal> createState() => _ItemRequestModalState();
}

class _ItemRequestModalState extends State<ItemRequestModal> {
  final Map<int, int> selected = {};
  String deliveryMethod = 'delivery';
  TimeOfDay? startTime;
  TimeOfDay? endTime;

  void _sendRequest() async {
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
          SizedBox(width: 16),
          Text('Submitting request...'),
        ],
      ),
      backgroundColor: Colors.blue,
    );

    ScaffoldMessenger.of(context).showSnackBar(loadingSnackBar);

    // Build items map for notes
    final Map<String, int> itemsMap = {};
    selected.forEach((idx, qty) {
      final it = widget.items[idx];
      itemsMap[it.title] = qty;
    });

    final List<String> itemsList = [];
    selected.forEach((idx, qty) {
      final it = widget.items[idx];
      itemsList.add('${it.title} (x$qty)');
    });

    final itemsString = itemsList.join(', ');

    final notes =
        'Method: $deliveryMethod; Window: ${startTime?.format(context) ?? ''} - ${endTime?.format(context) ?? ''}';

    // Submit request through the provider
    final success =
        await Provider.of<HousekeepingProvider>(
          context,
          listen: false,
        ).addRequest(
          type: 'item needed',
          requestedFor: itemsString,
          itemQuantity: selected.values.fold<int>(0, (sum, qty) => sum + qty),
          deliveryDetail: {
            'deliveryMethod': deliveryMethod,
            'deliveryWindow':
                '${startTime?.format(context) ?? ''} - ${endTime?.format(context) ?? ''}',
          },
          priority: 'medium', // Default priority
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
          content: const Text('Request submitted successfully!'),
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
    return AlertDialog(
      title: const Text('Request Items'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text('Select items you need:'),
          ListView.builder(
            shrinkWrap: true,
            itemCount: widget.items.length,
            itemBuilder: (context, index) {
              final DeliveryItem item = widget.items[index];
              return CheckboxListTile(
                title: Text(item.title),
                subtitle: Text(item.description),
                value: selected.containsKey(index),
                onChanged: (value) {
                  setState(() {
                    if (value == true) {
                      selected[index] = 1;
                    } else {
                      selected.remove(index);
                    }
                  });
                },
              );
            },
          ),
          const SizedBox(height: 16),
          const Text('Delivery Method:'),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    deliveryMethod = 'delivery';
                  });
                },
                child: const Text('Delivery'),
              ),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    deliveryMethod = 'pickup';
                  });
                },
                child: const Text('Pickup'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text('Delivery Window:'),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ElevatedButton(
                onPressed: () async {
                  final time = await showTimePicker(
                    context: context,
                    initialTime: TimeOfDay.now(),
                  );
                  if (time != null) {
                    setState(() {
                      startTime = time;
                    });
                  }
                },
                child: const Text('Start Time'),
              ),
              ElevatedButton(
                onPressed: () async {
                  final time = await showTimePicker(
                    context: context,
                    initialTime: TimeOfDay.now(),
                  );
                  if (time != null) {
                    setState(() {
                      endTime = time;
                    });
                  }
                },
                child: const Text('End Time'),
              ),
            ],
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: const Text('Cancel'),
        ),
        ElevatedButton(onPressed: _sendRequest, child: const Text('Submit')),
      ],
    );
  }
}
