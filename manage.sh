#!/bin/bash
# CoreValidate Project Management Script

PROJECT_DIR="/Users/lyon/Desktop/Lyon/TheResearcher/veritas"
cd "$PROJECT_DIR" || exit 1

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_help() {
    echo -e "${BLUE}CoreValidate Project Manager${NC}"
    echo ""
    echo "Usage: ./manage.sh [command]"
    echo ""
    echo "Commands:"
    echo "  status      - Show project status"
    echo "  progress    - Show task progress"
    echo "  next        - Show next tasks"
    echo "  blocked     - Show blocked tasks"
    echo "  complete ID - Mark task as completed"
    echo "  start ID    - Mark task as in progress"
    echo "  snapshot    - Take progress snapshot"
    echo "  changes     - Show recent changes"
    echo "  build       - Build the project"
    echo "  dev         - Start development server"
    echo "  help        - Show this help"
}

case "$1" in
    status)
        echo -e "${BLUE}📊 Project Status${NC}"
        python3 project_monitor.py status
        ;;
    progress)
        echo -e "${GREEN}📈 Task Progress${NC}"
        python3 project_tracker.py progress
        ;;
    next)
        echo -e "${YELLOW}📋 Next Tasks${NC}"
        python3 project_tracker.py next
        ;;
    blocked)
        echo -e "${RED}🚫 Blocked Tasks${NC}"
        python3 project_tracker.py blocked
        ;;
    complete)
        if [ -z "$2" ]; then
            echo -e "${RED}Usage: ./manage.sh complete <task_id>${NC}"
        else
            python3 project_tracker.py complete "$2"
        fi
        ;;
    start)
        if [ -z "$2" ]; then
            echo -e "${RED}Usage: ./manage.sh start <task_id>${NC}"
        else
            python3 project_tracker.py start "$2"
        fi
        ;;
    snapshot)
        echo -e "${BLUE}📸 Taking Snapshot${NC}"
        python3 project_monitor.py snapshot
        ;;
    changes)
        echo -e "${YELLOW}📝 Recent Changes${NC}"
        python3 project_monitor.py changes
        ;;
    build)
        echo -e "${BLUE}🔨 Building Project${NC}"
        npm run build
        ;;
    dev)
        echo -e "${GREEN}🚀 Starting Dev Server${NC}"
        npm run dev
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac
