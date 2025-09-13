from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime, timedelta
import structlog
from typing import Optional

from .redis import redis_manager
from .config import settings

logger = structlog.get_logger()

class TaskScheduler:
    def __init__(self):
        self.scheduler: Optional[AsyncIOScheduler] = None
        self.is_running = False

    async def start(self):
        """Start the task scheduler"""
        try:
            self.scheduler = AsyncIOScheduler(timezone='UTC')

            # Add periodic tasks
            await self._add_periodic_tasks()

            # Start the scheduler
            self.scheduler.start()
            self.is_running = True
            logger.info("Task scheduler started successfully")

        except Exception as e:
            logger.error("Failed to start task scheduler", error=str(e))
            raise

    async def stop(self):
        """Stop the task scheduler"""
        if self.scheduler and self.is_running:
            self.scheduler.shutdown(wait=True)
            self.is_running = False
            logger.info("Task scheduler stopped")

    async def _add_periodic_tasks(self):
        """Add all periodic background tasks"""

        # Clean up expired cache entries every hour
        self.scheduler.add_job(
            self._cleanup_expired_cache,
            trigger=IntervalTrigger(hours=1),
            id="cleanup_expired_cache",
            name="Clean up expired cache entries",
            replace_existing=True
        )

        # Update user activity statistics every 30 minutes
        self.scheduler.add_job(
            self._update_user_activity_stats,
            trigger=IntervalTrigger(minutes=30),
            id="update_user_activity_stats",
            name="Update user activity statistics",
            replace_existing=True
        )

        # Generate daily platform statistics at midnight
        self.scheduler.add_job(
            self._generate_daily_stats,
            trigger=CronTrigger(hour=0, minute=0),
            id="generate_daily_stats",
            name="Generate daily platform statistics",
            replace_existing=True
        )

        # Cleanup old notifications every 6 hours
        self.scheduler.add_job(
            self._cleanup_old_notifications,
            trigger=IntervalTrigger(hours=6),
            id="cleanup_old_notifications",
            name="Clean up old notifications",
            replace_existing=True
        )

        # Health check for Redis connection every 5 minutes
        self.scheduler.add_job(
            self._redis_health_check,
            trigger=IntervalTrigger(minutes=5),
            id="redis_health_check",
            name="Redis connection health check",
            replace_existing=True
        )

        logger.info("Periodic background tasks scheduled")

    async def _cleanup_expired_cache(self):
        """Clean up expired cache entries"""
        try:
            logger.debug("Starting cache cleanup task")

            # This is handled automatically by Redis TTL, but we can log stats
            if redis_manager.is_connected:
                # Get cache statistics
                cache_info = await redis_manager.redis_client.info('memory')
                used_memory = cache_info.get('used_memory_human', 'unknown')
                logger.info("Cache cleanup completed", used_memory=used_memory)

        except Exception as e:
            logger.error("Cache cleanup task failed", error=str(e))

    async def _update_user_activity_stats(self):
        """Update user activity statistics"""
        try:
            logger.debug("Starting user activity stats update")

            if not redis_manager.is_connected:
                logger.warning("Redis not connected, skipping user activity stats update")
                return

            # Example: Update active user counts
            current_time = datetime.utcnow()
            stats_key = f"stats:user_activity:{current_time.strftime('%Y%m%d%H%M')}"

            # This would typically aggregate data from various sources
            # For now, we'll just create a placeholder
            stats = {
                "timestamp": current_time.isoformat(),
                "active_users_last_hour": 0,
                "active_users_last_day": 0,
                "total_sessions": 0
            }

            await redis_manager.set_json(
                stats_key,
                stats,
                expire=timedelta(days=7)  # Keep for 7 days
            )

            logger.info("User activity stats updated", timestamp=current_time.isoformat())

        except Exception as e:
            logger.error("User activity stats update failed", error=str(e))

    async def _generate_daily_stats(self):
        """Generate daily platform statistics"""
        try:
            logger.debug("Starting daily stats generation")

            if not redis_manager.is_connected:
                logger.warning("Redis not connected, skipping daily stats generation")
                return

            current_date = datetime.utcnow().date()
            stats_key = f"stats:daily:{current_date.strftime('%Y%m%d')}"

            # Generate comprehensive daily statistics
            daily_stats = {
                "date": current_date.isoformat(),
                "new_users": 0,  # Would query database
                "new_posts": 0,  # Would query database
                "new_threads": 0,  # Would query database
                "active_locations": 0,  # Would query database
                "messages_sent": 0,  # Would query database
                "cache_hit_ratio": 0.0,  # Would calculate from Redis stats
                "generated_at": datetime.utcnow().isoformat()
            }

            await redis_manager.set_json(
                stats_key,
                daily_stats,
                expire=timedelta(days=30)  # Keep for 30 days
            )

            logger.info("Daily statistics generated", date=current_date.isoformat())

        except Exception as e:
            logger.error("Daily stats generation failed", error=str(e))

    async def _cleanup_old_notifications(self):
        """Clean up old notifications"""
        try:
            logger.debug("Starting notification cleanup")

            if not redis_manager.is_connected:
                logger.warning("Redis not connected, skipping notification cleanup")
                return

            # Clean up notifications older than 30 days
            cutoff_date = datetime.utcnow() - timedelta(days=30)

            # This would typically involve database operations
            # For now, we'll just log the action
            logger.info("Notification cleanup completed", cutoff_date=cutoff_date.isoformat())

        except Exception as e:
            logger.error("Notification cleanup failed", error=str(e))

    async def _redis_health_check(self):
        """Perform Redis health check"""
        try:
            if redis_manager.is_connected:
                # Test Redis with a simple operation
                test_key = "health_check"
                await redis_manager.set(test_key, "ok", expire=timedelta(seconds=60))
                result = await redis_manager.get(test_key)

                if result == "ok":
                    logger.debug("Redis health check passed")
                else:
                    logger.warning("Redis health check failed - unexpected result", result=result)
            else:
                logger.warning("Redis health check failed - not connected")
                # Attempt to reconnect
                try:
                    await redis_manager.connect()
                    logger.info("Redis reconnection successful")
                except Exception as reconnect_error:
                    logger.error("Redis reconnection failed", error=str(reconnect_error))

        except Exception as e:
            logger.error("Redis health check error", error=str(e))

    async def add_one_time_task(self, func, run_date: datetime, task_id: str, **kwargs):
        """Add a one-time task to be executed at a specific time"""
        if not self.scheduler:
            logger.error("Scheduler not initialized")
            return False

        try:
            self.scheduler.add_job(
                func,
                trigger='date',
                run_date=run_date,
                id=task_id,
                kwargs=kwargs,
                replace_existing=True
            )
            logger.info("One-time task scheduled", task_id=task_id, run_date=run_date.isoformat())
            return True

        except Exception as e:
            logger.error("Failed to schedule one-time task", task_id=task_id, error=str(e))
            return False

    async def remove_task(self, task_id: str):
        """Remove a scheduled task"""
        if not self.scheduler:
            logger.error("Scheduler not initialized")
            return False

        try:
            self.scheduler.remove_job(task_id)
            logger.info("Task removed", task_id=task_id)
            return True

        except Exception as e:
            logger.error("Failed to remove task", task_id=task_id, error=str(e))
            return False

    def get_task_info(self):
        """Get information about scheduled tasks"""
        if not self.scheduler:
            return {"error": "Scheduler not initialized"}

        jobs = self.scheduler.get_jobs()
        return {
            "scheduler_running": self.is_running,
            "total_jobs": len(jobs),
            "jobs": [
                {
                    "id": job.id,
                    "name": job.name,
                    "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
                    "trigger": str(job.trigger)
                }
                for job in jobs
            ]
        }

