import {
  CommonActions,
  NavigationContainerRef
} from '@react-navigation/native';
import { createRef } from 'react';
import { RootStackParamList } from './types';

// Crear una referencia al navegador correctamente tipada
export const navigationRef = createRef<NavigationContainerRef<RootStackParamList>>();

/**
 * Servicio de navegación centralizado
 */
class NavigationService {
  /**
   * Navega a una pantalla específica
   */
  navigate<T extends keyof RootStackParamList>(
    screenName: T,
    params?: RootStackParamList[T],
  ): boolean {
    if (navigationRef.current) {
      try {
        navigationRef.current.navigate(screenName as any, params as any);
        return true;
      } catch (error) {
        console.error(`Error al navegar a ${String(screenName)}:`, error);
        return false;
      }
    }
    console.warn('NavigationRef no está disponible');
    return false;
  }

  /**
   * Vuelve a la pantalla anterior
   */
  goBack(): boolean {
    if (navigationRef.current) {
      try {
        if (navigationRef.current.canGoBack()) {
          navigationRef.current.goBack();
          return true;
        }
        // Si no es posible ir atrás, volver a la pantalla principal
        navigationRef.current.navigate('Home' as never);
        return true;
      } catch (error) {
        console.error('Error al volver atrás:', error);
        return false;
      }
    }
    console.warn('NavigationRef no está disponible');
    return false;
  }

  /**
   * Reinicia a una pantalla específica, limpiando la pila de navegación
   */
  reset<T extends keyof RootStackParamList>(
    screenName: T,
    params?: RootStackParamList[T],
  ): boolean {
    if (navigationRef.current) {
      try {
        navigationRef.current.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: screenName as string, params: params as any}],
          }),
        );
        return true;
      } catch (error) {
        console.error(`Error al reiniciar a ${String(screenName)}:`, error);
        return false;
      }
    }
    console.warn('NavigationRef no está disponible');
    return false;
  }

  /**
   * Obtiene el nombre de la ruta actual
   */
  getCurrentRoute(): string | undefined {
    if (navigationRef.current) {
      return navigationRef.current.getCurrentRoute()?.name;
    }
    return undefined;
  }

  /**
   * Verifica si se puede navegar hacia atrás
   */
  canGoBack(): boolean {
    return navigationRef.current?.canGoBack() || false;
  }
}

// Exportar una instancia singleton del servicio
export const Navigation = new NavigationService();