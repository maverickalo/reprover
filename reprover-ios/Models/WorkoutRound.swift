import Foundation

// MARK: - Exercise Model
struct Exercise: Codable, Identifiable, Hashable {
    let id = UUID()
    var name: String
    var reps: Int?
    var weight: Double?
    var weightUnit: String?
    var duration: String?
    var note: String?
    
    enum CodingKeys: String, CodingKey {
        case name, reps, weight
        case weightUnit = "weight_unit"
        case duration, note
    }
    
    // Custom encoding/decoding to handle id
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        name = try container.decode(String.self, forKey: .name)
        reps = try container.decodeIfPresent(Int.self, forKey: .reps)
        weight = try container.decodeIfPresent(Double.self, forKey: .weight)
        weightUnit = try container.decodeIfPresent(String.self, forKey: .weightUnit)
        duration = try container.decodeIfPresent(String.self, forKey: .duration)
        note = try container.decodeIfPresent(String.self, forKey: .note)
    }
}

// MARK: - WorkoutRound Model
struct WorkoutRound: Codable, Identifiable, Hashable {
    let id = UUID()
    var rounds: Int
    var exercises: [Exercise]
    
    enum CodingKeys: String, CodingKey {
        case rounds, exercises
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        rounds = try container.decode(Int.self, forKey: .rounds)
        exercises = try container.decode([Exercise].self, forKey: .exercises)
    }
    
    init(rounds: Int, exercises: [Exercise]) {
        self.rounds = rounds
        self.exercises = exercises
    }
}

// MARK: - WorkoutPlan Type Alias
typealias WorkoutPlan = [WorkoutRound]

// MARK: - Exercise Actual (for logging)
struct ExerciseActual: Codable, Hashable {
    var name: String
    var round: Int
    var reps: Int?
    var weight: Double?
}

// MARK: - Workout Log
struct WorkoutLog: Codable {
    var timestamp: String
    var plan: WorkoutPlan
    var actuals: [ExerciseActual]
}

// MARK: - Exercise History
struct ExerciseHistory: Codable, Identifiable {
    let id = UUID()
    var date: String
    var reps: Int?
    var weight: Double?
    var round: Int
    
    enum CodingKeys: String, CodingKey {
        case date, reps, weight, round
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        date = try container.decode(String.self, forKey: .date)
        reps = try container.decodeIfPresent(Int.self, forKey: .reps)
        weight = try container.decodeIfPresent(Double.self, forKey: .weight)
        round = try container.decode(Int.self, forKey: .round)
    }
}

// MARK: - API Response Models
struct ParseWorkoutRequest: Codable {
    let text: String
}

struct LogWorkoutResponse: Codable {
    let status: String
    let id: String
}

struct ExerciseInfoResponse: Codable {
    let description: String
    let videoUrl: String?
}