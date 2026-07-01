#!/usr/bin/env python3
"""
Veritas Project Tracker Agent
Monitors project progress, tracks tasks, and provides status updates.
"""

import os
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict, field
from enum import Enum

class TaskStatus(Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    BLOCKED = "blocked"

class TaskPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class Task:
    id: str
    title: str
    description: str
    status: str  # Changed from TaskStatus to str
    priority: str  # Changed from TaskPriority to str
    category: str
    estimated_hours: float
    actual_hours: float
    dependencies: List[str]
    created_at: str
    completed_at: Optional[str]
    notes: str

@dataclass
class Milestone:
    id: str
    title: str
    description: str
    target_date: str
    tasks: List[str]
    status: str  # Changed from TaskStatus to str
    completion_percentage: float

class ProjectTracker:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.data_file = self.project_root / ".project_tracker" / "data.json"
        self.data_file.parent.mkdir(parents=True, exist_ok=True)
        self.load_data()
    
    def load_data(self):
        """Load project data from file."""
        if self.data_file.exists():
            with open(self.data_file, 'r') as f:
                data = json.load(f)
                self.tasks = {k: Task(**v) for k, v in data.get('tasks', {}).items()}
                self.milestones = {k: Milestone(**v) for k, v in data.get('milestones', {}).items()}
        else:
            self.tasks = {}
            self.milestones = {}
            self.initialize_default_tasks()
    
    def save_data(self):
        """Save project data to file."""
        data = {
            'tasks': {k: asdict(v) for k, v in self.tasks.items()},
            'milestones': {k: asdict(v) for k, v in self.milestones.items()},
            'last_updated': datetime.now().isoformat()
        }
        with open(self.data_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def initialize_default_tasks(self):
        """Initialize default tasks for Veritas project."""
        
        # Phase 1: Foundation
        self.add_task(Task(
            id="1.1",
            title="Project Setup",
            description="Initialize Next.js project, install dependencies, configure environment",
            status="completed",
            priority="critical",
            category="Foundation",
            estimated_hours=4,
            actual_hours=3,
            dependencies=[],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="Project initialized successfully"
        ))
        
        self.add_task(Task(
            id="1.2",
            title="TypeScript Types",
            description="Define all TypeScript interfaces and types",
            status="completed",
            priority="high",
            category="Foundation",
            estimated_hours=2,
            actual_hours=1.5,
            dependencies=["1.1"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="Types defined for ContentVerification, TrustScore, etc."
        ))
        
        self.add_task(Task(
            id="1.3",
            title="Utility Functions",
            description="Create utility functions and helpers",
            status="completed",
            priority="medium",
            category="Foundation",
            estimated_hours=2,
            actual_hours=1,
            dependencies=["1.2"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="Utils created for trust colors, formatting, etc."
        ))
        
        # Phase 2: Core Libraries
        self.add_task(Task(
            id="2.1",
            title="OpenAI Integration",
            description="Implement AI content analysis and detection",
            status="completed",
            priority="critical",
            category="Core Libraries",
            estimated_hours=6,
            actual_hours=4,
            dependencies=["1.2"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="AI analysis for text, content, and claims extraction"
        ))
        
        self.add_task(Task(
            id="2.2",
            title="Supabase Integration",
            description="Set up database client and queries",
            status="completed",
            priority="high",
            category="Core Libraries",
            estimated_hours=4,
            actual_hours=2,
            dependencies=["1.2"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="Database client for verifications and source credibility"
        ))
        
        self.add_task(Task(
            id="2.3",
            title="Stripe Integration",
            description="Set up payment processing",
            status="completed",
            priority="medium",
            category="Core Libraries",
            estimated_hours=4,
            actual_hours=2,
            dependencies=["1.1"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="Payment integration with plans and checkout"
        ))
        
        # Phase 3: API Routes
        self.add_task(Task(
            id="3.1",
            title="Verify API",
            description="Main verification endpoint",
            status="completed",
            priority="critical",
            category="API Routes",
            estimated_hours=8,
            actual_hours=6,
            dependencies=["2.1", "2.2"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="Full verification with C2PA, AI detection, source scoring"
        ))
        
        self.add_task(Task(
            id="3.2",
            title="Trust Score API",
            description="Trust score calculation endpoint",
            status="completed",
            priority="high",
            category="API Routes",
            estimated_hours=4,
            actual_hours=3,
            dependencies=["2.1"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="Trust score with breakdown and factors"
        ))
        
        self.add_task(Task(
            id="3.3",
            title="Content Credentials API",
            description="C2PA verification endpoint",
            status="completed",
            priority="high",
            category="API Routes",
            estimated_hours=6,
            actual_hours=4,
            dependencies=["2.1"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="C2PA credential reading and verification"
        ))
        
        self.add_task(Task(
            id="3.4",
            title="AI Detection API",
            description="AI/deepfake detection endpoint",
            status="completed",
            priority="high",
            category="API Routes",
            estimated_hours=4,
            actual_hours=3,
            dependencies=["2.1"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="AI content detection with batch support"
        ))
        
        self.add_task(Task(
            id="3.5",
            title="Source Credibility API",
            description="Source scoring endpoint",
            status="completed",
            priority="medium",
            category="API Routes",
            estimated_hours=4,
            actual_hours=2,
            dependencies=["2.2"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="Source credibility with known trusted sources"
        ))
        
        self.add_task(Task(
            id="3.6",
            title="User Verifications API",
            description="User verification history endpoint",
            status="completed",
            priority="medium",
            category="API Routes",
            estimated_hours=4,
            actual_hours=2,
            dependencies=["2.2"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="CRUD for user verification history"
        ))
        
        self.add_task(Task(
            id="3.7",
            title="Stripe APIs",
            description="Payment and webhook endpoints",
            status="completed",
            priority="medium",
            category="API Routes",
            estimated_hours=6,
            actual_hours=3,
            dependencies=["2.3"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="Checkout, webhook endpoints"
        ))
        
        # Phase 4: UI Components
        self.add_task(Task(
            id="4.1",
            title="Landing Page",
            description="Main marketing landing page",
            status="completed",
            priority="critical",
            category="UI Components",
            estimated_hours=12,
            actual_hours=8,
            dependencies=["1.1"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="Professional landing page with features, pricing, etc."
        ))
        
        self.add_task(Task(
            id="4.2",
            title="Sign Up Page",
            description="User registration page",
            status="completed",
            priority="high",
            category="UI Components",
            estimated_hours=6,
            actual_hours=4,
            dependencies=["4.1"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="Split layout with social sign up"
        ))
        
        self.add_task(Task(
            id="4.3",
            title="Sign In Page",
            description="User login page",
            status="completed",
            priority="high",
            category="UI Components",
            estimated_hours=4,
            actual_hours=3,
            dependencies=["4.1"],
            created_at=datetime.now().isoformat(),
            completed_at=datetime.now().isoformat(),
            notes="Split layout with social sign in"
        ))
        
        # Phase 5: Pending Tasks
        self.add_task(Task(
            id="5.1",
            title="Dashboard Page",
            description="User dashboard with verification history",
            status="not_started",
            priority="high",
            category="UI Components",
            estimated_hours=12,
            actual_hours=0,
            dependencies=["4.2", "3.6"],
            created_at=datetime.now().isoformat(),
            completed_at=None,
            notes="Dashboard with stats, history, and settings"
        ))
        
        self.add_task(Task(
            id="5.2",
            title="Browser Extension",
            description="Chrome/Firefox extension for trust scores",
            status="not_started",
            priority="high",
            category="Extensions",
            estimated_hours=40,
            actual_hours=0,
            dependencies=["3.1"],
            created_at=datetime.now().isoformat(),
            completed_at=None,
            notes="Extension for real-time trust scores"
        ))
        
        self.add_task(Task(
            id="5.3",
            title="Mobile App",
            description="React Native mobile app",
            status="not_started",
            priority="medium",
            category="Mobile",
            estimated_hours=80,
            actual_hours=0,
            dependencies=["3.1"],
            created_at=datetime.now().isoformat(),
            completed_at=None,
            notes="iOS and Android app"
        ))
        
        self.add_task(Task(
            id="5.4",
            title="Database Schema",
            description="Supabase database schema and migrations",
            status="not_started",
            priority="high",
            category="Database",
            estimated_hours=8,
            actual_hours=0,
            dependencies=["2.2"],
            created_at=datetime.now().isoformat(),
            completed_at=None,
            notes="Tables for verifications, users, sources"
        ))
        
        self.add_task(Task(
            id="5.5",
            title="Authentication",
            description="Clerk authentication integration",
            status="not_started",
            priority="critical",
            category="Auth",
            estimated_hours=12,
            actual_hours=0,
            dependencies=["5.4"],
            created_at=datetime.now().isoformat(),
            completed_at=None,
            notes="Sign up, sign in, session management"
        ))
        
        self.add_task(Task(
            id="5.6",
            title="C2PA Library Integration",
            description="Real C2PA credential reading",
            status="not_started",
            priority="high",
            category="Core",
            estimated_hours=20,
            actual_hours=0,
            dependencies=["3.3"],
            created_at=datetime.now().isoformat(),
            completed_at=None,
            notes="Actual C2PA verification implementation"
        ))
        
        self.add_task(Task(
            id="5.7",
            title="Deployment",
            description="Deploy to Vercel/production",
            status="not_started",
            priority="high",
            category="DevOps",
            estimated_hours=8,
            actual_hours=0,
            dependencies=["5.4", "5.5"],
            created_at=datetime.now().isoformat(),
            completed_at=None,
            notes="Production deployment with env vars"
        ))
        
        # Initialize milestones
        self.initialize_milestones()
        self.save_data()
    
    def initialize_milestones(self):
        """Initialize project milestones."""
        
        self.milestones["M1"] = Milestone(
            id="M1",
            title="Foundation Complete",
            description="Project setup, types, utilities",
            target_date=datetime.now().isoformat(),
            tasks=["1.1", "1.2", "1.3"],
            status="completed",
            completion_percentage=100
        )
        
        self.milestones["M2"] = Milestone(
            id="M2",
            title="Core Libraries Complete",
            description="OpenAI, Supabase, Stripe integrations",
            target_date=datetime.now().isoformat(),
            tasks=["2.1", "2.2", "2.3"],
            status="completed",
            completion_percentage=100
        )
        
        self.milestones["M3"] = Milestone(
            id="M3",
            title="API Routes Complete",
            description="All API endpoints implemented",
            target_date=datetime.now().isoformat(),
            tasks=["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7"],
            status="completed",
            completion_percentage=100
        )
        
        self.milestones["M4"] = Milestone(
            id="M4",
            title="UI Complete",
            description="Landing page, sign up, sign in",
            target_date=datetime.now().isoformat(),
            tasks=["4.1", "4.2", "4.3"],
            status="completed",
            completion_percentage=100
        )
        
        self.milestones["M5"] = Milestone(
            id="M5",
            title="MVP Ready",
            description="Dashboard, auth, database, deployment",
            target_date=(datetime.now() + timedelta(days=14)).isoformat(),
            tasks=["5.1", "5.4", "5.5", "5.7"],
            status="in_progress",
            completion_percentage=0
        )
        
        self.milestones["M6"] = Milestone(
            id="M6",
            title="Beta Launch",
            description="Browser extension, mobile app",
            target_date=(datetime.now() + timedelta(days=60)).isoformat(),
            tasks=["5.2", "5.3", "5.6"],
            status="not_started",
            completion_percentage=0
        )
    
    def add_task(self, task: Task):
        """Add a new task."""
        self.tasks[task.id] = task
    
    def update_task_status(self, task_id: str, status: str, notes: str = ""):
        """Update task status."""
        if task_id in self.tasks:
            self.tasks[task_id].status = status
            if status == "completed":
                self.tasks[task_id].completed_at = datetime.now().isoformat()
            if notes:
                self.tasks[task_id].notes = notes
            self.save_data()
    
    def get_progress_summary(self) -> Dict:
        """Get overall project progress summary."""
        total_tasks = len(self.tasks)
        completed_tasks = sum(1 for t in self.tasks.values() if t.status == "completed")
        in_progress_tasks = sum(1 for t in self.tasks.values() if t.status == "in_progress")
        blocked_tasks = sum(1 for t in self.tasks.values() if t.status == "blocked")
        not_started_tasks = sum(1 for t in self.tasks.values() if t.status == "not_started")
        
        total_hours_estimated = sum(t.estimated_hours for t in self.tasks.values())
        total_hours_actual = sum(t.actual_hours for t in self.tasks.values())
        
        # Calculate milestone progress
        milestone_progress = {}
        for m_id, milestone in self.milestones.items():
            milestone_tasks = [self.tasks[tid] for tid in milestone.tasks if tid in self.tasks]
            if milestone_tasks:
                completed = sum(1 for t in milestone_tasks if t.status == "completed")
                milestone_progress[m_id] = {
                    "title": milestone.title,
                    "progress": (completed / len(milestone_tasks)) * 100,
                    "status": milestone.status
                }
        
        return {
            "overall_progress": (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "in_progress_tasks": in_progress_tasks,
            "blocked_tasks": blocked_tasks,
            "not_started_tasks": not_started_tasks,
            "total_hours_estimated": total_hours_estimated,
            "total_hours_actual": total_hours_actual,
            "efficiency": (total_hours_estimated / total_hours_actual * 100) if total_hours_actual > 0 else 100,
            "milestones": milestone_progress
        }
    
    def get_next_tasks(self, limit: int = 5) -> List[Task]:
        """Get next tasks to work on."""
        available_tasks = []
        
        for task in self.tasks.values():
            if task.status == "not_started":
                # Check if dependencies are met
                deps_met = all(
                    self.tasks.get(dep, Task("", "", "", "not_started", "low", "", 0, 0, [], "", None, "")).status == "completed"
                    for dep in task.dependencies
                )
                if deps_met:
                    available_tasks.append(task)
        
        # Sort by priority
        priority_order = {
            "critical": 0,
            "high": 1,
            "medium": 2,
            "low": 3
        }
        available_tasks.sort(key=lambda t: priority_order.get(t.priority, 4))
        
        return available_tasks[:limit]
    
    def get_blocked_tasks(self) -> List[Dict]:
        """Get blocked tasks with reasons."""
        blocked = []
        for task in self.tasks.values():
            if task.status == "not_started":
                unmet_deps = []
                for dep in task.dependencies:
                    dep_task = self.tasks.get(dep)
                    if dep_task and dep_task.status != "completed":
                        unmet_deps.append(dep_task.title)
                if unmet_deps:
                    blocked.append({
                        "task": task,
                        "blocked_by": unmet_deps
                    })
        return blocked
    
    def generate_report(self) -> str:
        """Generate a human-readable progress report."""
        summary = self.get_progress_summary()
        next_tasks = self.get_next_tasks()
        blocked_tasks = self.get_blocked_tasks()
        
        report = []
        report.append("=" * 60)
        report.append("VERITAS PROJECT PROGRESS REPORT")
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("=" * 60)
        report.append("")
        
        # Overall Progress
        report.append("📊 OVERALL PROGRESS")
        report.append("-" * 40)
        progress_bar = "█" * int(summary["overall_progress"] / 5) + "░" * (20 - int(summary["overall_progress"] / 5))
        report.append(f"  [{progress_bar}] {summary['overall_progress']:.1f}%")
        report.append("")
        report.append(f"  Total Tasks:      {summary['total_tasks']}")
        report.append(f"  ✅ Completed:     {summary['completed_tasks']}")
        report.append(f"  🔄 In Progress:   {summary['in_progress_tasks']}")
        report.append(f"  ⏸️  Not Started:   {summary['not_started_tasks']}")
        report.append(f"  🚫 Blocked:       {summary['blocked_tasks']}")
        report.append("")
        
        # Time Tracking
        report.append("⏱️  TIME TRACKING")
        report.append("-" * 40)
        report.append(f"  Estimated: {summary['total_hours_estimated']:.1f} hours")
        report.append(f"  Actual:    {summary['total_hours_actual']:.1f} hours")
        report.append(f"  Efficiency: {summary['efficiency']:.1f}%")
        report.append("")
        
        # Milestones
        report.append("🎯 MILESTONES")
        report.append("-" * 40)
        for m_id, m_data in summary["milestones"].items():
            status_icon = "✅" if m_data["status"] == "completed" else "🔄" if m_data["status"] == "in_progress" else "⏸️"
            report.append(f"  {status_icon} {m_data['title']}: {m_data['progress']:.0f}%")
        report.append("")
        
        # Next Tasks
        report.append("📋 NEXT TASKS TO WORK ON")
        report.append("-" * 40)
        for i, task in enumerate(next_tasks, 1):
            priority_icon = "🔴" if task.priority == "critical" else "🟡" if task.priority == "high" else "🟢"
            report.append(f"  {i}. {priority_icon} [{task.id}] {task.title}")
            report.append(f"     Priority: {task.priority} | Est: {task.estimated_hours}h")
        report.append("")
        
        # Blocked Tasks
        if blocked_tasks:
            report.append("🚫 BLOCKED TASKS")
            report.append("-" * 40)
            for item in blocked_tasks:
                task = item["task"]
                report.append(f"  • [{task.id}] {task.title}")
                report.append(f"    Blocked by: {', '.join(item['blocked_by'])}")
            report.append("")
        
        # Category Progress
        report.append("📁 PROGRESS BY CATEGORY")
        report.append("-" * 40)
        categories = {}
        for task in self.tasks.values():
            if task.category not in categories:
                categories[task.category] = {"total": 0, "completed": 0}
            categories[task.category]["total"] += 1
            if task.status == "completed":
                categories[task.category]["completed"] += 1
        
        for cat, data in sorted(categories.items()):
            progress = (data["completed"] / data["total"]) * 100 if data["total"] > 0 else 0
            bar = "█" * int(progress / 10) + "░" * (10 - int(progress / 10))
            report.append(f"  {cat}: [{bar}] {progress:.0f}% ({data['completed']}/{data['total']})")
        
        report.append("")
        report.append("=" * 60)
        
        return "\n".join(report)

def main():
    """Main function to run the project tracker."""
    import sys
    
    project_root = "/Users/lyon/Desktop/Lyon/TheResearcher/veritas"
    tracker = ProjectTracker(project_root)
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "report":
            print(tracker.generate_report())
        
        elif command == "progress":
            summary = tracker.get_progress_summary()
            print(f"Overall Progress: {summary['overall_progress']:.1f}%")
            print(f"Completed: {summary['completed_tasks']}/{summary['total_tasks']} tasks")
        
        elif command == "next":
            tasks = tracker.get_next_tasks()
            print("Next tasks to work on:")
            for i, task in enumerate(tasks, 1):
                print(f"  {i}. [{task.id}] {task.title} ({task.priority})")
        
        elif command == "blocked":
            blocked = tracker.get_blocked_tasks()
            if blocked:
                print("Blocked tasks:")
                for item in blocked:
                    print(f"  • [{item['task'].id}] {item['task'].title}")
                    print(f"    Blocked by: {', '.join(item['blocked_by'])}")
            else:
                print("No blocked tasks!")
        
        elif command == "complete":
            if len(sys.argv) > 2:
                task_id = sys.argv[2]
                tracker.update_task_status(task_id, "completed")
                print(f"Task {task_id} marked as completed!")
            else:
                print("Usage: python project_tracker.py complete <task_id>")
        
        elif command == "start":
            if len(sys.argv) > 2:
                task_id = sys.argv[2]
                tracker.update_task_status(task_id, "in_progress")
                print(f"Task {task_id} marked as in progress!")
            else:
                print("Usage: python project_tracker.py start <task_id>")
        
        else:
            print("Available commands:")
            print("  report    - Full progress report")
            print("  progress  - Quick progress summary")
            print("  next      - Next tasks to work on")
            print("  blocked   - Show blocked tasks")
            print("  complete  - Mark task as completed")
            print("  start     - Mark task as in progress")
    else:
        print(tracker.generate_report())

if __name__ == "__main__":
    main()
