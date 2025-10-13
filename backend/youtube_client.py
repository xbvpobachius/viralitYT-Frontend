"""
YouTube Data API v3 client wrapper.
SOLO busca y procesa Shorts (videos de 1-60 segundos).
"""
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError


def search_channels(youtube, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """Search for channels by query."""
    try:
        search_response = youtube.search().list(
            q=query,
            type='channel',
            part='id,snippet',
            maxResults=max_results,
            order='relevance'
        ).execute()
        
        channels = []
        for item in search_response.get('items', []):
            channels.append({
                'channel_id': item['id']['channelId'],
                'title': item['snippet']['title'],
                'description': item['snippet'].get('description', ''),
                'thumbnail_url': item['snippet']['thumbnails'].get('default', {}).get('url')
            })
        
        return channels
    except HttpError as e:
        print(f"Error searching channels: {e}")
        return []


def get_channel_videos(
    youtube,
    channel_id: str,
    published_after: Optional[datetime] = None,
    max_results: int = 50
) -> List[Dict[str, Any]]:
    """Get recent videos from a channel, filtered for Shorts ONLY (≤60 seconds)."""
    try:
        # Default to last 30 days
        if published_after is None:
            published_after = datetime.utcnow() - timedelta(days=30)
        
        published_after_str = published_after.isoformat() + 'Z'
        
        # Search for videos from this channel
        search_response = youtube.search().list(
            channelId=channel_id,
            type='video',
            part='id',
            maxResults=max_results,
            publishedAfter=published_after_str,
            order='viewCount',
            videoDuration='short'  # Only fetch videos < 4 minutes (Shorts filter)
        ).execute()
        
        video_ids = [item['id']['videoId'] for item in search_response.get('items', [])]
        
        if not video_ids:
            return []
        
        # Get video details
        videos_response = youtube.videos().list(
            id=','.join(video_ids),
            part='snippet,contentDetails,statistics'
        ).execute()
        
        videos = []
        for item in videos_response.get('items', []):
            duration = item['contentDetails']['duration']
            duration_seconds = parse_duration(duration)
            
            # STRICT FILTER: Only Shorts (≤ 60 seconds)
            # This is the official Shorts duration limit
            if duration_seconds > 0 and duration_seconds <= 60:
                videos.append({
                    'video_id': item['id'],
                    'title': item['snippet']['title'],
                    'channel_title': item['snippet']['channelTitle'],
                    'thumbnail_url': item['snippet']['thumbnails'].get('high', {}).get('url'),
                    'views': int(item['statistics'].get('viewCount', 0)),
                    'duration_seconds': duration_seconds
                })
        
        return videos
    except HttpError as e:
        print(f"Error getting channel videos: {e}")
        return []


def parse_duration(duration_str: str) -> int:
    """Parse ISO 8601 duration to seconds (e.g., 'PT45S' -> 45)."""
    import re
    
    pattern = r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
    match = re.match(pattern, duration_str)
    
    if not match:
        return 0
    
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    
    return hours * 3600 + minutes * 60 + seconds


def upload_video(
    youtube,
    file_path: str,
    title: str,
    description: str,
    tags: List[str],
    category_id: str = "22",  # People & Blogs
    privacy_status: str = "unlisted"
) -> Dict[str, Any]:
    """
    Upload a video to YouTube.
    Returns video metadata including video_id.
    
    Quota cost: ~1600 units
    """
    body = {
        'snippet': {
            'title': title,
            'description': description,
            'tags': tags,
            'categoryId': category_id
        },
        'status': {
            'privacyStatus': privacy_status,
            'selfDeclaredMadeForKids': False
        }
    }
    
    media = MediaFileUpload(
        file_path,
        mimetype='video/mp4',
        resumable=True,
        chunksize=1024*1024  # 1MB chunks
    )
    
    request = youtube.videos().insert(
        part=','.join(body.keys()),
        body=body,
        media_body=media
    )
    
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"Upload progress: {int(status.progress() * 100)}%")
    
    return {
        'video_id': response['id'],
        'title': response['snippet']['title'],
        'url': f"https://www.youtube.com/watch?v={response['id']}"
    }

