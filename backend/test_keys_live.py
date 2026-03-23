import os
import sys
from dotenv import load_dotenv
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

def test_all_keys():
    load_dotenv()
    
    raw_keys = os.getenv("YOUTUBE_API_KEYS", "")
    keys = [k.strip() for k in raw_keys.split(",") if k.strip()]
    
    if not keys:
        single = os.getenv("YOUTUBE_API_KEY", "").strip()
        if single:
            keys = [single]
            
    if not keys:
        print("❌ No keys found in .env file. Please add YOUTUBE_API_KEYS=key1,key2,...")
        sys.exit(1)
        
    print(f"🔍 Found {len(keys)} keys in .env. Testing them now...\n")
    
    success_count = 0
    
    for i, key in enumerate(keys, 1):
        masked = "****" if len(key) <= 8 else f"{key[:4]}...{key[-4:]}"
        print(f"[{i}/{len(keys)}] Testing key {masked}...")
        
        try:
            youtube = build("youtube", "v3", developerKey=key)
            # Make a tiny, cheap request just to verify auth
            request = youtube.search().list(
                part="id",
                q="test",
                type="video",
                maxResults=1
            )
            request.execute()
            print(f"   ✅ SUCCESS! Key {masked} is valid and working.")
            success_count += 1
            
        except HttpError as e:
            status = e.resp.status
            if status in (403, 429):
                print(f"   ❌ RATE LIMITED / QUOTA EXCEEDED (HTTP {status}) for key {masked}.")
            elif status == 400:
                print(f"   ❌ INVALID KEY (HTTP {status}) for key {masked}. Check for typos!")
            else:
                print(f"   ❌ FAILED with HTTP {status} for key {masked}: {e}")
        except Exception as e:
            print(f"   ❌ ERROR testing key {masked}: {e}")
            
    print("\n--- Summary ---")
    print(f"✅ {success_count} / {len(keys)} keys are working perfectly.")
    
    if success_count == len(keys):
        print("🎉 All keys are good to go!")
    else:
        print("⚠️ Some keys failed. Please double check them in your .env file.")

if __name__ == "__main__":
    test_all_keys()
