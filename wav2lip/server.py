from inference import *
from flask import Flask,request,Response
from werkzeug.utils import secure_filename


UPLOAD_FOLDER = 'static/uploads/'

app = Flask(__name__)

@app.route('/',methods=['POST'])
def index():
  if 'video' not in request.files and 'audio' not in request.files:
    return "All files not present"
    
  video = request.files['video']
  audio = request.files['audio']
  filename1 = secure_filename(video.filename)
  filename2 = secure_filename(audio.filename)
  path1 = os.path.join(UPLOAD_FOLDER, filename1)
  path2 = os.path.join(UPLOAD_FOLDER,filename2)
  path3 = os.path.join(UPLOAD_FOLDER, 'Result'+filename1)
  if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

  video.save(path1)
  audio.save(path2)
  generateResult(path1,path2,path3,'checkpoints/wav2lip_gan.pth')
  response = Response(open(path3,'rb'),mimetype='video/mp4', content_type='video/mp4')
  response.headers['Access-Control-Allow-Origin'] = '*'
  os.remove(path1)
  os.remove(path2)
  os.remove(path3)  
  return response

if __name__ == '__main__':
    app.run(debug=True, host='::', port=5001)