from TTS.utils.synthesizer import Synthesizer
from phonemizer import phonemize
import numpy as np

synthesizer = Synthesizer(
        tts_checkpoint="./model/best_model.pth",
        tts_config_path="./model/config.json",
        tts_speakers_file="./model/speakers.pth",
        encoder_checkpoint="./speaker_encoder/model_se.pth.tar",
        encoder_config="./speaker_encoder/config_se.json",
        use_cuda=False)

# synthesizer = Synthesizer(
#         tts_checkpoint="./modeloldtransfer/best_model.pth",
#         tts_config_path="./modeloldtransfer/config.json",
#         tts_speakers_file="./modeloldtransfer/speakers.pth",
#         encoder_checkpoint="./speakerencodertransfer/model_se.pth",
#         encoder_config="./speakerencodertransfer/config_se.json",
#         use_cuda=False)

def synthesize(text, name=None, wavfilee=None):
    text = phonemize(text, language='ur', backend='espeak', strip=True, preserve_punctuation=False,language_switch='remove-flags',with_stress=True)
    text += "."   
    ##convert the text arry into equal chunks
    chunksize = 5
    finalaudio = []
    tokens = text.split()
    while len(tokens) > 0:
        audio = synthesizer.tts(text=" ".join(tokens[:chunksize]),speaker_name=name,speaker_wav=wavfilee)
        # print(type(audio))
        tokens = tokens[chunksize:]
        #concatenate the audio to final audio
        finalaudio.append(audio)
 
    aud = np.concatenate(finalaudio)
    finalaudio = aud
#     audio = synthesizer.tts(text=text,speaker_name=name,speaker_wav=wavfilee)
    return finalaudio