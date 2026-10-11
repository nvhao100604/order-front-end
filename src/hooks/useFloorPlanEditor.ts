'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { toast } from 'react-toastify'
import {
    IArea,
    IFloorItemPayload,
    IUpdateLayoutPayload,
    FloorItemKind,
    TableShape,
    ITableResponse,
    getEffectiveDimensions,
} from '@/interfaces'
import { area_services } from '@/services/area.services'
import { tables_services } from '@/services/table.services'
import { SnapTarget, findSnapPosition, isAABBOverlap, isSnapTargetEqual } from '@/utils/gridSnap'

export interface ActiveDragState {
    source: 'EXISTING' | 'NEW_TABLE' | 'NEW_OBSTACLE'
    itemIndex?: number
    dragItem: IFloorItemPayload
    grabOffset: { x: number; y: number }
    snapTarget: SnapTarget | null
    floatingPos: { x: number; y: number }
    initialPos?: { x: number; y: number }
}

type PendingDrag =
    | { type: 'EXISTING'; index: number; startX: number; startY: number; item: IFloorItemPayload }
    | { type: 'NEW_TABLE'; table: ITableResponse; startX: number; startY: number; shape?: TableShape }
    | { type: 'NEW_OBSTACLE'; kind: FloorItemKind; startX: number; startY: number }

const getObstacleDefaultSize = (kind: FloorItemKind) => {
    switch (kind) {
        case 'BAR':
            return { w: 6, h: 2 }
        case 'DOOR':
            return { w: 3, h: 1 }
        case 'STAIRS':
            return { w: 3, h: 2 }
        case 'PILLAR':
            return { w: 1, h: 1 }
        default:
            return { w: 2, h: 2 }
    }
}

const getTableDefaultSize = (shape: TableShape = 'SQUARE') => {
    switch (shape) {
        case 'LONG':
            return { w: 4, h: 2 }
        case 'ROUND':
            return { w: 2, h: 2 }
        case 'SQUARE':
        default:
            return { w: 2, h: 2 }
    }
}

