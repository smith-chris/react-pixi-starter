import { AudioContextFactory } from '../Resources/Sound/AudioContext';
import { Promise, PromiseState } from '../Promises';
import { Logger } from './Log';

export interface LegacyWebAudioSource {
  playbackState: string;
  PLAYING_STATE: 'playing';
  FINISHED_STATE: 'finished';
}

function isLegacyWebAudioSource(source: any): source is LegacyWebAudioSource {
  return !!source.playbackState;
}

export class WebAudio {
  private static _unlocked: boolean = false;

  /**
   * Play an empty sound to unlock Safari WebAudio context. Call this function
   * right after a user interaction event.
   * @source https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
   */
  static unlock(): Promise<boolean> {
    const promise = new Promise<boolean>();
    if (WebAudio._unlocked || !AudioContextFactory.create()) {
      return promise.resolve(true);
    }
    const unlockTimeoutTimer = setTimeout(() => {
      Logger.getInstance().warn('Excalibur was unable to unlock the audio context, audio probably will not play in this browser.');
      promise.resolve();
    }, 200);
    const audioContext = AudioContextFactory.create();
    audioContext.resume().then(
      () => {
        // create empty buffer and play it
        const buffer = audioContext.createBuffer(1, 1, 22050);
        const source = audioContext.createBufferSource();
        let ended = false;

        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.onended = () => (ended = true);

        if ((<any>source).noteOn) {
          // deprecated
          (<any>source).noteOn(0);
        } else {
          source.start(0);
        }

        // by checking the play state after some time, we know if we're really unlocked
        setTimeout(() => {
          if (isLegacyWebAudioSource(source)) {
            if (source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE) {
              WebAudio._unlocked = true;
            }
          } else {
            if (audioContext.currentTime > 0 || ended) {
              WebAudio._unlocked = true;
            }
          }
        }, 0);

        clearTimeout(unlockTimeoutTimer);
        if (promise.state() === PromiseState.Pending) {
          promise.resolve();
        }
      },
      () => {
        if (promise.state() === PromiseState.Pending) {
          promise.reject(false);
        }
      }
    );

    return promise;
  }

  static isUnlocked() {
    return this._unlocked;
  }
}
