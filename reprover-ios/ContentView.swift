import SwiftUI

struct ContentView: View {
    @State private var workoutPlan: WorkoutPlan?
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Plan Builder Tab
            PlanBuilderView()
                .tabItem {
                    Label("Plan", systemImage: "doc.text")
                }
                .tag(0)
            
            // Workout Logger Tab
            if let plan = workoutPlan {
                WorkoutLoggerView(workoutPlan: plan)
                    .tabItem {
                        Label("Log", systemImage: "pencil.circle")
                    }
                    .tag(1)
            } else {
                NoPlanView()
                    .tabItem {
                        Label("Log", systemImage: "pencil.circle")
                    }
                    .tag(1)
            }
            
            // Progress Charts Tab
            if let plan = workoutPlan {
                ProgressChartView(workoutPlan: plan)
                    .tabItem {
                        Label("Progress", systemImage: "chart.line.uptrend.xyaxis")
                    }
                    .tag(2)
            } else {
                NoPlanView()
                    .tabItem {
                        Label("Progress", systemImage: "chart.line.uptrend.xyaxis")
                    }
                    .tag(2)
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: Notification.Name("WorkoutPlanCreated"))) { notification in
            if let plan = notification.object as? WorkoutPlan {
                self.workoutPlan = plan
            }
        }
    }
}

// MARK: - No Plan View
struct NoPlanView: View {
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Image(systemName: "doc.text.magnifyingglass")
                    .font(.system(size: 60))
                    .foregroundColor(.gray)
                
                Text("No Workout Plan")
                    .font(.title2)
                    .fontWeight(.bold)
                
                Text("Create a workout plan first by going to the Plan tab")
                    .font(.body)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }
            .navigationTitle("Reprover")
        }
    }
}

// MARK: - App Entry Point
struct ReproverApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

// MARK: - Preview
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}