# Global task scheduler instance
task_scheduler = TaskScheduler()

# Notification and task queue helpers
class TaskQueue:
    def __init__(self, redis_manager):
        self.redis = redis_manager
        self.queue_prefix = "task_queue:"

    async def enqueue_task(self, queue_name: str, task_data: dict) -> bool:
        """Add task to queue"""
        queue_key = f"{self.queue_prefix}{queue_name}"

        task_item = {
            "id": task_data.get("id", str(datetime.utcnow().timestamp())),
            "type": task_data.get("type", "unknown"),
            "data": task_data.get("data", {}),
            "created_at": datetime.utcnow().isoformat(),
            "attempts": 0,
            "max_attempts": task_data.get("max_attempts", 3)
        }

        try:
            result = await self.redis.push_to_list(queue_key, str(task_item))
            if result:
                logger.info("Task enqueued", queue=queue_name, task_id=task_item["id"])
                return True
            return False

        except Exception as e:
            logger.error("Failed to enqueue task", queue=queue_name, error=str(e))
            return False

    async def dequeue_task(self, queue_name: str) -> Optional[dict]:
        """Get next task from queue"""
        queue_key = f"{self.queue_prefix}{queue_name}"

        try:
            task_str = await self.redis.pop_from_list(queue_key)
            if task_str:
                import ast
                task_data = ast.literal_eval(task_str)
                logger.debug("Task dequeued", queue=queue_name, task_id=task_data.get("id"))
                return task_data
            return None

        except Exception as e:
            logger.error("Failed to dequeue task", queue=queue_name, error=str(e))
            return None

    async def get_queue_length(self, queue_name: str) -> int:
        """Get number of tasks in queue"""
        queue_key = f"{self.queue_prefix}{queue_name}"
        try:
            length = await self.redis.get_list_length(queue_key)
            return length or 0
        except Exception as e:
            logger.error("Failed to get queue length", queue=queue_name, error=str(e))
            return 0

# Global task queue instance
task_queue = TaskQueue(redis_manager)