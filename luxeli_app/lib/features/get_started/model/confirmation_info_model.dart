class ConfirmationInfo {
  final String fullName;
  final String phoneNumber;
  final String checkIn;
  final String checkOut;

  ConfirmationInfo({
    required this.fullName,
    required this.phoneNumber,
    required this.checkIn,
    required this.checkOut,
  });

  factory ConfirmationInfo.fromQrData(String qrData) {
    final dataMap = <String, String>{};
    final pairs = qrData.split(';');
    for (final pair in pairs) {
      final parts = pair.split(':');
      if (parts.length == 2) {
        dataMap[parts[0].trim()] = parts[1].trim();
      }
    }
    return ConfirmationInfo(
      fullName: dataMap['name'] ?? 'Unknown Guest',
      phoneNumber: dataMap['phone'] ?? 'Unknown',
      checkIn: dataMap['checkin'] ?? 'Unknown',
      checkOut: dataMap['checkout'] ?? 'Unknown',
    );
  }
  factory ConfirmationInfo.fromJson(Map<String, dynamic> json) {
    return ConfirmationInfo(
      fullName: json['fullName'] as String? ?? 'Unknown Guest',
      phoneNumber: json['phoneNumber'] as String? ?? 'Unknown',
      checkIn: json['checkIn'] as String? ?? 'Unknown',
      checkOut: json['checkOut'] as String? ?? 'Unknown',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'fullName': fullName,
      'phoneNumber': phoneNumber,
      'checkIn': checkIn,
      'checkOut': checkOut,
    };
  }
}
