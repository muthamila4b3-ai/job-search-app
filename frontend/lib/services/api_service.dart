import 'dart:convert';
import 'dart:io' show Platform;
import 'package:http/http.dart' as http;

const String apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: '',
);

class ApiService {
  static String get baseUrl {
    if (apiBaseUrl.isNotEmpty) {
      return apiBaseUrl;
    }
    // For Android emulator, use 10.0.2.2 to reach host machine
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:5000/api';
    }
    // For iOS simulator, web, and desktop, use localhost
    return 'http://localhost:5000/api';
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    final body = jsonDecode(response.body);
    if (body['success'] == true) {
      return body['data'];
    }
    throw Exception(body['message'] ?? 'Login failed');
  }

  Future<List<dynamic>> fetchJobs() async {
    final response = await http.get(Uri.parse('$baseUrl/jobs'));
    final body = jsonDecode(response.body);
    if (body['success'] == true) {
      return body['data'];
    }
    throw Exception(body['message'] ?? 'Failed to fetch jobs');
  }

  Future<void> applyJob(String token, int jobId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/jobs/$jobId/apply'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    final body = jsonDecode(response.body);
    if (body['success'] != true) {
      throw Exception(body['message'] ?? 'Failed to apply.');
    }
  }

  Future<List<dynamic>> fetchSubscriptions() async {
    final response = await http.get(Uri.parse('$baseUrl/subscriptions'));
    final body = jsonDecode(response.body);
    if (body['success'] == true) {
      return body['data'];
    }
    throw Exception(body['message'] ?? 'Failed to fetch subscription plans.');
  }

  Future<String> subscribePlan(String token, int planId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/subscriptions/subscribe'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'planId': planId}),
    );

    final body = jsonDecode(response.body);
    if (body['success'] == true) {
      return body['data']['subscription_plan'] as String;
    }
    throw Exception(body['message'] ?? 'Subscription failed.');
  }
}
