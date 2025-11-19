class ProfileData {
  final String name;
  final String? phone;
  final String? email;
  final String hotel;
  final String room;
  final String checkIn;
  final String checkOut;
  final String language;

  ProfileData({
    required this.name,
    this.phone,
    this.email,
    required this.hotel,
    required this.room,
    required this.checkIn,
    required this.checkOut,
    required this.language,
  });

  ProfileData.fromJson(Map<String, dynamic> json)
    : name = json['name'] as String,
      phone = json['phone'] as String?,
      email = json['email'] as String?,
      hotel = json['hotel'] as String,
      room = json['room'] as String,
      checkIn = json['checkIn'] as String,
      checkOut = json['checkOut'] as String,
      language = json['language'] as String;

  Map<String, dynamic> toJson() => {
    'name': name,
    'phone': phone,
    'email': email,
    'hotel': hotel,
    'room': room,
    'checkIn': checkIn,
    'checkOut': checkOut,
    'language': language,
  };
}
