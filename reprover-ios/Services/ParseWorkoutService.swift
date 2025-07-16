import Foundation
import Combine

// MARK: - Network Error
enum NetworkError: Error, LocalizedError {
    case invalidURL
    case noData
    case decodingError
    case serverError(String)
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .noData:
            return "No data received"
        case .decodingError:
            return "Failed to decode response"
        case .serverError(let message):
            return message
        }
    }
}

// MARK: - ParseWorkoutService
@MainActor
class ParseWorkoutService: ObservableObject {
    static let shared = ParseWorkoutService()
    private let baseURL = "https://www.reprover.dev"
    
    @Published var isLoading = false
    @Published var error: NetworkError?
    
    private init() {}
    
    // MARK: - Parse Workout
    func parseWorkout(text: String) async throws -> WorkoutPlan {
        guard let url = URL(string: "\(baseURL)/api/parse-workout") else {
            throw NetworkError.invalidURL
        }
        
        isLoading = true
        error = nil
        defer { isLoading = false }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ParseWorkoutRequest(text: text)
        request.httpBody = try JSONEncoder().encode(body)
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw NetworkError.serverError("Invalid response")
            }
            
            if httpResponse.statusCode != 200 {
                if let errorData = try? JSONDecoder().decode([String: String].self, from: data),
                   let errorMessage = errorData["error"] {
                    throw NetworkError.serverError(errorMessage)
                }
                throw NetworkError.serverError("HTTP \(httpResponse.statusCode)")
            }
            
            let workoutPlan = try JSONDecoder().decode(WorkoutPlan.self, from: data)
            return workoutPlan
        } catch let error as NetworkError {
            self.error = error
            throw error
        } catch {
            self.error = .decodingError
            throw NetworkError.decodingError
        }
    }
    
    // MARK: - Log Workout
    func logWorkout(_ log: WorkoutLog) async throws -> LogWorkoutResponse {
        guard let url = URL(string: "\(baseURL)/api/log-workout") else {
            throw NetworkError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(log)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.serverError("Invalid response")
        }
        
        if httpResponse.statusCode != 200 {
            if let errorData = try? JSONDecoder().decode([String: String].self, from: data),
               let errorMessage = errorData["error"] {
                throw NetworkError.serverError(errorMessage)
            }
            throw NetworkError.serverError("HTTP \(httpResponse.statusCode)")
        }
        
        return try JSONDecoder().decode(LogWorkoutResponse.self, from: data)
    }
    
    // MARK: - Get Exercise History
    func getExerciseHistory(exerciseName: String) async throws -> [ExerciseHistory] {
        guard let encodedName = exerciseName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "\(baseURL)/api/history?exercise=\(encodedName)") else {
            throw NetworkError.invalidURL
        }
        
        let (data, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.serverError("Invalid response")
        }
        
        if httpResponse.statusCode != 200 {
            if let errorData = try? JSONDecoder().decode([String: String].self, from: data),
               let errorMessage = errorData["error"] {
                throw NetworkError.serverError(errorMessage)
            }
            throw NetworkError.serverError("HTTP \(httpResponse.statusCode)")
        }
        
        return try JSONDecoder().decode([ExerciseHistory].self, from: data)
    }
    
    // MARK: - Get Exercise Info
    func getExerciseInfo(exerciseName: String) async throws -> ExerciseInfoResponse {
        guard let encodedName = exerciseName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "\(baseURL)/api/exercise-info?name=\(encodedName)") else {
            throw NetworkError.invalidURL
        }
        
        let (data, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.serverError("Invalid response")
        }
        
        if httpResponse.statusCode != 200 {
            throw NetworkError.serverError("HTTP \(httpResponse.statusCode)")
        }
        
        return try JSONDecoder().decode(ExerciseInfoResponse.self, from: data)
    }
}