export function useFloorPlanEditor() {
    const [areas, setAreas] = useState<IArea[]>([])
    const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null)
    const [currentArea, setCurrentArea] = useState<IArea | null>(null)
    const [layoutItems, setLayoutItems] = useState<IFloorItemPayload[]>([])
    const [areaTables, setAreaTables] = useState<ITableResponse[]>([])
    const [unplacedTables, setUnplacedTables] = useState<ITableResponse[]>([])

    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [cellSize, setCellSize] = useState<number>(26)

    // Active drag state for snap-to-grid preview
    const [activeDrag, setActiveDrag] = useState<ActiveDragState | null>(null)

    // DOM ref to the canvas grid container
    const gridRef = useRef<HTMLDivElement | null>(null)

    // Stable references to prevent stale closures and unnecessary re-attachments
    const activeDragRef = useRef<ActiveDragState | null>(null)
    activeDragRef.current = activeDrag

    const pendingDragRef = useRef<PendingDrag | null>(null)

    const layoutItemsRef = useRef(layoutItems)
    layoutItemsRef.current = layoutItems

    const currentAreaRef = useRef(currentArea)
    currentAreaRef.current = currentArea

    const cellSizeRef = useRef(cellSize)
    cellSizeRef.current = cellSize

    const selectedIndexRef = useRef(selectedIndex)
    selectedIndexRef.current = selectedIndex

    // Animation frame ref for drag throttling (60fps/120fps sync)
    const rafRef = useRef<number | null>(null)
    const latestPointerPosRef = useRef<{ x: number; y: number } | null>(null)

    // 1. Fetch Area List & Unplaced Tables directly from API
    const fetchInitialData = useCallback(async () => {
        setIsLoading(true)
        try {
            const [areasRes, unplacedRes] = await Promise.allSettled([
                area_services.getAreas(),
                tables_services.getUnplacedTables(),
            ])

            if (areasRes.status === 'fulfilled' && areasRes.value.data) {
                const loaded = areasRes.value.data
                setAreas(loaded)
                if (loaded.length > 0) {
                    setSelectedAreaId((prev) => (prev && loaded.some((a) => a.id === prev) ? prev : loaded[0].id))
                }
            }

            if (unplacedRes.status === 'fulfilled' && unplacedRes.value.data) {
                setUnplacedTables(unplacedRes.value.data)
            }
        } catch (err: any) {
            console.error('Failed to load initial layout data:', err)
            toast.error(err.response?.data?.detail || err.message || 'Failed to load areas list from server.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchInitialData()
    }, [fetchInitialData])

    // 2. Load layout directly from API for selected area
    const loadAreaLayout = useCallback(async (areaId: number) => {
        setIsLoading(true)
        setSelectedIndex(null)
        setActiveDrag(null)
        activeDragRef.current = null
        pendingDragRef.current = null

        try {
            const [layoutRes, unplacedRes] = await Promise.allSettled([
                area_services.getAreaLayout(areaId),
                tables_services.getUnplacedTables(),
            ])

            if (layoutRes.status === 'fulfilled' && layoutRes.value.data) {
                const data = layoutRes.value.data
                setCurrentArea({
                    id: data.id,
                    name: data.name,
                    gridW: data.gridW,
                    gridH: data.gridH,
                    layoutVersion: data.layoutVersion,
                })
                setLayoutItems(
                    (data.items || []).map((it) => ({
                        tableId: it.tableId ?? null,
                        kind: it.kind,
                        shape: it.shape || (it.kind === 'TABLE' ? 'SQUARE' : null),
                        x: it.x,
                        y: it.y,
                        w: it.w,
                        h: it.h,
                        rotation: it.rotation ?? 0,
                    }))
                )
                setAreaTables(data.tables || [])
            }

            if (unplacedRes.status === 'fulfilled' && unplacedRes.value.data) {
                setUnplacedTables(unplacedRes.value.data)
            }
        } catch (err: any) {
            console.error('Failed to load area layout:', err)
            toast.error(err.response?.data?.detail || err.message || 'Failed to load layout data for the area.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (selectedAreaId) {
            loadAreaLayout(selectedAreaId)
        }
    }, [selectedAreaId, loadAreaLayout])

    // 3. Real-time Effective Bounding Box & Collision Validation (Optimized with precomputed dims)
    const validationErrors = useMemo(() => {
        if (!currentArea) return { hasError: false, boundaryErrors: new Set<number>(), collisions: new Set<number>() }

        const boundarySet = new Set<number>()
        const collisionSet = new Set<number>()

        // Precompute effective dimensions once (O(N) instead of O(N^2))
        const effDims = layoutItems.map((item) =>
            getEffectiveDimensions(item.w, item.h, item.rotation ?? 0)
        )

        for (let i = 0; i < layoutItems.length; i++) {
            const item1 = layoutItems[i]
            const eff1 = effDims[i]

            // Boundary Check
            if (
                item1.x < 0 ||
                item1.y < 0 ||
                item1.x + eff1.effW > currentArea.gridW ||
                item1.y + eff1.effH > currentArea.gridH
            ) {
                boundarySet.add(i)
            }

            // Overlap Collision Check
            for (let j = i + 1; j < layoutItems.length; j++) {
                const item2 = layoutItems[j]
                const eff2 = effDims[j]

                const overlap = isAABBOverlap(
                    item1.x,
                    item1.y,
                    eff1.effW,
                    eff1.effH,
                    item2.x,
                    item2.y,
                    eff2.effW,
                    eff2.effH
                )

                if (overlap) {
                    collisionSet.add(i)
                    collisionSet.add(j)
                }
            }
        }

        return {
            hasError: boundarySet.size > 0 || collisionSet.size > 0,
            boundaryErrors: boundarySet,
            collisions: collisionSet,
        }
    }, [layoutItems, currentArea])

    // 4. Save Layout via API (with Optimistic Lock 409 handling)
    const handleSaveLayout = useCallback(async () => {
        if (!currentAreaRef.current || !selectedAreaId) return

        if (validationErrors.hasError) {
            toast.warn('⚠️ Items exceeding boundaries or colliding detected. Please adjust before saving.')
            return
        }

        setIsSaving(true)
        const payload: IUpdateLayoutPayload = {
            layoutVersion: currentAreaRef.current.layoutVersion,
            items: layoutItemsRef.current.map((item) => ({
                tableId: item.tableId ?? null,
                kind: item.kind,
                shape: item.kind === 'TABLE' ? (item.shape || 'SQUARE') : null,
                x: Number(item.x),
                y: Number(item.y),
                w: Number(item.w),
                h: Number(item.h),
                rotation: Number(item.rotation ?? 0),
            })),
        }

        try {
            const res = await area_services.updateAreaLayout(selectedAreaId, payload)
            if (res?.data) {
                const updated = res.data
                toast.success(`✅ Layout for area "${updated.name}" (v${updated.layoutVersion}) saved successfully!`)
                setCurrentArea({
                    id: updated.id,
                    name: updated.name,
                    gridW: updated.gridW,
                    gridH: updated.gridH,
                    layoutVersion: updated.layoutVersion,
                })
                setLayoutItems(
                    (updated.items || []).map((it) => ({
                        tableId: it.tableId ?? null,
                        kind: it.kind,
                        shape: it.shape || (it.kind === 'TABLE' ? 'SQUARE' : null),
                        x: it.x,
                        y: it.y,
                        w: it.w,
                        h: it.h,
                        rotation: it.rotation ?? 0,
                    }))
                )
                setAreaTables(updated.tables || [])

                // Refresh unplaced tables directly from API
                const unplaced = await tables_services.getUnplacedTables()
                if (unplaced?.data) {
                    setUnplacedTables(unplaced.data)
                }
            }
        } catch (err: any) {
            console.error('Update layout API error:', err)
            if (err.response?.status === 409) {
                toast.error('❌ The layout was updated by another user. Please reload the page to get the latest data.')
                await loadAreaLayout(selectedAreaId)
            } else if (err.response?.status === 422) {
                toast.error(`❌ Layout data error: ${err.response?.data?.detail || 'Collision or boundary error'}`)
            } else if (err.response?.status === 403) {
                toast.error('❌ You do not have permission to perform this action (requires Staff or Admin role).')
            } else {
                toast.error(err.response?.data?.detail || err.message || 'Failed to save layout.')
            }
        } finally {
            setIsSaving(false)
        }
    }, [selectedAreaId, validationErrors.hasError, loadAreaLayout])

    // 5. Manipulation Methods
    const handleRotateItem = useCallback((index: number) => {
        setLayoutItems((prev) =>
            prev.map((item, idx) => {
                if (idx !== index) return item
                const nextRotation = ((item.rotation ?? 0) + 90) % 360
                return { ...item, rotation: nextRotation }
            })
        )
    }, [])

    const handleUpdateItem = useCallback((index: number, updates: Partial<IFloorItemPayload>) => {
        setLayoutItems((prev) =>
            prev.map((item, idx) => (idx === index ? { ...item, ...updates } : item))
        )
    }, [])

    const handleRemoveItem = useCallback((index: number) => {
        const removed = layoutItemsRef.current[index]
        if (!removed) return

        if (removed.tableId) {
            const tableObj = areaTables.find((t) => t.id === removed.tableId)
            if (tableObj) {
                setUnplacedTables((prev) => [...prev, tableObj])
            }
        }

        setLayoutItems((prev) => prev.filter((_, idx) => idx !== index))
        setSelectedIndex(null)
    }, [areaTables])

    const handleAddObstacle = useCallback((kind: FloorItemKind) => {
        if (!currentAreaRef.current) return
        const size = getObstacleDefaultSize(kind)

        const newItem: IFloorItemPayload = {
            tableId: null,
            kind,
            shape: null,
            x: 1,
            y: 1,
            w: size.w,
            h: size.h,
            rotation: 0,
        }

        setLayoutItems((prev) => [...prev, newItem])
        setSelectedIndex(layoutItemsRef.current.length)
        toast.info(`Added ${kind}. You can drag and drop it onto the floor layout.`)
    }, [])

    const handlePlaceUnplacedTable = useCallback((table: ITableResponse, shape: TableShape = 'SQUARE') => {
        if (!currentAreaRef.current) return
        const size = getTableDefaultSize(shape)

        const newItem: IFloorItemPayload = {
            tableId: table.id,
            kind: 'TABLE',
            shape,
            x: 0,
            y: 0,
            w: size.w,
            h: size.h,
            rotation: 0,
        }

        setLayoutItems((prev) => [...prev, newItem])
        setUnplacedTables((prev) => prev.filter((t) => t.id !== table.id))
        setSelectedIndex(layoutItemsRef.current.length)
        toast.success(`Placed table #${table.number || table.id} onto the layout!`)
    }, [])

    // 6. Snap-to-Grid Drag & Drop Event Triggers (Pointer Events)
    const handlePointerDownItem = useCallback((e: React.PointerEvent, index: number) => {
        if (e.button !== 0) return
        e.stopPropagation()
        setSelectedIndex(index)

        const item = layoutItemsRef.current[index]
        if (!item) return

        pendingDragRef.current = {
            type: 'EXISTING',
            index,
            startX: e.clientX,
            startY: e.clientY,
            item,
        }
    }, [])

    const handlePointerDownNewTable = useCallback((e: React.PointerEvent, table: ITableResponse, shape?: TableShape) => {
        if (e.button !== 0) return
        pendingDragRef.current = {
            type: 'NEW_TABLE',
            table,
            startX: e.clientX,
            startY: e.clientY,
            shape,
        }
    }, [])

    const handlePointerDownNewObstacle = useCallback((e: React.PointerEvent, kind: FloorItemKind) => {
        if (e.button !== 0) return
        pendingDragRef.current = {
            type: 'NEW_OBSTACLE',
            kind,
            startX: e.clientX,
            startY: e.clientY,
        }
    }, [])

    // 7. Global Window Pointer & Keyboard 'R' Listeners with requestAnimationFrame Throttling
    useEffect(() => {
        const processDragMove = () => {
            rafRef.current = null
            const pos = latestPointerPosRef.current
            if (!pos) return

            // A. Check if pending drag crosses threshold (> 5px) to start dragging
            if (pendingDragRef.current && !activeDragRef.current) {
                const pd = pendingDragRef.current
                const dist = Math.hypot(pos.x - pd.startX, pos.y - pd.startY)
                if (dist > 5) {
                    let dragItem: IFloorItemPayload
                    let grabOffset = { x: 0, y: 0 }
                    let initialPos: { x: number; y: number } | undefined = undefined

                    if (pd.type === 'EXISTING') {
                        const it = pd.item
                        initialPos = { x: it.x, y: it.y }
                        dragItem = { ...it }
                        if (gridRef.current) {
                            const gridRect = gridRef.current.getBoundingClientRect()
                            const itemLeft = gridRect.left + it.x * cellSizeRef.current
                            const itemTop = gridRect.top + it.y * cellSizeRef.current
                            grabOffset = {
                                x: pd.startX - itemLeft,
                                y: pd.startY - itemTop,
                            }
                        }
                    } else if (pd.type === 'NEW_TABLE') {
                        const shape = pd.shape || 'SQUARE'
                        const size = getTableDefaultSize(shape)
                        dragItem = {
                            tableId: pd.table.id,
                            kind: 'TABLE',
                            shape,
                            x: 0,
                            y: 0,
                            w: size.w,
                            h: size.h,
                            rotation: 0,
                        }
                        grabOffset = {
                            x: (size.w * cellSizeRef.current) / 2,
                            y: (size.h * cellSizeRef.current) / 2,
                        }
                    } else {
                        // NEW_OBSTACLE
                        const size = getObstacleDefaultSize(pd.kind)
                        dragItem = {
                            tableId: null,
                            kind: pd.kind,
                            shape: null,
                            x: 0,
                            y: 0,
                            w: size.w,
                            h: size.h,
                            rotation: 0,
                        }
                        grabOffset = {
                            x: (size.w * cellSizeRef.current) / 2,
                            y: (size.h * cellSizeRef.current) / 2,
                        }
                    }

                    const newDrag: ActiveDragState = {
                        source: pd.type,
                        itemIndex: pd.type === 'EXISTING' ? pd.index : undefined,
                        dragItem,
                        grabOffset,
                        snapTarget: null,
                        floatingPos: { x: pos.x, y: pos.y },
                        initialPos,
                    }

                    activeDragRef.current = newDrag
                    pendingDragRef.current = null
                    setActiveDrag(newDrag)
                }
            }

            // B. Active Drag calculation: Euclidean distance <= 1.5 grid cells
            if (activeDragRef.current) {
                const current = activeDragRef.current
                let nextSnapTarget: SnapTarget | null = null

                if (gridRef.current && currentAreaRef.current) {
                    const gridRect = gridRef.current.getBoundingClientRect()
                    const eff = getEffectiveDimensions(
                        current.dragItem.w,
                        current.dragItem.h,
                        current.dragItem.rotation ?? 0
                    )
                    const itemLeftPx = pos.x - current.grabOffset.x
                    const itemTopPx = pos.y - current.grabOffset.y

                    const fx = (itemLeftPx - gridRect.left) / cellSizeRef.current
                    const fy = (itemTopPx - gridRect.top) / cellSizeRef.current

                    nextSnapTarget = findSnapPosition(
                        fx,
                        fy,
                        eff.effW,
                        eff.effH,
                        currentAreaRef.current.gridW,
                        currentAreaRef.current.gridH,
                        layoutItemsRef.current,
                        1.5,
                        current.source === 'EXISTING' ? current.itemIndex : undefined
                    )
                }

                // If snap target didn't change cell or validity, preserve reference
                const targetToUse = isSnapTargetEqual(current.snapTarget, nextSnapTarget)
                    ? current.snapTarget
                    : nextSnapTarget

                const updated: ActiveDragState = {
                    ...current,
                    snapTarget: targetToUse,
                    floatingPos: { x: pos.x, y: pos.y },
                }
                activeDragRef.current = updated
                setActiveDrag(updated)
            }
        }

        const handleWindowPointerMove = (e: PointerEvent) => {
            if (!pendingDragRef.current && !activeDragRef.current) return

            latestPointerPosRef.current = { x: e.clientX, y: e.clientY }
            if (rafRef.current === null) {
                rafRef.current = requestAnimationFrame(processDragMove)
            }
        }

        const handleWindowPointerUp = () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = null
            }
            latestPointerPosRef.current = null

            // Case 1: Simple click without dragging
            if (pendingDragRef.current) {
                const pd = pendingDragRef.current
                pendingDragRef.current = null

                if (pd.type === 'EXISTING') {
                    setSelectedIndex(pd.index)
                } else if (pd.type === 'NEW_TABLE') {
                    handlePlaceUnplacedTable(pd.table, pd.shape)
                } else if (pd.type === 'NEW_OBSTACLE') {
                    handleAddObstacle(pd.kind)
                }
                return
            }

            // Case 2: Drop active drag
            if (activeDragRef.current) {
                const drag = activeDragRef.current
                activeDragRef.current = null
                setActiveDrag(null)

                if (drag.snapTarget && drag.snapTarget.isValid) {
                    const { x, y } = drag.snapTarget

                    if (drag.source === 'EXISTING' && drag.itemIndex !== undefined) {
                        setLayoutItems((prev) =>
                            prev.map((it, idx) =>
                                idx === drag.itemIndex
                                    ? { ...it, x, y, rotation: drag.dragItem.rotation }
                                    : it
                            )
                        )
                        setSelectedIndex(drag.itemIndex)
                    } else if (drag.source === 'NEW_TABLE') {
                        const newItem: IFloorItemPayload = {
                            ...drag.dragItem,
                            x,
                            y,
                        }
                        setLayoutItems((prev) => [...prev, newItem])
                        if (drag.dragItem.tableId) {
                            setUnplacedTables((prev) => prev.filter((t) => t.id !== drag.dragItem.tableId))
                        }
                        setSelectedIndex(layoutItemsRef.current.length)
                        toast.success(`Placed table #${drag.dragItem.tableId} at position (${x}, ${y})!`)
                    } else if (drag.source === 'NEW_OBSTACLE') {
                        const newItem: IFloorItemPayload = {
                            ...drag.dragItem,
                            x,
                            y,
                        }
                        setLayoutItems((prev) => [...prev, newItem])
                        setSelectedIndex(layoutItemsRef.current.length)
                        toast.info(`Placed ${drag.dragItem.kind} at position (${x}, ${y}).`)
                    }
                } else {
                    // Fallback rule: Cancel operation (revert existing items, discard new items)
                    if (drag.source === 'EXISTING') {
                        setSelectedIndex(drag.itemIndex ?? null)
                        toast.info('Action cancelled (item returned to original position).')
                    } else if (drag.source === 'NEW_TABLE') {
                        toast.info('Table placement cancelled.')
                    } else if (drag.source === 'NEW_OBSTACLE') {
                        toast.info('Obstacle placement cancelled.')
                    }
                }
            }
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'r' || e.key === 'R') {
                const activeEl = document.activeElement
                if (
                    activeEl &&
                    (activeEl.tagName === 'INPUT' ||
                        activeEl.tagName === 'TEXTAREA' ||
                        activeEl.tagName === 'SELECT' ||
                        (activeEl as HTMLElement).isContentEditable)
                ) {
                    return
                }

                // Rotate while dragging (drag in progress)
                if (activeDragRef.current) {
                    e.preventDefault()
                    const current = activeDragRef.current
                    const nextRotation = ((current.dragItem.rotation ?? 0) + 90) % 360
                    const updatedDragItem = { ...current.dragItem, rotation: nextRotation }

                    let nextSnapTarget: SnapTarget | null = null
                    if (gridRef.current && currentAreaRef.current) {
                        const gridRect = gridRef.current.getBoundingClientRect()
                        const eff = getEffectiveDimensions(
                            updatedDragItem.w,
                            updatedDragItem.h,
                            updatedDragItem.rotation ?? 0
                        )
                        const fx = (current.floatingPos.x - current.grabOffset.x - gridRect.left) / cellSizeRef.current
                        const fy = (current.floatingPos.y - current.grabOffset.y - gridRect.top) / cellSizeRef.current

                        nextSnapTarget = findSnapPosition(
                            fx,
                            fy,
                            eff.effW,
                            eff.effH,
                            currentAreaRef.current.gridW,
                            currentAreaRef.current.gridH,
                            layoutItemsRef.current,
                            1.5,
                            current.source === 'EXISTING' ? current.itemIndex : undefined
                        )
                    }

                    const updated: ActiveDragState = {
                        ...current,
                        dragItem: updatedDragItem,
                        snapTarget: nextSnapTarget,
                    }
                    activeDragRef.current = updated
                    setActiveDrag(updated)
                    return
                }

                // Rotate when dropped and item is selected on canvas
                if (selectedIndexRef.current !== null) {
                    e.preventDefault()
                    handleRotateItem(selectedIndexRef.current)
                }
            }
        }

        window.addEventListener('pointermove', handleWindowPointerMove)
        window.addEventListener('pointerup', handleWindowPointerUp)
        window.addEventListener('pointercancel', handleWindowPointerUp)
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = null
            }
            window.removeEventListener('pointermove', handleWindowPointerMove)
            window.removeEventListener('pointerup', handleWindowPointerUp)
            window.removeEventListener('pointercancel', handleWindowPointerUp)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleRotateItem, handleAddObstacle, handlePlaceUnplacedTable])

    return {
        areas,
        selectedAreaId,
        setSelectedAreaId,
        currentArea,
        layoutItems,
        unplacedTables,
        isLoading,
        isSaving,
        selectedIndex,
        setSelectedIndex,
        cellSize,
        setCellSize,
        validationErrors,
        gridRef,
        activeDrag,
        handleSaveLayout,
        handleRotateItem,
        handleUpdateItem,
        handleRemoveItem,
        handleAddObstacle,
        handlePlaceUnplacedTable,
        loadAreaLayout,
        handlePointerDownItem,
        handlePointerDownNewTable,
        handlePointerDownNewObstacle,
    }
}
