import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

// Este componente recibe como parámetros (props) los estados y la función que necesita
export default function ControlesReproductor({ cancionActual, isPlaying, isLoading, alPresionarPlay }) {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity 
        style={[styles.playButton, !cancionActual && styles.disabledButton]} 
        onPress={alPresionarPlay}
        disabled={!cancionActual}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Cargando...' : isPlaying ? 'Pause' : 'Play'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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