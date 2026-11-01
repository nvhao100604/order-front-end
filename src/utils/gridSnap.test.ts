import { findSnapPosition } from './gridSnap'
import { IFloorItemPayload } from '../interfaces'
import assert from 'node:assert'

console.log('--- TESTING GRID SNAP UTILITY ---')

// Test 1: Basic snap to cell when within 1.5 radius
{
    const items: IFloorItemPayload[] = []
    const target = findSnapPosition(2.2, 3.1, 2, 2, 20, 20, items, 1.5)
    assert(target !== null, 'Should find snap target')
    assert.strictEqual(target.x, 2)
    assert.strictEqual(target.y, 3)
    assert.strictEqual(target.isValid, true)
    console.log('✅ Test 1: Snaps to nearest cell within radius (2.2, 3.1) -> (2, 3)')
}

// Test 2: Outside 1.5 radius returns null
{
    const items: IFloorItemPayload[] = []
    const target = findSnapPosition(-1.6, 0, 2, 2, 20, 20, items, 1.5)
    assert.strictEqual(target, null, 'Outside 1.5 radius should return null')
    console.log('✅ Test 2: Outside 1.5 radius returns null')
}

// Test 3: Occupied cell -> finds nearest free neighbor within 1.5 radius
{
    const items: IFloorItemPayload[] = [
        { tableId: 1, kind: 'TABLE', shape: 'SQUARE', x: 2, y: 2, w: 2, h: 2, rotation: 0 }
    ]
    const target = findSnapPosition(2.8, 2.0, 2, 2, 20, 20, items, 1.5)
    assert(target !== null, 'Should find target')
    assert.strictEqual(target.isValid, true, 'Should find free neighbor spot')
    assert.strictEqual(target.x, 4, 'Should snap to free neighbor at x=4')
    assert.strictEqual(target.y, 2, 'Should snap to free neighbor at y=2')
    console.log('✅ Test 3: Occupied cell finds nearest free neighbor within radius 1.5 -> (4, 2)')
}

// Test 4: Occupied cell -> no neighbor within 1.5 radius returns isValid = false
{
    const items: IFloorItemPayload[] = [
        { tableId: null, kind: 'PILLAR', shape: null, x: 0, y: 0, w: 10, h: 10, rotation: 0 }
    ]
    const target = findSnapPosition(2.0, 2.0, 2, 2, 20, 20, items, 1.5)
    assert(target !== null, 'Target frame still returned for visual error feedback')
    assert.strictEqual(target.isValid, false, 'Should be marked as invalid')
    console.log('✅ Test 4: When no spot in radius 1.5 is free, returns isValid: false')
}

// Test 5: Ignore own index when dragging existing item
{
    const items: IFloorItemPayload[] = [
        { tableId: 1, kind: 'TABLE', shape: 'SQUARE', x: 2, y: 2, w: 2, h: 2, rotation: 0 }
    ]
    const target = findSnapPosition(2.1, 2.1, 2, 2, 20, 20, items, 1.5, 0)
    assert(target !== null)
    assert.strictEqual(target.isValid, true, 'Should not collide with itself')
    assert.strictEqual(target.x, 2)
    assert.strictEqual(target.y, 2)
    console.log('✅ Test 5: Ignores own index during collision check')
}

console.log('--- ALL GRID SNAP TESTS PASSED ---')
