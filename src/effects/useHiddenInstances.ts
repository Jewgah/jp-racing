import { useLayoutEffect } from 'react'
import { Matrix4 } from 'three'

import type { RefObject } from 'react'
import type { InstancedMesh } from 'three'

const zero = new Matrix4().makeScale(0, 0, 0)

/**
 * three r139 (upstream) filled InstancedMesh matrices with zeros, so unused particles were invisible.
 * Since r15x they start as identity, which parks every unused particle at full size on the origin.
 * Collapse them to zero scale on mount to restore the original look. Instances also move every
 * frame, so the stale bounding sphere must not cull them.
 */
export function useHiddenInstances(ref: RefObject<InstancedMesh | null>, count: number) {
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    for (let i = 0; i < count; i++) mesh.setMatrixAt(i, zero)
    mesh.instanceMatrix.needsUpdate = true
    mesh.frustumCulled = false
  }, [count])
}
