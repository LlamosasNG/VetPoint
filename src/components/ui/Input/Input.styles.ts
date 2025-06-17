import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputWrapper: {
    position: 'relative',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  required: {
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  error: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
  },
});
