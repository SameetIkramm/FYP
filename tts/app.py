import io
from flask import Flask, Response, request, send_file
from scipy.io.wavfile import write
from scipy.io import wavfile
import noisereduce as nr
from pydub import AudioSegment
from inference import synthesize
from werkzeug.utils import secure_filename
import os
import requests
from decouple import config
# from extendduration import extendVideoDuration
import subprocess

videoserver = config('VIDEO_SERVER',cast=str)


app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = os.path.join(
    app.instance_path, 
    'uploads'
)
try: 
    os.makedirs(app.config['UPLOAD_FOLDER'])
except: 
    pass 

def noise_reduction(input_file, output_file):
    rate, data = wavfile.read(input_file)
    reduced_noise = nr.reduce_noise(y=data, sr=rate,prop_decrease=0.9)
    wavfile.write(output_file, rate, reduced_noise)

def match_target_amplitude(sound, target_dBFS):
    change_in_dBFS = target_dBFS - sound.dBFS
    return sound.apply_gain(change_in_dBFS)

@app.route('/generateaudio', methods=["POST","GET"])
def generate_audio():
    text = request.args.get('text')
    speaker = request.args.get('speaker')
    email = request.args.get('email')
    voicename = request.args.get('voicename')

    audio = None
    if text == None:
        return "No text provided"
    if email and voicename and speaker==None:
        dest = os.path.join(
            app.config['UPLOAD_FOLDER'],
            email 
        )

        dest = os.path.join(dest,voicename+'.wav')

        if os.path.exists(dest) == False:
            return "voice not found"
            
        audio = synthesize(text,wavfilee=dest)
    elif speaker and email==None and voicename==None:
        audio = synthesize(text,speaker)
    elif speaker and email and voicename:
        return "Both speaker and embeddings provided"
    else:
        return "No audio file or speaker provided"

  
    out = io.BytesIO()
    write(out, 16000, audio)
    response = send_file(out, mimetype='audio/wav')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/addVoice', methods=["POST"])
def add_voice():
    file = request.files.get('audio_file')
    email = request.args.get('email')
    voicename = request.args.get('voicename')
    
    if email == None: 
        return "No email provided"
    if voicename == None:
        return "No voice name provided"

    if file.filename != '': 
        dest = os.path.join(
            app.config['UPLOAD_FOLDER'], 
            email
        )
        
        if os.path.exists(dest) == False:
            os.mkdir(dest)

        extension = file.filename.split('.')[-1]

        dest = os.path.join(dest,voicename+'.'+extension)

        file.save(dest)

        if extension == 'weba':
            sound = AudioSegment.from_file(dest, format="webm")
            sound = sound.set_frame_rate(16000)
            os.remove(dest)
            dest = dest.replace('weba', 'wav')
            sound.export(dest, format="wav", bitrate="768k", codec="pcm_s16le")
        elif extension == 'wav':
            sound = AudioSegment.from_wav(dest)
            sound = sound.set_frame_rate(16000)
            sound.export(dest, format="wav", bitrate="768k", codec="pcm_s16le")

        noise_reduction(dest, dest)
        sound = AudioSegment.from_wav(dest)
        normalized_sound = match_target_amplitude(sound, -20.0)
        normalized_sound.export(dest, format="wav")
        return "Voice added"
    else:
        return "No audio file provided"

@app.route('/generateVideo', methods=["POST"])
def generate_video():

    videofile = request.files.get('video_file')

    text = request.args.get('text')

    speaker = request.args.get('speaker')

    email = request.args.get('email')
    
    voicename = request.args.get('voicename')

    if email == None:
        return "No email provided"

    if videofile and videofile.filename != '':
        dest = os.path.join(
            app.config['UPLOAD_FOLDER'], 
            email
        )

        if os.path.exists(dest) == False:
            os.mkdir(dest)

        dest = os.path.join(dest,videofile.filename)
        print(dest)

        videofile.save(dest)

        # dest2 = './instance/uploads/'+email+'/'+videofile.filename

        if videofile.filename.split('.')[-1] == 'webm':
            #convert to mp4
            command = "ffmpeg -i "+dest+" -f mp4 -b:v 6M -r 30 -vcodec libx264 -preset veryslow -strict experimental "+dest.replace('webm','mp4')
            result = subprocess.run(command, shell=True,check=True,stderr=subprocess.PIPE)
            if result.returncode != 0:
                print(result.stderr.decode('utf-8'))
                raise Exception("Error converting file")
            os.remove(dest)
            dest = dest.replace('webm','mp4')
    else:
        return "No video file provided"
    
    if text == None:
        return "No text provided"
    
    audio = None
    
    if voicename and speaker==None:

        dest2 = os.path.join(
            app.config['UPLOAD_FOLDER'],
            email
        )

        dest2 = os.path.join(dest2,voicename+'.wav')

        if os.path.exists(dest2) == False:
            return "Please first add the voice"
            
        audio = synthesize(text,wavfilee=dest2)

    elif speaker and voicename==None:

        audio = synthesize(text,speaker)

    elif speaker and voicename:
        return "Both speaker and embeddings provided"
    else:
        return "No embeddings or speaker provided"
        
    out = io.BytesIO()
    write(out, 16000, audio)
    out.name = 'input_audio.wav'

    dest2 = os.path.join(
        app.config['UPLOAD_FOLDER'],
        email
    )
    dest2 = os.path.join(dest2,'input_audio.wav')

    sound = AudioSegment.from_wav(out)
    sound.export(dest2, format="wav", bitrate="768k", codec="pcm_s16le")

    # audio_duration = sound.duration_seconds
   
    # extendVideoDuration(dest, audio_duration)

    formdata = {
        'audio': open(dest2, 'rb'),
        'video': open(dest, 'rb')
    }   
    

    os.remove(dest2)
    os.remove(dest)
    

    r = requests.post(videoserver, files=formdata)
    path3 = os.path.join(
        app.config['UPLOAD_FOLDER'],
        email
    )
    path3 = os.path.join(path3,'output.mp4')
    with open(path3, 'wb') as f:
        f.write(r.content)

    response = Response(open(path3,'rb'),mimetype='video/mp4', content_type='video/mp4')
    os.remove(path3)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

if __name__ == '__main__':
    app.run(debug=True, host='::', port=5000)
