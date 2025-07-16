import SwiftUI

struct PlanBuilderView: View {
    @StateObject private var service = ParseWorkoutService.shared
    @State private var workoutText = ""
    @State private var workoutPlan: WorkoutPlan = []
    @State private var showingError = false
    @State private var errorMessage = ""
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Input Section
                    inputSection
                    
                    if !workoutPlan.isEmpty {
                        Divider()
                            .padding(.vertical)
                        
                        // Plan Review Section
                        planReviewSection
                    }
                }
                .padding()
            }
            .navigationTitle("Reprover")
            .navigationBarTitleDisplayMode(.large)
            .alert("Error", isPresented: $showingError) {
                Button("OK") { }
            } message: {
                Text(errorMessage)
            }
        }
    }
    
    // MARK: - Input Section
    private var inputSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Paste your trainer's workout message:")
                .font(.headline)
            
            TextEditor(text: $workoutText)
                .frame(minHeight: 150)
                .padding(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                )
                .overlay(alignment: .topLeading) {
                    if workoutText.isEmpty {
                        Text("e.g., 3 rounds: 10 push-ups, 15 squats at 135lbs, 30 second plank")
                            .foregroundColor(.gray)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 12)
                            .allowsHitTesting(false)
                    }
                }
            
            Button(action: parseWorkout) {
                HStack {
                    if service.isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle())
                            .scaleEffect(0.8)
                    }
                    Text(service.isLoading ? "Parsing..." : "Parse Workout")
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(workoutText.isEmpty || service.isLoading ? Color.gray : Color.blue)
                .foregroundColor(.white)
                .cornerRadius(8)
            }
            .disabled(workoutText.isEmpty || service.isLoading)
        }
    }
    
    // MARK: - Plan Review Section
    private var planReviewSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Review Your Workout Plan")
                .font(.title2)
                .fontWeight(.bold)
            
            ForEach(Array(workoutPlan.enumerated()), id: \.offset) { roundIndex, round in
                RoundCard(
                    round: round,
                    roundIndex: roundIndex,
                    onUpdate: { updatedRound in
                        workoutPlan[roundIndex] = updatedRound
                    }
                )
            }
            
            Button(action: savePlan) {
                Text("Save Plan")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.green)
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
            .padding(.top)
        }
    }
    
    // MARK: - Actions
    private func parseWorkout() {
        Task {
            do {
                let plan = try await service.parseWorkout(text: workoutText)
                await MainActor.run {
                    self.workoutPlan = plan
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.showingError = true
                }
            }
        }
    }
    
    private func savePlan() {
        // For now, just print to console
        if let jsonData = try? JSONEncoder().encode(workoutPlan),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            print("Saved workout plan:")
            print(jsonString)
        }
        
        // Show success feedback
        errorMessage = "Plan saved! (Check console for JSON)"
        showingError = true
    }
}

// MARK: - Round Card Component
struct RoundCard: View {
    @State var round: WorkoutRound
    let roundIndex: Int
    let onUpdate: (WorkoutRound) -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Rounds:")
                    .fontWeight(.semibold)
                
                TextField("", value: $round.rounds, format: .number)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .frame(width: 60)
                    .onChange(of: round.rounds) { _ in
                        onUpdate(round)
                    }
            }
            
            ForEach(Array(round.exercises.enumerated()), id: \.offset) { exerciseIndex, exercise in
                ExerciseCard(
                    exercise: exercise,
                    onUpdate: { updatedExercise in
                        round.exercises[exerciseIndex] = updatedExercise
                        onUpdate(round)
                    }
                )
            }
        }
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(8)
    }
}

// MARK: - Exercise Card Component
struct ExerciseCard: View {
    @State var exercise: Exercise
    let onUpdate: (Exercise) -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            TextField("Exercise name", text: $exercise.name)
                .font(.headline)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .onChange(of: exercise.name) { _ in
                    onUpdate(exercise)
                }
            
            HStack(spacing: 12) {
                VStack(alignment: .leading) {
                    Text("Reps")
                        .font(.caption)
                        .foregroundColor(.gray)
                    TextField("", value: $exercise.reps, format: .number)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .onChange(of: exercise.reps) { _ in
                            onUpdate(exercise)
                        }
                }
                
                VStack(alignment: .leading) {
                    Text("Weight")
                        .font(.caption)
                        .foregroundColor(.gray)
                    TextField("", value: $exercise.weight, format: .number)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .onChange(of: exercise.weight) { _ in
                            onUpdate(exercise)
                        }
                }
                
                VStack(alignment: .leading) {
                    Text("Unit")
                        .font(.caption)
                        .foregroundColor(.gray)
                    TextField("", text: Binding(
                        get: { exercise.weightUnit ?? "" },
                        set: { exercise.weightUnit = $0.isEmpty ? nil : $0 }
                    ))
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .onChange(of: exercise.weightUnit) { _ in
                        onUpdate(exercise)
                    }
                }
                
                VStack(alignment: .leading) {
                    Text("Duration")
                        .font(.caption)
                        .foregroundColor(.gray)
                    TextField("", text: Binding(
                        get: { exercise.duration ?? "" },
                        set: { exercise.duration = $0.isEmpty ? nil : $0 }
                    ))
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .onChange(of: exercise.duration) { _ in
                        onUpdate(exercise)
                    }
                }
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(6)
        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 1)
    }
}

// MARK: - Preview
struct PlanBuilderView_Previews: PreviewProvider {
    static var previews: some View {
        PlanBuilderView()
    }
}