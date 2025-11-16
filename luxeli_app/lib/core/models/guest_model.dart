class GuestData {
  final String userId;
  final String partnerId;
  final String roomId;
  final String roomName;
  final String guestName;
  final String? guestEmail;
  final String? guestPhone;
  final String? checkInDate;
  final String? checkOutDate;
  final String token;

  GuestData({
    required this.userId,
    required this.partnerId,
    required this.roomId,
    required this.roomName,
    required this.guestName,
    this.guestEmail,
    this.guestPhone,
    this.checkInDate,
    this.checkOutDate,
    required this.token,
  });

  factory GuestData.fromJson(Map<String, dynamic> json) {
    return GuestData(
      userId: json['userId'],
      partnerId: json['partnerId'],
      roomId: json['roomId'],
      roomName: json['roomName'],
      guestName: json['guestName'],
      guestEmail: json['guestEmail'],
      guestPhone: json['guestPhone'],
      checkInDate: json['checkInDate']?.toString(),
      checkOutDate: json['checkOutDate']?.toString(),
      token: json['token'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'partnerId': partnerId,
      'roomId': roomId,
      'roomName': roomName,
      'guestName': guestName,
      'guestEmail': guestEmail,
      'guestPhone': guestPhone,
      'checkInDate': checkInDate,
      'checkOutDate': checkOutDate,
      'token': token,
    };
  }
}
