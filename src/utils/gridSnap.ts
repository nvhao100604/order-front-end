import { IFloorItemPayload, getEffectiveDimensions } from '@/interfaces'

export interface SnapTarget {
    x: number
    y: number
    isValid: boolean
    effW: number
    effH: number
}

/**
 * Compares two snap targets to determine whether grid coordinates or validity has changed.
 */
export function isSnapTargetEqual(a: SnapTarget | null, b: SnapTarget | null): boolean {
    if (a === b) return true
    if (!a || !b) return false
    return a.x === b.x && a.y === b.y && a.isValid === b.isValid && a.effW === b.effW && a.effH === b.effH
}

/**
 * Checks whether two 2D axis-aligned bounding boxes (AABB) overlap.
 */
export function isAABBOverlap(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
): boolean {
    return !(x1 + w1 <= x2 || x2 + w2 <= x1 || y1 + h1 <= y2 || y2 + h2 <= y1)
}

/**
 * Checks whether position (x, y) with effective size (effW, effH) collides with any other floor item.
 */
export function checkCollision(
    x: number,
    y: number,
    effW: number,
    effH: number,
    items: IFloorItemPayload[],
    ignoreIndex?: number
): boolean {
    for (let i = 0; i < items.length; i++) {
        if (ignoreIndex !== undefined && i === ignoreIndex) continue

        const other = items[i]
        const otherEff = getEffectiveDimensions(other.w, other.h, other.rotation ?? 0)

        if (isAABBOverlap(x, y, effW, effH, other.x, other.y, otherEff.effW, otherEff.effH)) {
            return true
        }
    }
    return false
}

/**
 * Checks whether a bounding box is fully contained within the grid boundaries (cols x rows).
 */
export function isWithinGridBounds(
    x: number,
    y: number,
    effW: number,
    effH: number,
    cols: number,
    rows: number
): boolean {
    return x >= 0 && y >= 0 && x + effW <= cols && y + effH <= rows
}

interface PrecomputedBox {
    x: number
    y: number
    effW: number
    effH: number
}

/**
 * High-performance Snap-to-Grid algorithm:
 * 1. fx, fy: floating top-left coordinates in grid cell units.
 * 2. cx = clamp(round(fx), 0, cols - effW), cy = clamp(round(fy), 0, rows - effH).
 * 3. If hypot(fx - cx, fy - cy) > snapRadius: outside attraction radius -> return null.
 * 4. Precompute bounding boxes of existing items once (O(N) upfront instead of per neighbor cell).
 * 5. Check cell (cx, cy):
 *    - If unoccupied and inside bounds: valid target -> return { x: cx, y: cy, isValid: true }.
 *    - If occupied / colliding: scan neighbor cells within ceil(snapRadius).
 *      Pick unoccupied cell with minimal Euclidean distance to (fx, fy).
 *      If found: return { x: bestX, y: bestY, isValid: true }.
 *      If no vacant cell remains in radius: return { x: cx, y: cy, isValid: false } (invalid preview frame).
 */
export function findSnapPosition(
    fx: number,
    fy: number,
    effW: number,
    effH: number,
    cols: number,
    rows: number,
    items: IFloorItemPayload[],
    snapRadius: number = 1.5,
    ignoreIndex?: number
): SnapTarget | null {
    // 1. Find nearest rounded cell
    const rawRoundX = Math.round(fx)
    const rawRoundY = Math.round(fy)

    const cx = Math.max(0, Math.min(rawRoundX, cols - effW))
    const cy = Math.max(0, Math.min(rawRoundY, rows - effH))

    // 2. Distance check against attraction radius
    const distToCenter = Math.hypot(fx - cx, fy - cy)
    if (distToCenter > snapRadius) {
        return null // Outside attraction radius
    }

    // 3. Precompute bounding boxes of other items once
    const otherBoxes: PrecomputedBox[] = []
    for (let i = 0; i < items.length; i++) {
        if (ignoreIndex !== undefined && i === ignoreIndex) continue
        const other = items[i]
        const otherEff = getEffectiveDimensions(other.w, other.h, other.rotation ?? 0)
        otherBoxes.push({
            x: other.x,
            y: other.y,
            effW: otherEff.effW,
            effH: otherEff.effH,
        })
    }

    const isBoxColliding = (x: number, y: number): boolean => {
        for (let i = 0; i < otherBoxes.length; i++) {
            const b = otherBoxes[i]
            if (isAABBOverlap(x, y, effW, effH, b.x, b.y, b.effW, b.effH)) {
                return true
            }
        }
        return false
    }

    // 4. Check direct candidate cell (cx, cy)
    const isDirectInBounds = isWithinGridBounds(cx, cy, effW, effH, cols, rows)
    const isDirectColliding = isDirectInBounds && isBoxColliding(cx, cy)

    if (isDirectInBounds && !isDirectColliding) {
        return {
            x: cx,
            y: cy,
            isValid: true,
            effW,
            effH,
        }
    }

    // 5. If occupied, search neighboring cells within radius ceil(snapRadius)
    const searchRadius = Math.ceil(snapRadius)
    let bestSpot: { x: number; y: number; dist: number } | null = null

    for (let dy = -searchRadius; dy <= searchRadius; dy++) {
        for (let dx = -searchRadius; dx <= searchRadius; dx++) {
            if (dx === 0 && dy === 0) continue

            const nx = cx + dx
            const ny = cy + dy

            // Boundary check
            if (!isWithinGridBounds(nx, ny, effW, effH, cols, rows)) {
                continue
            }

            // Euclidean distance check from float pointer to neighbor cell
            const dist = Math.hypot(fx - nx, fy - ny)
            if (dist > snapRadius) {
                continue
            }

            // Collision check against precomputed bounding boxes
            if (!isBoxColliding(nx, ny)) {
                if (bestSpot === null || dist < bestSpot.dist) {
                    bestSpot = { x: nx, y: ny, dist }
                }
            }
        }
    }

    if (bestSpot !== null) {
        return {
            x: bestSpot.x,
            y: bestSpot.y,
            isValid: true,
            effW,
            effH,
        }
    }

    // No unoccupied cell within snap radius -> return invalid candidate frame for user feedback
    return {
        x: cx,
        y: cy,
        isValid: false,
        effW,
        effH,
    }
}
