import { StyleSheet, View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

export default function BarraDeProgreso({ posicion, duracion, alArrastrar }) {
  
  // Encapsulamos la lógica de formato de tiempo aquí adentro
  const formatearTiempo = (milisegundos) => {
    if (!milisegundos) return '00:00';
    const totalSegundos = Math.floor(milisegundos / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  };

  return (
    <View style={styles.progressContainer}>
      <Text style={styles.timeText}>{formatearTiempo(posicion)}</Text>
      
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duracion}
        value={posicion}
        minimumTrackTintColor="#1db954"
        maximumTrackTintColor="#404040"
        thumbTintColor="#1db954"
        onSlidingComplete={alArrastrar}
      />
      
      <Text style={styles.timeText}>{formatearTiempo(duracion)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  }
});