import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:luxeli_app/features/housekeeping/providers/housekeeping_provider.dart';
import 'package:luxeli_app/providers/guest_provider.dart';
import 'package:luxeli_app/features/housekeeping/services/requests_management_service.dart';

class HousekeepingItemsNeededSheet extends StatefulWidget {
  final String serviceTitle;

  const HousekeepingItemsNeededSheet({super.key, required this.serviceTitle});

  @override
  State<HousekeepingItemsNeededSheet> createState() =>
      _HousekeepingItemsNeededSheetState();
}

class _HousekeepingItemsNeededSheetState
    extends State<HousekeepingItemsNeededSheet> {
  final List<String> categories = ['All', 'Pillows', 'Kitchen', 'Cleaning'];
  int selectedCategory = 0;
  List<Map<String, dynamic>> items = [];
  final Map<int, int> selected = {};
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadItems();
  }

  Future<void> _loadItems() async {
    try {
      final guestProvider = Provider.of<GuestProvider>(context, listen: false);
      final token = guestProvider.guestData?.token;

      if (token == null) {
        setState(() {
          _errorMessage = 'Authentication required';
          _isLoading = false;
        });
        return;
      }

      // Get the selected category (skip 'All' which is index 0)
      final category = selectedCategory > 0
          ? categories[selectedCategory]
          : null;

      final fetchedItems =
          await RequestsManagementService.getRequestsManagementItems(
            token: token,
            category: category,
            status: 'published', // Only show published items
          );

      if (fetchedItems != null) {
        setState(() {
          items = fetchedItems;
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = 'Failed to load items';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Error loading items: $e';
        _isLoading = false;
      });
    }
  }

  /// Helper method to load images properly based on source type
  Widget _buildImage(String imageUrl) {
    // Check if it's a local asset (starts with 'assets/')
    if (imageUrl.startsWith('assets/')) {
      return Image.asset(
        imageUrl,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          // Fallback to reliable placeholder service
          return Image.network(
            'https://picsum.photos/200/200',
            fit: BoxFit.cover,
          );
        },
      );
    } else {
      // It's a network image - load the exact image URL provided
      return Image.network(
        imageUrl,
        fit: BoxFit.cover,
        loadingBuilder: (context, child, loadingProgress) {
          // Show a loading indicator while the image is loading
          if (loadingProgress == null) return child;
          return Center(
            child: CircularProgressIndicator(
              value: loadingProgress.expectedTotalBytes != null
                  ? loadingProgress.cumulativeBytesLoaded /
                        loadingProgress.expectedTotalBytes!
                  : null,
            ),
          );
        },
        errorBuilder: (context, error, stackTrace) {
          // Log the error for debugging
          print('Image loading failed for URL: $imageUrl');
          print('Error: $error');

          // Show error message to user
          return Container(
            color: Colors.grey[300],
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.broken_image, color: Colors.grey[600]),
                  Text(
                    'Failed to load image',
                    style: TextStyle(color: Colors.grey[600], fontSize: 12),
                  ),
                ],
              ),
            ),
          );
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    // Show loading indicator
    if (_isLoading) {
      return SafeArea(
        child: Container(
          height: MediaQuery.of(context).size.height * 0.9,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.all(Radius.circular(24)),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircularProgressIndicator(),
                SizedBox(height: 16),
                Text('Loading items...'),
              ],
            ),
          ),
        ),
      );
    }

    // Show error message
    if (_errorMessage != null) {
      return SafeArea(
        child: Container(
          height: MediaQuery.of(context).size.height * 0.9,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.all(Radius.circular(24)),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.error, color: Colors.red, size: 48),
                SizedBox(height: 16),
                Text(
                  _errorMessage!,
                  style: TextStyle(color: Colors.red),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 16),
                ElevatedButton(onPressed: _loadItems, child: Text('Retry')),
              ],
            ),
          ),
        ),
      );
    }

    return SafeArea(
      child: Container(
        height: MediaQuery.of(context).size.height * 0.9,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.all(Radius.circular(24)),
        ),
        child: Column(
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                SizedBox(width: 44),
                Text(
                  'Items needed',
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
            const SizedBox(height: 8),
            Text(
              'Select the items you need for your room or stay.',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 18),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Items',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                IconButton(icon: Icon(Icons.search), onPressed: () {}),
              ],
            ),

            const SizedBox(height: 8),
            // Categories
            SizedBox(
              height: 44,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: categories.length,
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemBuilder: (context, i) {
                  final bool active = i == selectedCategory;
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        selectedCategory = i;
                      });
                      // Reload items when category changes
                      _loadItems();
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: active
                            ? Colors.grey.shade200
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: Text(
                        categories[i],
                        style: TextStyle(
                          color: active ? Colors.black : Colors.grey.shade700,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 12),

            // Grid of item cards
            Expanded(
              child: GridView.builder(
                padding: EdgeInsets.zero,
                itemCount: items.length,
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisExtent: 220,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemBuilder: (context, idx) {
                  final item = items[idx];
                  final it = _Item.fromRequestManagementItem(item);
                  final isSelected = selected.containsKey(idx);
                  return Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: Colors.grey.shade200),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withAlpha(8),
                          blurRadius: 8,
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        // make the whole card tappable to open details
                        InkWell(
                          onTap: () async {
                            // open detail modal and wait for a quantity to be returned
                            final result = await showModalBottomSheet<int>(
                              context: context,
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                              builder: (_) => _ItemDetailModal(
                                item: it,
                                initialQty: selected[idx] ?? 1,
                              ),
                            );
                            if (result != null && result > 0) {
                              setState(() {
                                selected[idx] = result;
                              });
                            }
                          },
                          borderRadius: BorderRadius.circular(14),
                          child: Padding(
                            padding: const EdgeInsets.all(12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Image area
                                SizedBox(
                                  height: 100,
                                  width: double.infinity,
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: _buildImage(it.imageUrl),
                                  ),
                                ),
                                const SizedBox(height: 10),
                                Text(
                                  it.title,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Expanded(
                                  child: Text(
                                    it.subtitle,
                                    style: const TextStyle(
                                      color: Colors.grey,
                                      fontSize: 12,
                                    ),
                                    maxLines: 3,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        // Add / count button
                        Positioned(
                          right: 12,
                          bottom: 12,
                          child: GestureDetector(
                            onTap: () {
                              setState(() {
                                if (isSelected) {
                                  selected.remove(idx);
                                } else {
                                  selected[idx] = 1;
                                }
                              });
                            },
                            child: CircleAvatar(
                              radius: 20,
                              backgroundColor: isSelected
                                  ? Colors.blue
                                  : Colors.white,
                              child: Icon(
                                isSelected ? Icons.check : Icons.add,
                                color: isSelected ? Colors.white : Colors.black,
                              ),
                            ),
                          ),
                        ),
                        if (isSelected)
                          Positioned(
                            left: 12,
                            bottom: 12,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.grey.shade200),
                              ),
                              child: Text(
                                '${selected[idx]} x',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Bottom action bar
            Container(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Text(
                    '${selected.length} Items selected',
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  Spacer(),
                  ElevatedButton(
                    onPressed: selected.isEmpty
                        ? null
                        : () async {
                            final result = await showModalBottomSheet<bool>(
                              context: context,
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                              builder: (_) => ConfirmRequestModal(
                                serviceTitle: widget.serviceTitle,
                                selected: Map<int, int>.from(selected),
                                items: items,
                              ),
                            );

                            if (result == true) {
                              // Confirmation modal handled adding the request and navigation
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo[900],
                      padding: const EdgeInsets.symmetric(
                        horizontal: 28,
                        vertical: 14,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text('Request items'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Item {
  final String title;
  final String subtitle;
  final String imageUrl;

  _Item({required this.title, required this.subtitle, required this.imageUrl});

  // Factory constructor to create _Item from requests management item
  factory _Item.fromRequestManagementItem(Map<String, dynamic> item) {
    // Extract item details from the requests management item
    final title = item['name'] as String? ?? 'Item';
    final description = item['description'] as String? ?? '';
    // Use the actual image URL from the item, with a reliable fallback
    final image = item['image'] as String? ?? 'https://picsum.photos/200/200';

    return _Item(title: title, subtitle: description, imageUrl: image);
  }
}

class _ItemDetailModal extends StatefulWidget {
  final _Item item;
  final int initialQty;

  const _ItemDetailModal({required this.item, this.initialQty = 1});

  @override
  State<_ItemDetailModal> createState() => _ItemDetailModalState();
}

class _ItemDetailModalState extends State<_ItemDetailModal> {
  late int qty;

  @override
  void initState() {
    super.initState();
    qty = widget.initialQty;
  }

  /// Helper method to load images properly based on source type
  Widget _buildImage(String imageUrl) {
    // Check if it's a local asset (starts with 'assets/')
    if (imageUrl.startsWith('assets/')) {
      return Image.asset(
        imageUrl,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          // Fallback to reliable placeholder service
          return Image.network(
            'https://picsum.photos/200/200',
            fit: BoxFit.cover,
          );
        },
      );
    } else {
      // It's a network image - load the exact image URL provided
      return Image.network(
        imageUrl,
        fit: BoxFit.cover,
        loadingBuilder: (context, child, loadingProgress) {
          // Show a loading indicator while the image is loading
          if (loadingProgress == null) return child;
          return Center(
            child: CircularProgressIndicator(
              value: loadingProgress.expectedTotalBytes != null
                  ? loadingProgress.cumulativeBytesLoaded /
                        loadingProgress.expectedTotalBytes!
                  : null,
            ),
          );
        },
        errorBuilder: (context, error, stackTrace) {
          // Log the error for debugging
          print('Image loading failed for URL: $imageUrl');
          print('Error: $error');

          // Show error message to user
          return Container(
            color: Colors.grey[300],
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.broken_image, color: Colors.grey[600]),
                  Text(
                    'Failed to load image',
                    style: TextStyle(color: Colors.grey[600], fontSize: 12),
                  ),
                ],
              ),
            ),
          );
        },
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
          borderRadius: BorderRadius.all(Radius.circular(24)),
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
                  widget.item.title,
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
            const SizedBox(height: 12),
            SizedBox(
              height: 180,
              width: double.infinity,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: _buildImage(widget.item.imageUrl),
              ),
            ),
            const SizedBox(height: 12),
            Text(widget.item.subtitle, style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 16),
            Row(
              children: [
                Text('Quantity', style: TextStyle(fontWeight: FontWeight.w600)),
                Spacer(),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      IconButton(
                        icon: Icon(Icons.remove),
                        onPressed: qty > 1 ? () => setState(() => qty--) : null,
                      ),
                      Text(
                        '$qty',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        icon: Icon(Icons.add),
                        onPressed: () => setState(() => qty++),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: () => Navigator.of(context).pop(qty),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 36,
                    vertical: 14,
                  ),
                ),
                child: Text('Add to request'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Confirm request modal — shows selected items and delivery details, allows sending the request
class ConfirmRequestModal extends StatefulWidget {
  final String serviceTitle;
  final Map<int, int> selected; // item index -> qty
  final List<Map<String, dynamic>> items;

  const ConfirmRequestModal({
    super.key,
    required this.serviceTitle,
    required this.selected,
    required this.items,
  });

  @override
  State<ConfirmRequestModal> createState() => _ConfirmRequestModalState();
}

class _ConfirmRequestModalState extends State<ConfirmRequestModal> {
  late Map<int, int> selected;
  String deliveryMethod = 'Drop at door';
  TimeOfDay? startTime;
  TimeOfDay? endTime;
  String priority = 'medium';

  @override
  void initState() {
    super.initState();
    selected = Map<int, int>.from(widget.selected);
    startTime = TimeOfDay.now();
    endTime = TimeOfDay.now().replacing(hour: TimeOfDay.now().hour + 1);
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
    selected.forEach((idx, qty) {
      final item = widget.items[idx];
      final requestedFor = item['title'] as String? ?? 'Item Request';
      itemsList.add('$requestedFor (x$qty)');
    });

    final itemsString = itemsList.join(', ');

    final notes =
        'Items: $itemsString; Method: $deliveryMethod; Window: ${startTime?.format(context) ?? ''} - ${endTime?.format(context) ?? ''}; Priority: $priority';

    // Calculate total quantity
    final totalQuantity = selected.values.fold<int>(0, (sum, qty) => sum + qty);

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
          priority:
              priority, // Removed .toLowerCase() since we're using valid enum values directly
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
          borderRadius: BorderRadius.all(Radius.circular(24)),
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
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Selected items',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  ...selected.entries.map((entry) {
                    final item = widget.items[entry.key];
                    final requestedFor =
                        item['title'] as String? ?? 'Item Request';
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        children: [
                          Text('$requestedFor x${entry.value}'),
                          Spacer(),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Delivery details',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                children: [
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text('Delivery method'),
                    trailing: DropdownButton<String>(
                      value: deliveryMethod,
                      items: [
                        DropdownMenuItem(
                          value: 'Drop at door',
                          child: Text('Drop at door'),
                        ),
                        DropdownMenuItem(
                          value: 'Hand to staff',
                          child: Text('Hand to staff'),
                        ),
                      ],
                      onChanged: (value) =>
                          setState(() => deliveryMethod = value!),
                    ),
                  ),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text('Time window'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        TextButton(
                          onPressed: () => _pickTime(true),
                          child: Text(startTime?.format(context) ?? 'Start'),
                        ),
                        Text(' - '),
                        TextButton(
                          onPressed: () => _pickTime(false),
                          child: Text(endTime?.format(context) ?? 'End'),
                        ),
                      ],
                    ),
                  ),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text('Priority'),
                    trailing: DropdownButton<String>(
                      value: priority,
                      items: [
                        DropdownMenuItem(value: 'low', child: Text('Low')),
                        DropdownMenuItem(
                          value: 'medium',
                          child: Text('Medium'),
                        ),
                        DropdownMenuItem(
                          value: 'urgent',
                          child: Text('Urgent'),
                        ),
                      ],
                      onChanged: (value) => setState(() => priority = value!),
                    ),
                  ),
                ],
              ),
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
