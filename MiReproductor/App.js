import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>

      {/* Portada del álbum (Placeholder) */}
      <View style={styles.albumCover}>
        <Text style={styles.coverText}>🎵 Portada</Text>
      </View>

      {/* Información de la pista */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>Nombre de la Canción</Text>
        <Text style={styles.trackArtist}>Artista Desconocido</Text>
      </View>

      {/* Controles de reproducción */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.playButton]}>
          <Text style={styles.buttonText}>Play / Pause</Text>
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