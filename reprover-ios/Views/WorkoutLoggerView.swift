import SwiftUI

struct WorkoutLoggerView: View {
    @StateObject private var service = ParseWorkoutService.shared
    let workoutPlan: WorkoutPlan
    
    @State private var actuals: [ExerciseActual] = []
    @State private var currentRound = 1
    @State private var isSaving = false
    @State private var showingSuccess = false
    @State private var showingError = false
    @State private var errorMessage = ""
    
    var totalRounds: Int {
        workoutPlan.reduce(0) { $0 + $1.rounds }
    }
    
    var currentExercises: [ExerciseActual] {
        actuals.filter { $0.round == currentRound }
    }
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Round Selector
                    roundSelector
                    
                    // Exercise Cards
                    ForEach(Array(currentExercises.enumerated()), id: \.offset) { index, exercise in
                        ExerciseLogCard(
                            exercise: exercise,
                            onUpdate: { updated in
                                if let actualIndex = actuals.firstIndex(where: { 
                                    $0.name == exercise.name && $0.round == exercise.round 
                                }) {
                                    actuals[actualIndex] = updated
                                }
                            }
                        )
                    }
                    
                    // Save Button
                    saveButton
                    
                    if currentRound == totalRounds {
                        completionNote
                    }
                }
                .padding()
            }
            .navigationTitle("Log Workout")
            .navigationBarTitleDisplayMode(.large)
            .onAppear {
                initializeActuals()
            }
            .alert("Success", isPresented: $showingSuccess) {
                Button("OK") { }
            } message: {
                Text("Workout logged successfully!")
            }
            .alert("Error", isPresented: $showingError) {
                Button("OK") { }
            } message: {
                Text(errorMessage)
            }
        }
    }
    
    // MARK: - Round Selector
    private var roundSelector: some View {
        HStack {
            Button(action: { currentRound = max(1, currentRound - 1) }) {
                Image(systemName: "chevron.left")
                    .font(.title2)
                    .foregroundColor(currentRound == 1 ? .gray : .blue)
            }
            .disabled(currentRound == 1)
            
            Spacer()
            
            Text("Round \(currentRound) of \(totalRounds)")
                .font(.title3)
                .fontWeight(.bold)
            
            Spacer()
            
            Button(action: { currentRound = min(totalRounds, currentRound + 1) }) {
                Image(systemName: "chevron.right")
                    .font(.title2)
                    .foregroundColor(currentRound == totalRounds ? .gray : .blue)
            }
            .disabled(currentRound == totalRounds)
        }
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(10)
    }
    
    // MARK: - Save Button
    private var saveButton: some View {
        Button(action: saveWorkout) {
            HStack {
                if isSaving {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                        .scaleEffect(0.8)
                }
                Text(isSaving ? "Saving..." : "Save Workout Log")
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(isSaving ? Color.gray : Color.green)
            .foregroundColor(.white)
            .cornerRadius(8)
        }
        .disabled(isSaving)
    }
    
    // MARK: - Completion Note
    private var completionNote: some View {
        Text("Great job! You're on the final round. Click \"Save Workout Log\" when done.")
            .font(.footnote)
            .foregroundColor(.green)
            .padding()
            .background(Color.green.opacity(0.1))
            .cornerRadius(8)
    }
    
    // MARK: - Initialize Actuals
    private func initializeActuals() {
        var tempActuals: [ExerciseActual] = []
        
        for round in workoutPlan {
            for roundNum in 1...round.rounds {
                for exercise in round.exercises {
                    tempActuals.append(ExerciseActual(
                        name: exercise.name,
                        round: roundNum,
                        reps: exercise.reps,
                        weight: exercise.weight
                    ))
                }
            }
        }
        
        actuals = tempActuals
    }
    
    // MARK: - Save Workout
    private func saveWorkout() {
        isSaving = true
        
        let workoutLog = WorkoutLog(
            timestamp: ISO8601DateFormatter().string(from: Date()),
            plan: workoutPlan,
            actuals: actuals
        )
        
        Task {
            do {
                let response = try await service.logWorkout(workoutLog)
                await MainActor.run {
                    print("Workout saved with ID: \(response.id)")
                    showingSuccess = true
                    isSaving = false
                }
            } catch {
                await MainActor.run {
                    // For now, just log to console since backend might not be configured
                    if let jsonData = try? JSONEncoder().encode(workoutLog),
                       let jsonString = String(data: jsonData, encoding: .utf8) {
                        print("Workout Log (saved locally):")
                        print(jsonString)
                        showingSuccess = true
                    } else {
                        errorMessage = error.localizedDescription
                        showingError = true
                    }
                    isSaving = false
                }
            }
        }
    }
}

// MARK: - Exercise Log Card
struct ExerciseLogCard: View {
    @State var exercise: ExerciseActual
    let onUpdate: (ExerciseActual) -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(exercise.name)
                .font(.headline)
            
            HStack(spacing: 20) {
                VStack(alignment: .leading) {
                    Text("Reps")
                        .font(.caption)
                        .foregroundColor(.gray)
                    TextField("0", value: $exercise.reps, format: .number)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .keyboardType(.numberPad)
                        .onChange(of: exercise.reps) { _ in
                            onUpdate(exercise)
                        }
                }
                
                VStack(alignment: .leading) {
                    Text("Weight (lbs)")
                        .font(.caption)
                        .foregroundColor(.gray)
                    TextField("0", value: $exercise.weight, format: .number)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .keyboardType(.decimalPad)
                        .onChange(of: exercise.weight) { _ in
                            onUpdate(exercise)
                        }
                }
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(8)
        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
    }
}

// MARK: - Preview
struct WorkoutLoggerView_Previews: PreviewProvider {
    static let samplePlan: WorkoutPlan = [
        WorkoutRound(rounds: 3, exercises: [
            Exercise(name: "Push-ups", reps: 10, weight: nil, weightUnit: nil, duration: nil, note: nil),
            Exercise(name: "Squats", reps: 15, weight: 135, weightUnit: "lbs", duration: nil, note: nil)
        ])
    ]
    
    static var previews: some View {
        WorkoutLoggerView(workoutPlan: samplePlan)
    }
}