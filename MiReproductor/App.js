import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import Slider from '@react-native-community/slider'; // Importar barra deslizante

export default function App() {
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cancionActual, setCancionActual] = useState(null);
  
  // Nuevos estados para el tiempo (en milisegundos)
  const [duracion, setDuracion] = useState(0);
  const [posicion, setPosicion] = useState(0);

  useEffect(() => {
    async function setupAudio() {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    }
    setupAudio();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Convierte milisegundos a formato minutos:segundos (Ej. 03:15)
  const formatearTiempo = (milisegundos) => {
    if (!milisegundos) return '00:00';
    const totalSegundos = Math.floor(milisegundos / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  };

  // Esta función se ejecuta automáticamente varias veces por segundo mientras suena la música
  const actualizarEstadoReproduccion = (estado) => {
    if (estado.isLoaded) {
      setPosicion(estado.positionMillis);
      setDuracion(estado.durationMillis || 0);
      
      // Si la canción termina sola, cambiamos el botón a "Play"
      if (estado.didJustFinish) {
        setIsPlaying(false);
        setPosicion(0);
      }
    }
  };

  async function seleccionarCancion() {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!resultado.canceled) {
        const archivoElegido = resultado.assets[0];
        setCancionActual({
          nombre: archivoElegido.name,
          uri: archivoElegido.uri,
        });
        reproducirNuevaCancion(archivoElegido.uri);
      }
    } catch (error) {
      console.log('Error al seleccionar documento:', error);
    }
  }

  async function reproducirNuevaCancion(uri) {
    setIsLoading(true);
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: uri },
        { shouldPlay: true } // Que inicie automáticamente
      );
      
      soundRef.current = newSound;
      
      // Conectamos el escuchador de tiempo a nuestra canción
      soundRef.current.setOnPlaybackStatusUpdate(actualizarEstadoReproduccion);
      
      setIsPlaying(true);
    } catch (error) {
      console.log('Error reproduciendo audio:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlayPause() {
    if (!soundRef.current || isLoading) return;

    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Error en pausa/play:', error);
    }
  }

  // Permite al usuario arrastrar la barra para adelantar la canción
  const arrastrarBarra = async (valorEnMilisegundos) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(valorEnMilisegundos);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.playerCard}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {cancionActual ? cancionActual.nombre : 'Ninguna canción seleccionada'}
        </Text>
        
        <TouchableOpacity style={styles.selectButton} onPress={seleccionarCancion}>
          <Text style={styles.buttonText}>Buscar Canción</Text>
        </TouchableOpacity>
      </View>

      {/* Nueva sección: Barra de Progreso y Tiempo */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatearTiempo(posicion)}</Text>
        
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duracion}
          value={posicion}
          minimumTrackTintColor="#1db954" // Color de la parte "reproducida"
          maximumTrackTintColor="#404040" // Color de la parte restante
          thumbTintColor="#1db954" // Color del círculo que arrastras
          onSlidingComplete={arrastrarBarra}
        />
        
        <Text style={styles.timeText}>{formatearTiempo(duracion)}</Text>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.playButton, !cancionActual && styles.disabledButton]} 
          onPress={handlePlayPause}
          disabled={!cancionActual}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Cargando...' : isPlaying ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  playerCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  trackTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectButton: {
    backgroundColor: '#3a3a3c',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  timeText: {
    color: '#b3b3b3',
    fontSize: 14,
    width: 45,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  playButton: {
    backgroundColor: '#1db954',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  disabledButton: {
    backgroundColor: '#555555',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});