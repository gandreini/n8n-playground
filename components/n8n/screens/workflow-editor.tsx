'use client'

import { useStore, WorkflowNode, Connection } from '@/lib/store'
import { useState, useRef, useCallback, useEffect } from 'react'
import {
  ChevronDown,
  Plus,
  Search,
  Copy,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Wand2,
  Play,
  Settings,
  User,
  X,
  Check,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sidebar } from '../sidebar'
import { NodesPanel } from '../panels/nodes-panel'
import { NodeConfigPanel } from '../panels/node-config-panel'
import { toast } from 'sonner'

const N8nLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="4" cy="12" r="3" fill="var(--color--orange-300)" />
    <circle cx="12" cy="12" r="3" fill="var(--color--orange-300)" />
    <circle cx="20" cy="12" r="3" fill="var(--color--orange-300)" />
    <line x1="7" y1="12" x2="9" y2="12" stroke="var(--color--orange-300)" strokeWidth="2" />
    <line x1="15" y1="12" x2="17" y2="12" stroke="var(--color--orange-300)" strokeWidth="2" />
  </svg>
)

// Canvas Node Component
function CanvasNode({ 
  node, 
  isSelected, 
  onSelect, 
  onDragStart,
  onOpenConfig,
  onAddNode,
  zoom
}: { 
  node: WorkflowNode
  isSelected: boolean
  onSelect: () => void
  onDragStart: (e: React.MouseEvent, nodeId: string) => void
  onOpenConfig: () => void
  onAddNode: () => void
  zoom: number
}) {
  const getNodeIcon = () => {
    switch (node.icon) {
      case 'clock':
        return (
          <div className="w-12 h-12 rounded-lg bg-[var(--color--green-100)] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color--green-600)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
        )
      case 'google-calendar':
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="10" width="36" height="32" rx="3" fill="#FFFFFF" stroke="#4285F4" strokeWidth="2"/>
            <rect x="6" y="10" width="36" height="10" fill="#4285F4"/>
            <rect x="10" y="5" width="5" height="10" rx="2" fill="#4285F4"/>
            <rect x="33" y="5" width="5" height="10" rx="2" fill="#4285F4"/>
            <text x="24" y="35" fontSize="16" fontWeight="600" fill="#1A73E8" textAnchor="middle">31</text>
          </svg>
        )
      case 'switch':
        return (
          <div className="w-12 h-12 rounded-lg bg-[var(--color--blue-100)] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color--blue-600)" strokeWidth="2">
              <path d="M6 3v12M18 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM18 21a3 3 0 100-6 3 3 0 000 6z"/>
              <path d="M18 8v8M6 16v-4"/>
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-12 h-12 rounded-lg bg-[var(--color--neutral-100)] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color--neutral-500)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
        )
    }
  }

  return (
    <div
      className="absolute"
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: `scale(${zoom})`,
        transformOrigin: 'top left'
      }}
    >
      {/* Trigger indicator */}
      {node.isTrigger && (
        <div className="absolute -left-6 top-1/2 -translate-y-1/2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color--orange-300)">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      )}
      
      {/* Node card */}
      <div
        className={cn(
          'relative w-[100px] h-[100px] bg-white rounded-[var(--radius--sm)] node-shadow cursor-pointer flex items-center justify-center border-2 transition-snappy',
          isSelected ? 'border-[var(--color--orange-300)]' : 'border-transparent hover:border-[var(--color--neutral-200)]'
        )}
        onClick={onSelect}
        onDoubleClick={onOpenConfig}
        onMouseDown={(e) => onDragStart(e, node.id)}
      >
        {/* Status indicator */}
        {node.status === 'running' && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color--orange-300)] rounded-full flex items-center justify-center">
            <Loader2 className="w-3 h-3 text-white animate-spin" />
          </div>
        )}
        {node.status === 'success' && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color--green-500)] rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
        
        {/* Input connector */}
        {node.inputs.length > 0 && (
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[var(--color--neutral-200)] border-2 border-[var(--color--neutral-150)] rounded-full" />
        )}
        
        {/* Node icon */}
        {getNodeIcon()}
        
        {/* Output connectors */}
        {node.outputs.length === 1 && (
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[var(--color--neutral-200)] border-2 border-[var(--color--neutral-150)] rounded-full" />
        )}
        {node.outputs.length > 1 && node.outputLabels?.map((label, index) => (
          <div 
            key={index}
            className="absolute right-0 translate-x-1/2 flex items-center gap-1"
            style={{ top: 25 + index * 25 }}
          >
            <span className="text-[var(--font-size--3xs)] text-[var(--color--neutral-400)] mr-1">{label}</span>
            <div className="w-3 h-3 bg-[var(--color--neutral-200)] border-2 border-[var(--color--neutral-150)] rounded-full" />
          </div>
        ))}
        
        {/* Add node button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onAddNode(); }}
          className="absolute right-0 top-1/2 translate-x-[calc(100%+8px)] -translate-y-1/2 w-5 h-5 bg-white border border-[var(--color--neutral-200)] rounded-full flex items-center justify-center hover:border-[var(--color--orange-300)] hover:text-[var(--color--orange-300)] transition-snappy opacity-0 group-hover:opacity-100"
          style={{ opacity: isSelected ? 1 : 0 }}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      
      {/* Node name */}
      <div className="text-center mt-2 w-[100px]">
        <p className="text-[var(--font-size--xs)] font-[var(--font-weight--medium)] text-[var(--color--neutral-700)] break-words">
          {node.name}
        </p>
        {node.operation && (
          <p className="text-[var(--font-size--3xs)] text-[var(--color--neutral-400)]">
            {node.operation}
          </p>
        )}
      </div>
    </div>
  )
}

