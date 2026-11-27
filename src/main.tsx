import { createRoot } from 'react-dom/client'
import { useGLTF, useTexture } from '@react-three/drei'
import '@fontsource-variable/inter'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/jetbrains-mono'
import './styles.css'
import { App } from './App'

useTexture.preload('textures/heightmap_1024.png')
useGLTF.preload('models/track-draco.glb')
useGLTF.preload('models/chassis-draco.glb')
useGLTF.preload('models/wheel-draco.glb')

createRoot(document.getElementById('root')!).render(<App />)
