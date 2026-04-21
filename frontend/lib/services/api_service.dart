import 'dart:convert';
import 'package:http/http.dart' as http;

const String apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://10.0.2.2:5000/api',
);

class ApiService {
  static const baseUrl = apiBaseUrl;

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    throw Exception(jsonDecode(response.body)['message'] ?? 'Login failed');
  }

  Future<List<dynamic>> fetchJobs() async {
    final response = await http.get(Uri.parse('$baseUrl/jobs'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to fetch jobs.');
  }

  Future<void> applyJob(String token, int jobId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/jobs/$jobId/apply'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['message'] ?? 'Failed to apply.');
    }
  }

  Future<List<dynamic>> fetchSubscriptions() async {
    final response = await http.get(Uri.parse('$baseUrl/subscriptions'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    throw Exception('Failed to fetch subscription plans.');
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

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['subscription_plan'] as String;
    }
    throw Exception(jsonDecode(response.body)['message'] ?? 'Subscription failed.');
  }
}
