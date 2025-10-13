"""
Quota rotation and tracking for YouTube API projects.
"""
from typing import Optional, Dict, Any
from uuid import UUID
import models


UPLOAD_COST = 1600  # YouTube API quota cost for video upload


async def pick_project_for_upload() -> Optional[Dict[str, Any]]:
    """
    Select an API project that has enough quota remaining.
    Returns project data or None if all projects are exhausted.
    """
    projects = await models.list_api_projects()
    
    for project in projects:
        remaining = project['daily_quota'] - project['quota_used_today']
        if remaining >= UPLOAD_COST:
            return project
    
    return None


async def track_quota_usage(project_id: UUID, cost: int = UPLOAD_COST) -> None:
    """
    Track quota usage for a project.
    """
    await models.update_quota_usage(project_id, cost)


async def get_quota_status() -> Dict[str, Any]:
    """
    Get overall quota status across all projects.
    """
    projects = await models.list_api_projects()
    
    total_quota = 0
    total_used = 0
    total_remaining = 0
    projects_available = 0
    
    for project in projects:
        total_quota += project['daily_quota']
        total_used += project['quota_used_today']
        remaining = project['daily_quota'] - project['quota_used_today']
        total_remaining += remaining
        
        if remaining >= UPLOAD_COST:
            projects_available += 1
    
    return {
        'total_quota': total_quota,
        'total_used': total_used,
        'total_remaining': total_remaining,
        'projects_available': projects_available,
        'uploads_remaining': total_remaining // UPLOAD_COST,
        'projects': projects
    }


async def reset_all_quotas() -> None:
    """
    Reset daily quotas for all projects.
    Should be called by cron at midnight UTC.
    """
    await models.reset_daily_quotas()

