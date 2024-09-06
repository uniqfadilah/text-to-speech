import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';
const useOpenAISpeech = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<any>(null);
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);
  const playSound = async (audioBlob: any) => {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader?.result?.toString().split(',')[1];
      try {
        const { sound } = await Audio.Sound.createAsync({
          uri: `data:audio/mpeg;base64,${base64Data}`,
        });
        setSound(sound);
        sound.playAsync();
      } catch (error) {
        Alert.alert('Error', 'Failed to play audio');
        console.error(error);
      }
    };

    reader.readAsDataURL(audioBlob);
  };
  const generateSpeech = async (str: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: str,
          voice: 'onyx',
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.blob();
      playSound(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { generateSpeech, loading, error };
};

export default useOpenAISpeech;
