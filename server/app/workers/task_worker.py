import asyncio
import sys
import os
from pathlib import Path

# Add the project root to sys.path so we can import from app
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from app.core.redis import redis_manager
from app.core.scheduler import task_queue
from app.core.logging import configure_logging, get_logger
from app.core.config import settings
import structlog

# Configure logging for worker
configure_logging(log_level="INFO", json_logs=False)
logger = structlog.get_logger("task_worker")

class TaskWorker:
    def __init__(self):
        self.running = False
        self.queues = ["default", "notifications", "background_tasks"]

    async def start(self):
        """Start the task worker"""
        logger.info("Starting task worker")

        # Connect to Redis
        try:
            await redis_manager.connect()
            logger.info("Task worker connected to Redis")
        except Exception as e:
            logger.error("Failed to connect to Redis", error=str(e))
            return

        self.running = True
        logger.info("Task worker started, processing queues", queues=self.queues)

        # Main processing loop
        while self.running:
            try:
                await self._process_queues()
                await asyncio.sleep(1)  # Short delay between checks
            except KeyboardInterrupt:
                logger.info("Received shutdown signal")
                break
            except Exception as e:
                logger.error("Error in worker loop", error=str(e))
                await asyncio.sleep(5)  # Longer delay on error

    async def stop(self):
        """Stop the task worker"""
        logger.info("Stopping task worker")
        self.running = False
        await redis_manager.disconnect()
        logger.info("Task worker stopped")

    async def _process_queues(self):
        """Process tasks from all queues"""
        for queue_name in self.queues:
            try:
                task = await task_queue.dequeue_task(queue_name)
                if task:
                    await self._process_task(task, queue_name)
            except Exception as e:
                logger.error("Error processing queue", queue=queue_name, error=str(e))

    async def _process_task(self, task_data: dict, queue_name: str):
        """Process a single task"""
        task_id = task_data.get("id", "unknown")
        task_type = task_data.get("type", "unknown")

        logger.info("Processing task", task_id=task_id, task_type=task_type, queue=queue_name)

        try:
            # Increment attempt counter
            task_data["attempts"] = task_data.get("attempts", 0) + 1

            # Route task to appropriate handler
            if task_type == "send_notification":
                await self._handle_notification_task(task_data)
            elif task_type == "process_user_activity":
                await self._handle_user_activity_task(task_data)
            elif task_type == "cleanup_expired_data":
                await self._handle_cleanup_task(task_data)
            elif task_type == "generate_report":
                await self._handle_report_generation(task_data)
            else:
                logger.warning("Unknown task type", task_type=task_type)
                return

            logger.info("Task completed successfully", task_id=task_id, task_type=task_type)

        except Exception as e:
            logger.error("Task processing failed", task_id=task_id, error=str(e))

            # Check if we should retry
            max_attempts = task_data.get("max_attempts", 3)
            if task_data["attempts"] < max_attempts:
                # Re-queue the task for retry
                logger.info("Re-queuing task for retry", task_id=task_id, attempt=task_data["attempts"])
                await task_queue.enqueue_task(queue_name, task_data)
            else:
                logger.error("Task exceeded max attempts, discarding", task_id=task_id, max_attempts=max_attempts)

    async def _handle_notification_task(self, task_data: dict):
        """Handle notification sending tasks"""
        data = task_data.get("data", {})
        user_id = data.get("user_id")
        message = data.get("message")
        notification_type = data.get("type", "info")

        logger.info("Processing notification", user_id=user_id, type=notification_type)

        # Here you would implement actual notification sending
        # For now, we'll just simulate processing
        await asyncio.sleep(0.1)

        # Store notification in Redis for retrieval
        notification_key = f"notifications:{user_id}"
        notification = {
            "id": task_data.get("id"),
            "message": message,
            "type": notification_type,
            "created_at": task_data.get("created_at"),
            "read": False
        }

        # Add to user's notification list
        await redis_manager.push_to_list(notification_key, str(notification))
        logger.info("Notification stored", user_id=user_id)

    async def _handle_user_activity_task(self, task_data: dict):
        """Handle user activity processing tasks"""
        data = task_data.get("data", {})
        user_id = data.get("user_id")
        activity_type = data.get("activity_type")
        activity_data = data.get("activity_data", {})

        logger.info("Processing user activity", user_id=user_id, activity_type=activity_type)

        # Update user activity statistics in Redis
        activity_key = f"user_activity:{user_id}"
        current_stats = await redis_manager.get_json(activity_key) or {}

        # Update activity counters
        current_stats[activity_type] = current_stats.get(activity_type, 0) + 1
        current_stats["last_activity"] = task_data.get("created_at")

        await redis_manager.set_json(activity_key, current_stats, expire=2592000)  # 30 days
        logger.info("User activity updated", user_id=user_id)

    async def _handle_cleanup_task(self, task_data: dict):
        """Handle data cleanup tasks"""
        data = task_data.get("data", {})
        cleanup_type = data.get("cleanup_type")

        logger.info("Processing cleanup task", cleanup_type=cleanup_type)

        if cleanup_type == "expired_sessions":
            # This would be handled by Redis TTL, but we can log it
            logger.info("Expired session cleanup completed")
        elif cleanup_type == "old_logs":
            # Cleanup old log entries
            logger.info("Old log cleanup completed")
        else:
            logger.warning("Unknown cleanup type", cleanup_type=cleanup_type)

        # Simulate processing time
        await asyncio.sleep(0.5)

    async def _handle_report_generation(self, task_data: dict):
        """Handle report generation tasks"""
        data = task_data.get("data", {})
        report_type = data.get("report_type")
        user_id = data.get("user_id")

        logger.info("Generating report", report_type=report_type, user_id=user_id)

        # Simulate report generation
        await asyncio.sleep(2.0)

        # Store report result
        report_key = f"reports:{user_id}:{task_data.get('id')}"
        report_result = {
            "report_type": report_type,
            "generated_at": task_data.get("created_at"),
            "status": "completed",
            "data": {"sample": "report data"}
        }

        await redis_manager.set_json(report_key, report_result, expire=604800)  # 7 days
        logger.info("Report generated and stored", report_type=report_type, user_id=user_id)

async def main():
    """Main worker entry point"""
    worker = TaskWorker()

    try:
        await worker.start()
    except KeyboardInterrupt:
        logger.info("Received interrupt signal")
    finally:
        await worker.stop()

if __name__ == "__main__":
    asyncio.run(main())