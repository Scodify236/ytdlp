from flask import Flask, request, jsonify
import yt_dlp

app = Flask(__name__)

@app.route('/get-audio', methods=['GET'])
def get_audio():
    video_url = request.args.get('url')
    if not video_url:
        return jsonify({"error": "URL is required"}), 400

    ydl_opts = {
        'format': 'bestaudio/best',
        'quiet': True,
        'extract_flat': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_url, download=False)
        audio_link = info['formats'][0]['url']
        return jsonify({"audio_link": audio_link})

if __name__ == "__main__":
    app.run()
