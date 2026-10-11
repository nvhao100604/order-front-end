'use client'

import React, { memo, useCallback } from 'react'
import { useFloorPlanEditor } from '@/hooks/useFloorPlanEditor'
import { FloorPlanHeader } from './FloorPlanHeader'
import { FloorPlanCanvas } from './FloorPlanCanvas'
import { FloorPlanInspector } from './FloorPlanInspector'
import { FloorPlanObstaclePalette } from './FloorPlanObstaclePalette'
import { FloorPlanUnplacedTray } from './FloorPlanUnplacedTray'
import { AlertTriangle } from 'lucide-react'

interface FloorPlanEditorProps {
    onOpenTableCRUD?: () => void
}

export const FloorPlanEditor: React.FC<FloorPlanEditorProps> = memo(({ onOpenTableCRUD }) => {
    const {
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
    } = useFloorPlanEditor()

    const selectedItem = selectedIndex !== null ? layoutItems[selectedIndex] : null

    const handleRefresh = useCallback(() => {
        if (selectedAreaId) {
            loadAreaLayout(selectedAreaId)
        }
    }, [selectedAreaId, loadAreaLayout])

    const handleDeselect = useCallback(() => {
        setSelectedIndex(null)
    }, [setSelectedIndex])

    return (
        <div className="space-y-6">
            {/* Header Control Bar */}
            <FloorPlanHeader
                areas={areas}
                selectedAreaId={selectedAreaId}
                currentArea={currentArea}
                isLoading={isLoading}
                isSaving={isSaving}
                hasErrors={validationErrors.hasError}
                onSelectArea={setSelectedAreaId}
                onRefresh={handleRefresh}
                onSave={handleSaveLayout}
            />

            {/* Validation Alert Banner */}
            {validationErrors.hasError && (
                <div className="p-4 rounded-2xl bg-red-50/90 border border-red-200 text-red-950 flex items-start gap-3 shadow-xs">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <strong className="font-semibold block text-red-900">Coordinate Collisions or Boundary Errors Detected</strong>
                        <p className="text-xs text-red-700 mt-0.5">
                            The layout has {validationErrors.boundaryErrors.size} item(s) exceeding grid boundaries and{' '}
                            {validationErrors.collisions.size} colliding item(s). Please reposition or rotate them before saving.
                        </p>
                    </div>
                </div>
            )}

            {/* Main Interactive Work Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Canvas Container */}
                <div className="lg:col-span-3">
                    <FloorPlanCanvas
                        currentArea={currentArea}
                        layoutItems={layoutItems}
                        selectedIndex={selectedIndex}
                        validationErrors={validationErrors}
                        cellSize={cellSize}
                        isLoading={isLoading}
                        gridRef={gridRef}
                        activeDrag={activeDrag}
                        onCellSizeChange={setCellSize}
                        onPointerDownItem={handlePointerDownItem}
                        onRotateItem={handleRotateItem}
                        onDeselect={handleDeselect}
                    />
                </div>

                {/* Right Side Control Panels */}
                <div className="space-y-6">
                    <FloorPlanInspector
                        selectedItem={selectedItem}
                        selectedIndex={selectedIndex}
                        onUpdateItem={handleUpdateItem}
                        onRotateItem={handleRotateItem}
                        onRemoveItem={handleRemoveItem}
                    />

                    <FloorPlanObstaclePalette
                        onAddObstacle={handleAddObstacle}
                        onPointerDownObstacle={handlePointerDownNewObstacle}
                    />

                    <FloorPlanUnplacedTray
                        unplacedTables={unplacedTables}
                        onPlaceTable={handlePlaceUnplacedTable}
                        onPointerDownTable={handlePointerDownNewTable}
                        onCreateNewTable={onOpenTableCRUD}
                    />
                </div>
            </div>
        </div>
    )
})

FloorPlanEditor.displayName = 'FloorPlanEditor'

export default FloorPlanEditor