// SVG Connections
function Connections({ 
  nodes, 
  connections, 
  zoom,
  panOffset 
}: { 
  nodes: WorkflowNode[]
  connections: Connection[]
  zoom: number
  panOffset: { x: number; y: number }
}) {
  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return { x: 0, y: 0 }
    return node.position
  }
  
  const getOutputY = (node: WorkflowNode, outputIndex: number) => {
    if (node.outputs.length === 1) return 50
    return 25 + outputIndex * 25
  }

  return (
    <svg 
      className="absolute inset-0 pointer-events-none" 
      style={{ 
        width: '100%', 
        height: '100%',
        overflow: 'visible'
      }}
    >
      {connections.map((conn) => {
        const sourceNode = nodes.find(n => n.id === conn.sourceId)
        const targetNode = nodes.find(n => n.id === conn.targetId)
        if (!sourceNode || !targetNode) return null
        
        const sourcePos = getNodePosition(conn.sourceId)
        const targetPos = getNodePosition(conn.targetId)
        
        const startX = (sourcePos.x + 100) * zoom + panOffset.x
        const startY = (sourcePos.y + getOutputY(sourceNode, conn.sourceOutput)) * zoom + panOffset.y
        const endX = targetPos.x * zoom + panOffset.x
        const endY = (targetPos.y + 50) * zoom + panOffset.y
        
        const midX = (startX + endX) / 2
        
        return (
          <path
            key={conn.id}
            d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
            fill="none"
            stroke="var(--color--neutral-200)"
            strokeWidth={2}
          />
        )
      })}
    </svg>
  )
}

