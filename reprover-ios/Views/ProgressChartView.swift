import SwiftUI
import Charts

struct ProgressChartView: View {
    @StateObject private var service = ParseWorkoutService.shared
    let workoutPlan: WorkoutPlan
    
    @State private var selectedExercise = ""
    @State private var history: [ExerciseHistory] = []
    @State private var isLoading = false
    @State private var showingError = false
    @State private var errorMessage = ""
    
    // Get unique exercises from workout plan
    var uniqueExercises: [String] {
        var exercises = Set<String>()
        for round in workoutPlan {
            for exercise in round.exercises {
                exercises.insert(exercise.name)
            }
        }
        return Array(exercises).sorted()
    }
    
    // Process history data for charting
    var chartData: [(date: Date, reps: Int, weight: Double)] {
        let dateFormatter = ISO8601DateFormatter()
        var groupedData: [String: (totalReps: Int, maxWeight: Double, count: Int)] = [:]
        
        // Group by date and aggregate
        for entry in history {
            let dateString = String(entry.date.prefix(10)) // Get date part only
            var data = groupedData[dateString] ?? (0, 0, 0)
            data.totalReps += entry.reps ?? 0
            data.maxWeight = max(data.maxWeight, entry.weight ?? 0)
            data.count += 1
            groupedData[dateString] = data
        }
        
        // Convert to chart data
        return groupedData.compactMap { dateString, data in
            guard let date = dateFormatter.date(from: dateString + "T00:00:00Z") else { return nil }
            let avgReps = data.count > 0 ? data.totalReps / data.count : 0
            return (date, avgReps, data.maxWeight)
        }.sorted { $0.date < $1.date }
    }
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Exercise Picker
                    exercisePicker
                    
                    if isLoading {
                        ProgressView("Loading history...")
                            .frame(height: 300)
                    } else if chartData.isEmpty {
                        noDataView
                    } else {
                        // Charts
                        chartsSection
                    }
                    
