#!/usr/bin/env python3
"""
CoreValidate Project Monitor Agent
Continuous monitoring and automated tracking of project progress.
"""

import os
import json
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Set
from dataclasses import dataclass, asdict
import hashlib

@dataclass
class FileChange:
    path: str
    timestamp: str
    change_type: str  # created, modified, deleted
    size: int
    hash: str

@dataclass
class ProgressSnapshot:
    timestamp: str
    total_files: int
    total_lines: int
    api_routes: int
    components: int
    tests: int
    completion_estimate: float

class ProjectMonitor:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.monitor_file = self.project_root / ".project_tracker" / "monitor.json"
        self.changes_file = self.project_root / ".project_tracker" / "changes.json"
        self.monitor_file.parent.mkdir(parents=True, exist_ok=True)
        
        # File patterns to track
        self.api_pattern = "src/app/api/**/route.ts"
        self.component_pattern = "src/components/**/*.tsx"
        self.page_pattern = "src/app/**/page.tsx"
        self.test_pattern = "**/*.test.ts"
        
        self.load_state()
    
    def load_state(self):
        """Load monitoring state."""
        if self.changes_file.exists():
            with open(self.changes_file, 'r') as f:
                data = json.load(f)
                self.changes = [FileChange(**c) for c in data.get('changes', [])]
                self.snapshots = [ProgressSnapshot(**s) for s in data.get('snapshots', [])]
        else:
            self.changes = []
            self.snapshots = []
    
    def save_state(self):
        """Save monitoring state."""
        data = {
            'changes': [asdict(c) for c in self.changes[-1000:]],  # Keep last 1000
            'snapshots': [asdict(s) for s in self.snapshots[-100:]],  # Keep last 100
            'last_updated': datetime.now().isoformat()
        }
        with open(self.changes_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def get_file_hash(self, filepath: Path) -> str:
        """Calculate file hash."""
        try:
            with open(filepath, 'rb') as f:
                return hashlib.md5(f.read()).hexdigest()
        except:
            return ""
    
    def scan_project(self) -> Dict:
        """Scan project and collect metrics."""
        metrics = {
            'total_files': 0,
            'total_lines': 0,
            'api_routes': 0,
            'components': 0,
            'pages': 0,
            'tests': 0,
            'typescript_files': 0,
            'javascript_files': 0,
            'css_files': 0,
            'md_files': 0,
            'files_by_type': {},
            'largest_files': [],
            'recent_changes': []
        }
        
        file_sizes = []
        
        for filepath in self.project_root.rglob("*"):
            if filepath.is_file() and not any(p.startswith('.') for p in filepath.parts):
                metrics['total_files'] += 1
                
                # Count lines for text files
                if filepath.suffix in ['.ts', '.tsx', '.js', '.jsx', '.css', '.md']:
                    try:
                        with open(filepath, 'r', encoding='utf-8') as f:
                            lines = len(f.readlines())
                            metrics['total_lines'] += lines
                            file_sizes.append((str(filepath.relative_to(self.project_root)), lines))
                    except:
                        pass
                
                # Count by type
                ext = filepath.suffix
                metrics['files_by_type'][ext] = metrics['files_by_type'].get(ext, 0) + 1
                
                # Count specific patterns
                rel_path = str(filepath.relative_to(self.project_root))
                if 'api' in rel_path and 'route.ts' in rel_path:
                    metrics['api_routes'] += 1
                if 'components' in rel_path and filepath.suffix == '.tsx':
                    metrics['components'] += 1
                if 'page.tsx' in rel_path:
                    metrics['pages'] += 1
                if filepath.suffix == '.test.ts':
                    metrics['tests'] += 1
                if filepath.suffix in ['.ts', '.tsx']:
                    metrics['typescript_files'] += 1
                elif filepath.suffix in ['.js', '.jsx']:
                    metrics['javascript_files'] += 1
                elif filepath.suffix == '.css':
                    metrics['css_files'] += 1
                elif filepath.suffix == '.md':
                    metrics['md_files'] += 1
        
        # Get largest files
        file_sizes.sort(key=lambda x: x[1], reverse=True)
        metrics['largest_files'] = file_sizes[:10]
        
        return metrics
    
    def calculate_completion(self, metrics: Dict) -> float:
        """Calculate project completion percentage."""
        # Define completion criteria
        criteria = {
            'api_routes': {'target': 10, 'weight': 30},
            'components': {'target': 10, 'weight': 20},
            'pages': {'target': 5, 'weight': 20},
            'tests': {'target': 20, 'weight': 15},
            'typescript_files': {'target': 30, 'weight': 15}
        }
        
        total_weight = sum(c['weight'] for c in criteria.values())
        weighted_score = 0
        
        for key, config in criteria.items():
            actual = metrics.get(key, 0)
            target = config['target']
            weight = config['weight']
            
            # Cap at 100%
            score = min(actual / target, 1.0) if target > 0 else 0
            weighted_score += score * weight
        
        return (weighted_score / total_weight) * 100
    
    def take_snapshot(self) -> ProgressSnapshot:
        """Take a progress snapshot."""
        metrics = self.scan_project()
        completion = self.calculate_completion(metrics)
        
        snapshot = ProgressSnapshot(
            timestamp=datetime.now().isoformat(),
            total_files=metrics['total_files'],
            total_lines=metrics['total_lines'],
            api_routes=metrics['api_routes'],
            components=metrics['components'],
            tests=metrics['tests'],
            completion_estimate=completion
        )
        
        self.snapshots.append(snapshot)
        self.save_state()
        
        return snapshot
    
    def detect_changes(self) -> List[FileChange]:
        """Detect recent file changes."""
        changes = []
        now = datetime.now()
        
        for filepath in self.project_root.rglob("*"):
            if filepath.is_file() and not any(p.startswith('.') for p in filepath.parts):
                try:
                    stat = filepath.stat()
                    modified = datetime.fromtimestamp(stat.st_mtime)
                    
                    # Check if modified in last hour
                    if (now - modified).total_seconds() < 3600:
                        change = FileChange(
                            path=str(filepath.relative_to(self.project_root)),
                            timestamp=modified.isoformat(),
                            change_type='modified',
                            size=stat.st_size,
                            hash=self.get_file_hash(filepath)
                        )
                        changes.append(change)
                except:
                    pass
        
        return changes
    
    def generate_status_report(self) -> str:
        """Generate comprehensive status report."""
        metrics = self.scan_project()
        completion = self.calculate_completion(metrics)
        changes = self.detect_changes()
        
        # Get trends if we have previous snapshots
        trend = ""
        if len(self.snapshots) >= 2:
            prev = self.snapshots[-2]
            curr_completion = completion
            prev_completion = prev.completion_estimate
            diff = curr_completion - prev_completion
            trend = f" (↑{diff:.1f}%)" if diff > 0 else f" (↓{abs(diff):.1f}%)" if diff < 0 else " (→)"
        
        report = []
        report.append("=" * 60)
        report.append("VERITAS PROJECT MONITOR - STATUS REPORT")
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("=" * 60)
        report.append("")
        
        # Overall Completion
        report.append("📊 PROJECT COMPLETION")
        report.append("-" * 40)
        progress_bar = "█" * int(completion / 5) + "░" * (20 - int(completion / 5))
        report.append(f"  [{progress_bar}] {completion:.1f}%{trend}")
        report.append("")
        
        # File Statistics
        report.append("📁 FILE STATISTICS")
        report.append("-" * 40)
        report.append(f"  Total Files:      {metrics['total_files']}")
        report.append(f"  Total Lines:      {metrics['total_lines']:,}")
        report.append(f"  TypeScript:       {metrics['typescript_files']}")
        report.append(f"  JavaScript:       {metrics['javascript_files']}")
        report.append(f"  CSS:              {metrics['css_files']}")
        report.append(f"  Markdown:         {metrics['md_files']}")
        report.append("")
        
        # Component Counts
        report.append("🧩 COMPONENTS")
        report.append("-" * 40)
        report.append(f"  API Routes:       {metrics['api_routes']}")
        report.append(f"  UI Components:    {metrics['components']}")
        report.append(f"  Pages:            {metrics['pages']}")
        report.append(f"  Tests:            {metrics['tests']}")
        report.append("")
        
        # Recent Activity
        report.append("📝 RECENT ACTIVITY (Last Hour)")
        report.append("-" * 40)
        if changes:
            for change in changes[:10]:
                report.append(f"  • {change.path}")
                report.append(f"    Modified: {change.timestamp[:19]}")
        else:
            report.append("  No recent changes detected")
        report.append("")
        
        # Largest Files
        report.append("📊 LARGEST FILES")
        report.append("-" * 40)
        for filepath, lines in metrics['largest_files'][:5]:
            report.append(f"  {lines:6d} lines | {filepath}")
        report.append("")
        
        # Progress Trend
        if len(self.snapshots) >= 2:
            report.append("📈 PROGRESS TREND")
            report.append("-" * 40)
            for snapshot in self.snapshots[-5:]:
                bar = "█" * int(snapshot.completion_estimate / 5) + "░" * (20 - int(snapshot.completion_estimate / 5))
                report.append(f"  {snapshot.timestamp[:16]} [{bar}] {snapshot.completion_estimate:.1f}%")
            report.append("")
        
        # Recommendations
        report.append("💡 RECOMMENDATIONS")
        report.append("-" * 40)
        
        if metrics['tests'] == 0:
            report.append("  ⚠️  No tests found - consider adding unit tests")
        if metrics['api_routes'] < 5:
            report.append("  ⚠️  Few API routes - ensure core functionality is covered")
        if metrics['components'] < 5:
            report.append("  ⚠️  Few components - consider building reusable UI components")
        if completion < 50:
            report.append("  📌 Focus on core features first (API routes, main pages)")
        elif completion < 80:
            report.append("  📌 Good progress! Focus on integration and testing")
        else:
            report.append("  📌 Nearly there! Focus on polish and deployment")
        
        report.append("")
        report.append("=" * 60)
        
        return "\n".join(report)
    
    def run_continuous_monitoring(self, interval_minutes: int = 5):
        """Run continuous monitoring."""
        print(f"Starting continuous monitoring (interval: {interval_minutes} minutes)")
        print("Press Ctrl+C to stop")
        print()
        
        try:
            while True:
                # Take snapshot
                snapshot = self.take_snapshot()
                
                # Detect changes
                changes = self.detect_changes()
                
                # Print status
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Completion: {snapshot.completion_estimate:.1f}% | "
                      f"Files: {snapshot.total_files} | "
                      f"Lines: {snapshot.total_lines:,} | "
                      f"Changes: {len(changes)}")
                
                # Wait
                time.sleep(interval_minutes * 60)
                
        except KeyboardInterrupt:
            print("\nMonitoring stopped.")

