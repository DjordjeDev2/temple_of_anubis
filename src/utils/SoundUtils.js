import { Howl } from "howler";

class SoundUtils {
  static play(soundFile, loop = false, volume = 1.0) {
    const sound = new Howl({
      src: [soundFile],
      format: ["wav"],
      loop: loop,
      volume: volume,
      onloaderror: (id, error) => {
        console.error("Failed to load sound:", error);
      },
      onplayerror: (id, error) => {
        console.error("Failed to play sound:", error);
      },
    });

    sound.play();
  }
}

export default SoundUtils;
