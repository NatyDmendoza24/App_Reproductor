import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef } from 'react'; // useState para recordar si la musica esta sonando
//useEffect para limpiar la memoria
import {Audio} from 'expo-av'; //Importamos el motor de audio

export default function App() {

  //variables para controlar la reproduccion
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    // 1. Configuramos los permisos del OS para permitir que el audio suene siempre
    async function setupAudio() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (e) {
        console.log("Error configurando audio:", e);
      }
    }
    setupAudio();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  async function handlePlayPause() {
    if (isLoading) return; // Si el audio está cargando, ignoramos el click

    try {
      if (soundRef.current) {
        if (isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
      } else {
        setIsLoading(true);
        console.log('Cargando archivo de audio por primera vez...');
        
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('./SRC/assets/Prueba.mp3')
        );
        
        soundRef.current = newSound;
        await newSound.playAsync();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (error) {
      // Extraemos el mensaje de error real
      console.log('Error detallado:', error.message || error);
      setIsLoading(false);
    }
  }
  return (
    <View style={styles.container}>

      {/* Portada del álbum (Placeholder) */}
      <View style={styles.albumCover}>
        <Text style={styles.coverText}>🎵 Portada</Text>
      </View>

      {/* Información de la pista */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>Cancion</Text>
        <Text style={styles.trackArtist}>Tame Impala</Text>
      </View>

      {/* Controles de reproducción */}
      <View style={styles.controlsContjainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.playButton]} 
          onPress={handlePlayPause}
        >
          {/* Mostramos "Cargando..." para saber qué está haciendo internamente */}
          <Text style={styles.buttonText}>
            {isLoading ? 'Cargando...' : isPlaying ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Un tema oscuro elegante
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  albumCover: {
    width: 250,
    height: 250,
    backgroundColor: '#282828',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  coverText: {
    color: '#b3b3b3',
    fontSize: 20,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  trackTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  trackArtist: {
    color: '#b3b3b3',
    fontSize: 18,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    padding: 15,
  },
  playButton: {
    backgroundColor: '#1d7bb9', // Verde estilo reproductor moderno
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  }
});