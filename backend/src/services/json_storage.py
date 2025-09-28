"""
JSON Storage Service for persisting analysis and trading data
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)

class JSONStorage:
    """Simple JSON file storage for analysis and trading data"""

    def __init__(self, storage_dir: str = "data"):
        self.storage_dir = storage_dir
        self.analysis_file = os.path.join(storage_dir, "analysis_results.json")
        self.trading_file = os.path.join(storage_dir, "trading_decisions.json")

        # Create storage directory if it doesn't exist
        os.makedirs(storage_dir, exist_ok=True)

        # Initialize files if they don't exist
        self._init_storage_files()

    def _init_storage_files(self):
        """Initialize storage files with empty structures"""
        if not os.path.exists(self.analysis_file):
            self._write_json(self.analysis_file, {"analysis_results": []})

        if not os.path.exists(self.trading_file):
            self._write_json(self.trading_file, {"trading_decisions": []})

    def _read_json(self, file_path: str) -> Dict[str, Any]:
        """Read JSON data from file"""
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            logger.error(f"Error reading {file_path}: {e}")
            return {}

    def _write_json(self, file_path: str, data: Dict[str, Any]):
        """Write JSON data to file"""
        try:
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Error writing {file_path}: {e}")

    def save_analysis_result(self, analysis_data: Dict[str, Any]) -> bool:
        """Save analysis result to JSON file"""
        try:
            # Read existing data
            storage_data = self._read_json(self.analysis_file)
            if "analysis_results" not in storage_data:
                storage_data["analysis_results"] = []

            # Generate unique ID with microseconds to avoid duplicates
            import time
            unique_id = f"analysis_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{int(time.time() * 1000000) % 1000000}"

            # Add timestamp and ID
            analysis_entry = {
                "id": unique_id,
                "timestamp": datetime.utcnow().isoformat(),
                "saved_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
                **analysis_data
            }

            # Add to list (keep last 50 entries)
            storage_data["analysis_results"].append(analysis_entry)
            storage_data["analysis_results"] = storage_data["analysis_results"][-50:]

            # Write back to file
            self._write_json(self.analysis_file, storage_data)
            logger.info(f"Saved analysis result: {analysis_entry['id']}")
            return True

        except Exception as e:
            logger.error(f"Error saving analysis result: {e}")
            return False

    def save_trading_decision(self, trading_data: Dict[str, Any]) -> bool:
        """Save trading decision to JSON file"""
        try:
            # Read existing data
            storage_data = self._read_json(self.trading_file)
            if "trading_decisions" not in storage_data:
                storage_data["trading_decisions"] = []

            # Generate unique ID with microseconds to avoid duplicates
            import time
            unique_id = f"decision_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{int(time.time() * 1000000) % 1000000}"

            # Add timestamp and ID
            trading_entry = {
                "id": unique_id,
                "timestamp": datetime.utcnow().isoformat(),
                "saved_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
                **trading_data
            }

            # Add to list (keep last 50 entries)
            storage_data["trading_decisions"].append(trading_entry)
            storage_data["trading_decisions"] = storage_data["trading_decisions"][-50:]

            # Write back to file
            self._write_json(self.trading_file, storage_data)
            logger.info(f"Saved trading decision: {trading_entry['id']}")
            return True

        except Exception as e:
            logger.error(f"Error saving trading decision: {e}")
            return False

    def get_analysis_results(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get recent analysis results"""
        try:
            storage_data = self._read_json(self.analysis_file)
            results = storage_data.get("analysis_results", [])

            # Return most recent first
            return sorted(results, key=lambda x: x.get("timestamp", ""), reverse=True)[:limit]

        except Exception as e:
            logger.error(f"Error getting analysis results: {e}")
            return []

    def get_trading_decisions(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get recent trading decisions"""
        try:
            storage_data = self._read_json(self.trading_file)
            decisions = storage_data.get("trading_decisions", [])

            # Return most recent first
            return sorted(decisions, key=lambda x: x.get("timestamp", ""), reverse=True)[:limit]

        except Exception as e:
            logger.error(f"Error getting trading decisions: {e}")
            return []

    def get_analysis_by_id(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        """Get specific analysis result by ID"""
        try:
            storage_data = self._read_json(self.analysis_file)
            results = storage_data.get("analysis_results", [])

            for result in results:
                if result.get("id") == analysis_id:
                    return result

            return None

        except Exception as e:
            logger.error(f"Error getting analysis by ID {analysis_id}: {e}")
            return None

    def get_stats(self) -> Dict[str, Any]:
        """Get storage statistics"""
        try:
            analysis_data = self._read_json(self.analysis_file)
            trading_data = self._read_json(self.trading_file)

            return {
                "total_analysis_results": len(analysis_data.get("analysis_results", [])),
                "total_trading_decisions": len(trading_data.get("trading_decisions", [])),
                "storage_directory": self.storage_dir,
                "last_updated": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Error getting stats: {e}")
            return {}

# Create global storage instance
json_storage = JSONStorage()