export function WorkflowEditor() {
  const { 
    currentWorkflow, 
    closeWorkflow, 
    currentEditorTab, 
    setEditorTab,
    selectedNodeId,
    selectNode,
    moveNode,
    nodesPanelOpen,
    openNodesPanel,
    closeNodesPanel,
    nodeConfigOpen,
    openNodeConfig,
    closeNodeConfig,
    zoom,
    setZoom,
    panOffset,
    setPanOffset,
    executeWorkflow
  } = useStore()
  
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragNodeId, setDragNodeId] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  
  // Handle node dragging
  const handleNodeDragStart = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return
    e.stopPropagation()
    setIsDragging(true)
    setDragNodeId(nodeId)
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [])
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && dragNodeId && currentWorkflow) {
      const node = currentWorkflow.nodes.find(n => n.id === dragNodeId)
      if (node) {
        const dx = (e.clientX - dragStart.x) / zoom
        const dy = (e.clientY - dragStart.y) / zoom
        moveNode(dragNodeId, {
          x: node.position.x + dx,
          y: node.position.y + dy
        })
        setDragStart({ x: e.clientX, y: e.clientY })
      }
    }
    if (isPanning) {
      const dx = e.clientX - panStart.x
      const dy = e.clientY - panStart.y
      setPanOffset({
        x: panOffset.x + dx,
        y: panOffset.y + dy
      })
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }, [isDragging, dragNodeId, dragStart, zoom, moveNode, currentWorkflow, isPanning, panStart, panOffset, setPanOffset])
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDragNodeId(null)
    setIsPanning(false)
  }, [])
  
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && e.target === e.currentTarget) {
      selectNode(null)
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }, [selectNode])
  
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(zoom + delta)
  }, [zoom, setZoom])
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false })
      return () => canvas.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])
  
  const handleExecute = () => {
    executeWorkflow()
    toast.success('Workflow executed successfully')
  }
  
  if (!currentWorkflow) return null
  
  return (
    <div className="n8n-workflow-editor h-screen flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-12 bg-white border-b border-[var(--color--neutral-150)] flex items-center justify-between px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[var(--font-size--xs)] text-[var(--color--neutral-500)]">
            <User className="w-4 h-4" />
            <span>Personal</span>
            <span>/</span>
            {currentWorkflow.tags?.includes('Production Workflows') && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-[var(--color--green-400)] rounded-sm" />
                  Production Workflows
                </span>
                <span>/</span>
              </>
            )}
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[var(--color--green-400)] rounded-sm" />
              {currentWorkflow.name}
            </span>
            <button className="text-[var(--color--neutral-400)] hover:text-[var(--color--neutral-600)]">
              + Add tag
            </button>
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="text-[var(--font-size--xs)] text-[var(--color--neutral-500)]">0 / 3</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--color--green-500)]" />
              <span className="text-[var(--font-size--xs)] text-[var(--color--neutral-500)]">Published</span>
            </div>
            <ChevronDown className="w-4 h-4 text-[var(--color--neutral-400)]" />
            <Settings className="w-4 h-4 text-[var(--color--neutral-400)]" />
          </div>
        </div>
        
        {/* Orange gradient line */}
        <div className="h-[2px] bg-gradient-to-r from-[var(--color--orange-300)] via-[var(--color--orange-200)] to-transparent" />
        
        {/* Editor Tabs */}
        <div className="h-10 bg-white border-b border-[var(--color--neutral-150)] flex items-center justify-center gap-6">
          {['Editor', 'Executions', 'Evaluations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setEditorTab(tab.toLowerCase() as 'editor' | 'executions' | 'evaluations')}
              className={cn(
                'text-[var(--font-size--sm)] font-[var(--font-weight--medium)] pb-2',
                currentEditorTab === tab.toLowerCase()
                  ? 'text-[var(--color--neutral-800)] border-b-2 border-[var(--color--neutral-800)]'
                  : 'text-[var(--color--neutral-500)] hover:text-[var(--color--neutral-700)]'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="absolute inset-0 canvas-grid cursor-grab active:cursor-grabbing"
            onMouseDown={handleCanvasMouseDown}
          >
            {/* Connections */}
            <Connections
              nodes={currentWorkflow.nodes}
              connections={currentWorkflow.connections}
              zoom={zoom}
              panOffset={panOffset}
            />
            
            {/* Nodes */}
            <div
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: 'top left'
              }}
            >
              {currentWorkflow.nodes.map((node) => (
                <CanvasNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNodeId === node.id}
                  onSelect={() => selectNode(node.id)}
                  onDragStart={handleNodeDragStart}
                  onOpenConfig={() => {
                    selectNode(node.id)
                    openNodeConfig()
                  }}
                  onAddNode={openNodesPanel}
                  zoom={zoom}
                />
              ))}
            </div>
            
            {/* Empty state */}
            {currentWorkflow.nodes.length === 0 && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <button
                  onClick={openNodesPanel}
                  className="w-48 h-32 border-2 border-dashed border-[var(--color--neutral-200)] rounded-[var(--radius--md)] flex flex-col items-center justify-center gap-2 text-[var(--color--neutral-400)] hover:border-[var(--color--orange-300)] hover:text-[var(--color--orange-300)] transition-snappy"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-[var(--font-size--sm)]">Add first step...</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Bottom left - Zoom controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white border border-[var(--color--neutral-150)] rounded-[var(--radius--full)] p-1">
            <button 
              onClick={() => setZoom(1)}
              className="p-2 hover:bg-[var(--color--neutral-100)] rounded-full transition-snappy"
            >
              <Maximize2 className="w-4 h-4 text-[var(--color--neutral-500)]" />
            </button>
            <button 
              onClick={() => setZoom(zoom + 0.1)}
              className="p-2 hover:bg-[var(--color--neutral-100)] rounded-full transition-snappy"
            >
              <ZoomIn className="w-4 h-4 text-[var(--color--neutral-500)]" />
            </button>
            <button 
              onClick={() => setZoom(zoom - 0.1)}
              className="p-2 hover:bg-[var(--color--neutral-100)] rounded-full transition-snappy"
            >
              <ZoomOut className="w-4 h-4 text-[var(--color--neutral-500)]" />
            </button>
            <button className="p-2 hover:bg-[var(--color--neutral-100)] rounded-full transition-snappy">
              <Wand2 className="w-4 h-4 text-[var(--color--neutral-500)]" />
            </button>
          </div>
          
          {/* Bottom center - Execute button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Button
              onClick={handleExecute}
              className="bg-[var(--color--orange-300)] hover:bg-[var(--color--orange-400)] text-white rounded-full px-6 gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Execute workflow
            </Button>
          </div>
          
          {/* Bottom bar - Logs */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-white border-t border-[var(--color--neutral-150)] flex items-center justify-between px-4">
            <span className="text-[var(--font-size--xs)] text-[var(--color--neutral-500)]">Logs</span>
            <ChevronDown className="w-4 h-4 text-[var(--color--neutral-400)]" />
          </div>
          
          {/* Right toolbar */}
          <div className="absolute top-4 right-4 flex flex-col gap-1 bg-white border border-[var(--color--neutral-150)] rounded-[var(--radius--xs)] p-1">
            <button 
              onClick={openNodesPanel}
              className="p-2 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)] transition-snappy"
            >
              <Plus className="w-4 h-4 text-[var(--color--neutral-500)]" />
            </button>
            <button className="p-2 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)] transition-snappy">
              <Search className="w-4 h-4 text-[var(--color--neutral-500)]" />
            </button>
            <button className="p-2 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)] transition-snappy">
              <Copy className="w-4 h-4 text-[var(--color--neutral-500)]" />
            </button>
            <div className="w-full h-px bg-[var(--color--neutral-150)]" />
            <button className="p-2 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)] transition-snappy">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="6" height="6" rx="1" fill="var(--color--neutral-500)"/>
                <rect x="14" y="4" width="6" height="6" rx="1" fill="var(--color--neutral-500)"/>
                <rect x="4" y="14" width="6" height="6" rx="1" fill="var(--color--neutral-500)"/>
                <rect x="14" y="14" width="6" height="6" rx="1" fill="var(--color--neutral-500)"/>
              </svg>
            </button>
            <button className="p-2 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)] transition-snappy">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L2 12h3v9h14v-9h3L12 3z" fill="var(--color--purple-500)"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Nodes Panel */}
      {nodesPanelOpen && <NodesPanel />}
      
      {/* Node Config Panel */}
      {nodeConfigOpen && <NodeConfigPanel />}
    </div>
  )
}