                    // Legend
                    if !chartData.isEmpty {
                        chartLegend
                    }
                }
                .padding()
            }
            .navigationTitle("Progress Charts")
            .navigationBarTitleDisplayMode(.large)
            .onAppear {
                if !uniqueExercises.isEmpty && selectedExercise.isEmpty {
                    selectedExercise = uniqueExercises[0]
                }
            }
            .onChange(of: selectedExercise) { _ in
                fetchHistory()
            }
            .alert("Error", isPresented: $showingError) {
                Button("OK") { }
            } message: {
                Text(errorMessage)
            }
        }
    }
    
    // MARK: - Exercise Picker
    private var exercisePicker: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Select Exercise:")
                .font(.headline)
            
            Picker("Exercise", selection: $selectedExercise) {
                ForEach(uniqueExercises, id: \.self) { exercise in
                    Text(exercise).tag(exercise)
                }
            }
            .pickerStyle(SegmentedPickerStyle())
        }
    }
    
    // MARK: - No Data View
    private var noDataView: some View {
        VStack(spacing: 16) {
            Image(systemName: "chart.line.uptrend.xyaxis")
                .font(.system(size: 60))
                .foregroundColor(.gray)
            
            Text("No history data available for \(selectedExercise)")
                .font(.headline)
                .foregroundColor(.gray)
            
            Text("Complete some workouts to see your progress!")
                .font(.subheadline)
                .foregroundColor(.gray.opacity(0.8))
        }
        .frame(height: 300)
    }
    
    // MARK: - Charts Section
    @available(iOS 17.0, *)
    private var chartsSection: some View {
        VStack(spacing: 24) {
            // Reps Chart
            VStack(alignment: .leading) {
                Text("Average Reps")
                    .font(.headline)
                
                Chart(chartData, id: \.date) { item in
                    LineMark(
                        x: .value("Date", item.date),
                        y: .value("Reps", item.reps)
                    )
                    .foregroundStyle(.blue)
                    .symbol(.circle)
                    .symbolSize(50)
                    
                    PointMark(
                        x: .value("Date", item.date),
                        y: .value("Reps", item.reps)
                    )
                    .foregroundStyle(.blue)
                }
                .frame(height: 200)
                .chartXAxis {
                    AxisMarks(values: .stride(by: .day)) { _ in
                        AxisGridLine()
                        AxisTick()
                        AxisValueLabel(format: .dateTime.month().day())
                    }
                }
            }
            
            // Weight Chart
            if chartData.contains(where: { $0.weight > 0 }) {
                VStack(alignment: .leading) {
                    Text("Maximum Weight (lbs)")
                        .font(.headline)
                    
                    Chart(chartData.filter { $0.weight > 0 }, id: \.date) { item in
                        LineMark(
                            x: .value("Date", item.date),
                            y: .value("Weight", item.weight)
                        )
                        .foregroundStyle(.green)
                        .symbol(.circle)
                        .symbolSize(50)
                        
                        PointMark(
                            x: .value("Date", item.date),
                            y: .value("Weight", item.weight)
                        )
                        .foregroundStyle(.green)
                    }
                    .frame(height: 200)
                    .chartXAxis {
                        AxisMarks(values: .stride(by: .day)) { _ in
                            AxisGridLine()
                            AxisTick()
                            AxisValueLabel(format: .dateTime.month().day())
                        }
                    }
                }
            }
        }
    }
    
    // Fallback for iOS 16
    @available(iOS 16.0, *)
    private var chartsSectionFallback: some View {
        VStack(spacing: 16) {
            Text("Charts require iOS 17 or later")
                .font(.headline)
                .foregroundColor(.gray)
            
            // Show data in list format for older iOS versions
            List(chartData, id: \.date) { item in
                HStack {
                    Text(item.date, style: .date)
                    Spacer()
                    VStack(alignment: .trailing) {
                        Text("\(item.reps) reps")
                        if item.weight > 0 {
                            Text("\(Int(item.weight)) lbs")
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
            .frame(height: 300)
        }
    }
    
    // MARK: - Chart Legend
    private var chartLegend: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Chart Guide:")
                .font(.headline)
            
            HStack {
                Circle()
                    .fill(Color.blue)
                    .frame(width: 12, height: 12)
                Text("Average reps per workout")
                    .font(.footnote)
            }
            
            if chartData.contains(where: { $0.weight > 0 }) {
                HStack {
                    Circle()
                        .fill(Color.green)
                        .frame(width: 12, height: 12)
                    Text("Maximum weight used")
                        .font(.footnote)
                }
            }
            
            Text("Each point represents a workout day where you performed \(selectedExercise)")
                .font(.caption)
                .foregroundColor(.gray)
                .padding(.top, 4)
        }
        .padding()
        .background(Color.gray.opacity(0.1))
        .cornerRadius(8)
    }
    
    // MARK: - Fetch History
    private func fetchHistory() {
        guard !selectedExercise.isEmpty else { return }
        
        isLoading = true
        Task {
            do {
                let data = try await service.getExerciseHistory(exerciseName: selectedExercise)
                await MainActor.run {
                    self.history = data
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.showingError = true
                    self.isLoading = false
                    // For demo, use sample data
                    self.history = generateSampleHistory()
                }
            }
        }
    }
    
    // MARK: - Sample Data (for demo)
    private func generateSampleHistory() -> [ExerciseHistory] {
        let calendar = Calendar.current
        let today = Date()
        
        return (0..<10).compactMap { dayOffset in
            guard let date = calendar.date(byAdding: .day, value: -dayOffset * 3, to: today) else { return nil }
            let dateString = ISO8601DateFormatter().string(from: date)
            
            return ExerciseHistory(
                date: dateString,
                reps: Int.random(in: 8...12),
                weight: selectedExercise.lowercased().contains("squat") ? Double.random(in: 100...150) : nil,
                round: 1
            )
        }.reversed()
    }
}

// MARK: - Preview
struct ProgressChartView_Previews: PreviewProvider {
    static let samplePlan: WorkoutPlan = [
        WorkoutRound(rounds: 3, exercises: [
            Exercise(name: "Push-ups", reps: 10, weight: nil, weightUnit: nil, duration: nil, note: nil),
            Exercise(name: "Squats", reps: 15, weight: 135, weightUnit: "lbs", duration: nil, note: nil)
        ])
    ]
    
    static var previews: some View {
        ProgressChartView(workoutPlan: samplePlan)
    }
}