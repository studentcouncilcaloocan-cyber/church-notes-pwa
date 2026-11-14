#!/usr/bin/env python3
"""Build a static video catalog using yt-dlp; fail safely if extraction is incomplete."""
import json,subprocess,sys,datetime,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
DEST=ROOT/'videos.json'
PLAYLISTS=[('Playlist 1','PLmJ3Bi1uP3W4s9lwVghZVLwWRSlTofKM-'),('Playlist 2','PLmZPI_PuH8feJeC89b7z0q2jrAjZnOl2w')]
old=json.loads(DEST.read_text()) if DEST.exists() else {'playlists':[]}
existing={p['id']:p for p in old.get('playlists',[])}
results=[];errors=[]
for label,pid in PLAYLISTS:
    cmd=[sys.executable,'-m','yt_dlp','--flat-playlist','--dump-single-json','--no-warnings','--ignore-errors','https://www.youtube.com/playlist?list='+pid]
    try:
        p=subprocess.run(cmd,capture_output=True,text=True,timeout=240)
        if p.returncode or not p.stdout.strip():raise RuntimeError((p.stderr or 'No response')[-600:])
        data=json.loads(p.stdout)
        raw=data.get('entries') or []
        videos=[]
        for entry in raw:
            if not isinstance(entry,dict):continue
            vid=entry.get('id') or ''
            title=entry.get('title') or ''
            if not isinstance(vid,str) or not isinstance(title,str) or len(vid)!=11 or not title.strip():continue
            videos.append({'id':vid,'title':title.strip(),'thumbnail':f'https://i.ytimg.com/vi/{vid}/hqdefault.jpg'})
        if not videos:raise RuntimeError('No complete video entries extracted')
        # Never replace an existing nonempty catalog with a smaller one: extraction may be partial.
        previous=existing.get(pid,{}).get('videos',[])
        if previous and len(videos)<len(previous):raise RuntimeError(f'Partial extraction: {len(videos)} vs {len(previous)} previously')
        results.append({'id':pid,'label':label,'videos':videos})
        print(f'{label}: {len(videos)} videos')
    except Exception as e:
        errors.append(f'{label}: {e}')
        results.append(existing.get(pid,{'id':pid,'label':label,'videos':[]}))
if errors:
    for error in errors:print('WARNING:',error,file=sys.stderr)
    # Preserve previous catalog and fail workflow to avoid silently publishing incomplete results.
    sys.exit(1)
output={'generated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'playlists':results}
DEST.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
print('Updated',DEST)
