import hashlib
import json
import os
from datetime import datetime, timedelta
from pathlib import Path

class SimpleCache:
    """
    Simple file-based cache to reduce API calls to Gemini
    Caches responses for 24 hours
    """
    def __init__(self, cache_dir='.cache'):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        self.ttl_hours = 24  # Cache for 24 hours

    def _get_cache_key(self, data):
        """Generate cache key from input data"""
        # Convert data to stable JSON string
        json_str = json.dumps(data, sort_keys=True)
        # Create hash
        return hashlib.md5(json_str.encode()).hexdigest()

    def _get_cache_path(self, cache_key):
        """Get file path for cache key"""
        return self.cache_dir / f"{cache_key}.json"

    def get(self, data):
        """
        Get cached response if available and not expired
        Returns None if cache miss or expired
        """
        cache_key = self._get_cache_key(data)
        cache_path = self._get_cache_path(cache_key)

        if not cache_path.exists():
            return None

        try:
            with open(cache_path, 'r') as f:
                cached = json.load(f)

            # Check if expired
            cached_time = datetime.fromisoformat(cached['timestamp'])
            if datetime.now() - cached_time > timedelta(hours=self.ttl_hours):
                # Expired, delete cache file
                cache_path.unlink()
                return None

            print(f"✅ Cache hit for key: {cache_key[:8]}...")
            return cached['response']
        except Exception as e:
            print(f"⚠️ Cache read error: {e}")
            return None

    def set(self, data, response):
        """
        Store response in cache
        """
        cache_key = self._get_cache_key(data)
        cache_path = self._get_cache_path(cache_key)

        try:
            with open(cache_path, 'w') as f:
                json.dump({
                    'timestamp': datetime.now().isoformat(),
                    'input': data,
                    'response': response
                }, f, indent=2)
            print(f"💾 Cached response for key: {cache_key[:8]}...")
        except Exception as e:
            print(f"⚠️ Cache write error: {e}")

    def clear_expired(self):
        """Clear all expired cache entries"""
        count = 0
        for cache_file in self.cache_dir.glob('*.json'):
            try:
                with open(cache_file, 'r') as f:
                    cached = json.load(f)
                cached_time = datetime.fromisoformat(cached['timestamp'])
                if datetime.now() - cached_time > timedelta(hours=self.ttl_hours):
                    cache_file.unlink()
                    count += 1
            except:
                pass
        if count > 0:
            print(f"🧹 Cleared {count} expired cache entries")