def main():
    """Main function."""
    import sys
    
    project_root = "/Users/lyon/Desktop/Lyon/TheResearcher/veritas"
    monitor = ProjectMonitor(project_root)
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "status":
            print(monitor.generate_status_report())
        
        elif command == "snapshot":
            snapshot = monitor.take_snapshot()
            print(f"Snapshot taken at {snapshot.timestamp}")
            print(f"Completion: {snapshot.completion_estimate:.1f}%")
            print(f"Files: {snapshot.total_files}")
            print(f"Lines: {snapshot.total_lines:,}")
        
        elif command == "changes":
            changes = monitor.detect_changes()
            if changes:
                print(f"Found {len(changes)} recent changes:")
                for change in changes:
                    print(f"  • {change.path}")
            else:
                print("No recent changes detected")
        
        elif command == "metrics":
            metrics = monitor.scan_project()
            print(json.dumps(metrics, indent=2))
        
        elif command == "watch":
            interval = int(sys.argv[2]) if len(sys.argv) > 2 else 5
            monitor.run_continuous_monitoring(interval)
        
        else:
            print("Available commands:")
            print("  status    - Full status report")
            print("  snapshot  - Take progress snapshot")
            print("  changes   - Detect recent changes")
            print("  metrics   - Raw project metrics")
            print("  watch     - Continuous monitoring")
    else:
        print(monitor.generate_status_report())

if __name__ == "__main__":
    main()
