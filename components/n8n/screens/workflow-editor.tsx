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
  Check,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Sidebar } from '../sidebar'
import { NodesPanel } from '../panels/nodes-panel'
import { NodeConfigPanel } from '../panels/node-config-panel'
import { toast } from 'sonner'

// Canvas Node Component
function CanvasNode({
  node,
  isSelected,
  onSelect,
  onDragStart,
  onOpenConfig,
  onAddNode,
  zoom,
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
          <div className="icon-box green">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color--green-600)"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
        )
      case 'google-calendar':
        return (
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect
              x="6"
              y="10"
              width="36"
              height="32"
              rx="3"
              fill="#FFFFFF"
              stroke="#4285F4"
              strokeWidth="2"
            />
            <rect x="6" y="10" width="36" height="10" fill="#4285F4" />
            <rect x="10" y="5" width="5" height="10" rx="2" fill="#4285F4" />
            <rect x="33" y="5" width="5" height="10" rx="2" fill="#4285F4" />
            <text x="24" y="35" fontSize="16" fontWeight="600" fill="#1A73E8" textAnchor="middle">
              31
            </text>
          </svg>
        )
      case 'switch':
        return (
          <div className="icon-box blue">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color--blue-600)"
              strokeWidth="2"
            >
              <path d="M6 3v12M18 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM18 21a3 3 0 100-6 3 3 0 000 6z" />
              <path d="M18 8v8M6 16v-4" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="icon-box neutral">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color--neutral-500)"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
        )
    }
  }

  return (
    <div
      className="canvas-node-wrap"
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
      }}
    >
      {/* Trigger indicator */}
      {node.isTrigger && (
        <div className="trigger-bolt">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color--orange-300)">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      )}

      {/* Node card */}
      <div
        className="node-card"
        data-selected={isSelected ? 'true' : undefined}
        onClick={onSelect}
        onDoubleClick={onOpenConfig}
        onMouseDown={(e) => onDragStart(e, node.id)}
      >
        {/* Status indicator */}
        {node.status === 'running' && (
          <div className="status running">
            <Loader2 style={{ width: 12, height: 12, color: '#fff' }} className="spin" />
          </div>
        )}
        {node.status === 'success' && (
          <div className="status success">
            <Check style={{ width: 12, height: 12, color: '#fff' }} />
          </div>
        )}

        {/* Input connector */}
        {node.inputs.length > 0 && <div className="connector input" />}

        {/* Node icon */}
        {getNodeIcon()}

        {/* Output connectors */}
        {node.outputs.length === 1 && <div className="connector output" />}
        {node.outputs.length > 1 &&
          node.outputLabels?.map((label, index) => (
            <div
              key={index}
              className="output-labeled"
              style={{ top: 25 + index * 25 }}
            >
              <span className="output-label">{label}</span>
              <div className="connector labeled" />
            </div>
          ))}

        {/* Add node button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddNode()
          }}
          className="add-next"
          style={{ opacity: isSelected ? 1 : 0 }}
        >
          <Plus style={{ width: 12, height: 12 }} />
        </button>
      </div>

      {/* Node name */}
      <div className="node-label">
        <p className="node-name">{node.name}</p>
        {node.operation && <p className="node-op">{node.operation}</p>}
      </div>

      <style jsx>{`
        .canvas-node-wrap {
          position: absolute;
        }
        .trigger-bolt {
          position: absolute;
          left: -24px;
          top: 50%;
          transform: translateY(-50%);
        }
        .node-card {
          position: relative;
          width: 100px;
          height: 100px;
          background-color: #fff;
          border-radius: var(--radius--sm);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid transparent;
          transition:
            border-color var(--duration--snappy) var(--easing--ease-out),
            box-shadow var(--duration--snappy) var(--easing--ease-out);
        }
        .node-card:hover {
          border-color: var(--color--neutral-200);
        }
        .node-card[data-selected='true'] {
          border-color: var(--color--orange-300);
        }
        .status {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .status.running {
          background-color: var(--color--orange-300);
        }
        .status.success {
          background-color: var(--color--green-500);
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .connector {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--color--neutral-200);
          border: 2px solid var(--color--neutral-150);
        }
        .connector.input {
          left: 0;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .connector.output {
          right: 0;
          top: 50%;
          transform: translate(50%, -50%);
        }
        .output-labeled {
          position: absolute;
          right: 0;
          transform: translateX(50%);
          display: flex;
          align-items: center;
          gap: var(--spacing--5xs);
        }
        .output-label {
          font-size: var(--font-size--3xs);
          color: var(--color--neutral-400);
          margin-right: var(--spacing--5xs);
        }
        .connector.labeled {
          position: static;
          transform: none;
        }
        .add-next {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate(calc(100% + 8px), -50%);
          width: 20px;
          height: 20px;
          background-color: #fff;
          border: 1px solid var(--color--neutral-200);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color--neutral-500);
          transition:
            border-color var(--duration--snappy) var(--easing--ease-out),
            color var(--duration--snappy) var(--easing--ease-out);
        }
        .add-next:hover {
          border-color: var(--color--orange-300);
          color: var(--color--orange-300);
        }
        .node-label {
          text-align: center;
          margin-top: var(--spacing--4xs);
          width: 100px;
        }
        .node-name {
          font-size: var(--font-size--xs);
          font-weight: var(--font-weight--medium);
          color: var(--color--neutral-700);
          word-break: break-word;
        }
        .node-op {
          font-size: var(--font-size--3xs);
          color: var(--color--neutral-400);
        }
        .icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius--xs);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-box.green {
          background-color: var(--color--green-100);
        }
        .icon-box.blue {
          background-color: var(--color--blue-100);
        }
        .icon-box.neutral {
          background-color: var(--color--neutral-100);
        }
      `}</style>
    </div>
  )
}

// SVG Connections
function Connections({
  nodes,
  connections,
  zoom,
  panOffset,
}: {
  nodes: WorkflowNode[]
  connections: Connection[]
  zoom: number
  panOffset: { x: number; y: number }
}) {
  const getNodePosition = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return { x: 0, y: 0 }
    return node.position
  }

  const getOutputY = (node: WorkflowNode, outputIndex: number) => {
    if (node.outputs.length === 1) return 50
    return 25 + outputIndex * 25
  }

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        overflow: 'visible',
      }}
    >
      {connections.map((conn) => {
        const sourceNode = nodes.find((n) => n.id === conn.sourceId)
        const targetNode = nodes.find((n) => n.id === conn.targetId)
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
    currentEditorTab,
    setEditorTab,
    selectedNodeId,
    selectNode,
    moveNode,
    nodesPanelOpen,
    openNodesPanel,
    nodeConfigOpen,
    openNodeConfig,
    zoom,
    setZoom,
    panOffset,
    setPanOffset,
    executeWorkflow,
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

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && dragNodeId && currentWorkflow) {
        const node = currentWorkflow.nodes.find((n) => n.id === dragNodeId)
        if (node) {
          const dx = (e.clientX - dragStart.x) / zoom
          const dy = (e.clientY - dragStart.y) / zoom
          moveNode(dragNodeId, {
            x: node.position.x + dx,
            y: node.position.y + dy,
          })
          setDragStart({ x: e.clientX, y: e.clientY })
        }
      }
      if (isPanning) {
        const dx = e.clientX - panStart.x
        const dy = e.clientY - panStart.y
        setPanOffset({
          x: panOffset.x + dx,
          y: panOffset.y + dy,
        })
        setPanStart({ x: e.clientX, y: e.clientY })
      }
    },
    [
      isDragging,
      dragNodeId,
      dragStart,
      zoom,
      moveNode,
      currentWorkflow,
      isPanning,
      panStart,
      panOffset,
      setPanOffset,
    ],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDragNodeId(null)
    setIsPanning(false)
  }, [])

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0 && e.target === e.currentTarget) {
        selectNode(null)
        setIsPanning(true)
        setPanStart({ x: e.clientX, y: e.clientY })
      }
    },
    [selectNode],
  )

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      setZoom(zoom + delta)
    },
    [zoom, setZoom],
  )

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
    <div className="n8n-workflow-editor">
      <Sidebar />

      <div className="workflow-main">
        {/* Top Bar */}
        <div className="top-bar">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <User style={{ width: 16, height: 16 }} />
            <span>Personal</span>
            <span>/</span>
            {currentWorkflow.tags?.includes('Production Workflows') && (
              <>
                <span className="crumb">
                  <span className="crumb-dot green" />
                  Production Workflows
                </span>
                <span>/</span>
              </>
            )}
            <span className="crumb">
              <span className="crumb-dot green" />
              {currentWorkflow.name}
            </span>
            <button className="add-tag">+ Add tag</button>
          </div>

          {/* Right side */}
          <div className="top-right">
            <span className="meta">0 / 3</span>
            <div className="pub">
              <span className="pub-dot" />
              <span className="meta">Published</span>
            </div>
            <ChevronDown style={{ width: 16, height: 16, color: 'var(--color--neutral-400)' }} />
            <Settings style={{ width: 16, height: 16, color: 'var(--color--neutral-400)' }} />
          </div>
        </div>

        {/* Orange gradient line */}
        <div className="gradient-line" />

        {/* Editor Tabs */}
        <div className="editor-tabs">
          {['Editor', 'Executions', 'Evaluations'].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setEditorTab(tab.toLowerCase() as 'editor' | 'executions' | 'evaluations')
              }
              data-active={currentEditorTab === tab.toLowerCase() ? 'true' : undefined}
              className="editor-tab"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div className="canvas-wrap">
          <div
            ref={canvasRef}
            className="canvas canvas-grid"
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
                transformOrigin: 'top left',
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
              <div className="empty-wrap">
                <button onClick={openNodesPanel} className="empty-btn">
                  <Plus style={{ width: 32, height: 32 }} />
                  <span>Add first step...</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom left - Zoom controls */}
          <div className="zoom-bar">
            <button onClick={() => setZoom(1)} className="zoom-btn">
              <Maximize2 style={{ width: 16, height: 16, color: 'var(--color--neutral-500)' }} />
            </button>
            <button onClick={() => setZoom(zoom + 0.1)} className="zoom-btn">
              <ZoomIn style={{ width: 16, height: 16, color: 'var(--color--neutral-500)' }} />
            </button>
            <button onClick={() => setZoom(zoom - 0.1)} className="zoom-btn">
              <ZoomOut style={{ width: 16, height: 16, color: 'var(--color--neutral-500)' }} />
            </button>
            <button className="zoom-btn">
              <Wand2 style={{ width: 16, height: 16, color: 'var(--color--neutral-500)' }} />
            </button>
          </div>

          {/* Bottom center - Execute button */}
          <div className="execute-wrap">
            <Button onClick={handleExecute} className="execute-btn">
              <Play style={{ width: 16, height: 16, fill: '#fff' }} />
              Execute workflow
            </Button>
          </div>

          {/* Bottom bar - Logs */}
          <div className="logs-bar">
            <span className="meta">Logs</span>
            <ChevronDown style={{ width: 16, height: 16, color: 'var(--color--neutral-400)' }} />
          </div>

          {/* Right toolbar */}
          <div className="right-toolbar">
            <button onClick={openNodesPanel} className="tb-btn">
              <Plus style={{ width: 16, height: 16, color: 'var(--color--neutral-500)' }} />
            </button>
            <button className="tb-btn">
              <Search style={{ width: 16, height: 16, color: 'var(--color--neutral-500)' }} />
            </button>
            <button className="tb-btn">
              <Copy style={{ width: 16, height: 16, color: 'var(--color--neutral-500)' }} />
            </button>
            <div className="tb-sep" />
            <button className="tb-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="6" height="6" rx="1" fill="var(--color--neutral-500)" />
                <rect x="14" y="4" width="6" height="6" rx="1" fill="var(--color--neutral-500)" />
                <rect x="4" y="14" width="6" height="6" rx="1" fill="var(--color--neutral-500)" />
                <rect x="14" y="14" width="6" height="6" rx="1" fill="var(--color--neutral-500)" />
              </svg>
            </button>
            <button className="tb-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L2 12h3v9h14v-9h3L12 3z" fill="var(--color--purple-500)" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Nodes Panel */}
      {nodesPanelOpen && <NodesPanel />}

      {/* Node Config Panel */}
      {nodeConfigOpen && <NodeConfigPanel />}

      <style jsx>{`
        .n8n-workflow-editor {
          height: 100vh;
          display: flex;
        }
        .workflow-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .top-bar {
          height: 48px;
          background-color: #fff;
          border-bottom: 1px solid var(--color--neutral-150);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-inline: var(--spacing--sm);
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          font-size: var(--font-size--xs);
          color: var(--color--neutral-500);
        }
        .crumb {
          display: flex;
          align-items: center;
          gap: var(--spacing--5xs);
        }
        .crumb-dot {
          width: 12px;
          height: 12px;
          border-radius: var(--radius--4xs);
        }
        .crumb-dot.green {
          background-color: var(--color--green-400);
        }
        .add-tag {
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          color: var(--color--neutral-400);
          transition: color var(--duration--snappy) var(--easing--ease-out);
        }
        .add-tag:hover {
          color: var(--color--neutral-600);
        }

        .top-right {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
        }
        .meta {
          font-size: var(--font-size--xs);
          color: var(--color--neutral-500);
        }
        .pub {
          display: flex;
          align-items: center;
          gap: var(--spacing--5xs);
        }
        .pub-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--color--green-500);
        }

        .gradient-line {
          height: 2px;
          background: linear-gradient(
            to right,
            var(--color--orange-300),
            var(--color--orange-200),
            transparent
          );
        }

        .editor-tabs {
          height: 40px;
          background-color: #fff;
          border-bottom: 1px solid var(--color--neutral-150);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing--lg);
        }
        .editor-tab {
          background: transparent;
          border: 0;
          border-bottom: 2px solid transparent;
          padding: 0 0 var(--spacing--3xs);
          cursor: pointer;
          font-size: var(--font-size--sm);
          font-weight: var(--font-weight--medium);
          color: var(--color--neutral-500);
          transition: color var(--duration--snappy) var(--easing--ease-out);
        }
        .editor-tab:hover {
          color: var(--color--neutral-700);
        }
        .editor-tab[data-active='true'] {
          color: var(--color--neutral-800);
          border-bottom-color: var(--color--neutral-800);
        }

        .canvas-wrap {
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        .canvas {
          position: absolute;
          inset: 0;
          cursor: grab;
        }
        .canvas:active {
          cursor: grabbing;
        }

        .empty-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .empty-btn {
          width: 192px;
          height: 128px;
          border: 2px dashed var(--color--neutral-200);
          border-radius: var(--radius--md);
          background: transparent;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--spacing--3xs);
          color: var(--color--neutral-400);
          transition:
            border-color var(--duration--snappy) var(--easing--ease-out),
            color var(--duration--snappy) var(--easing--ease-out);
        }
        .empty-btn span {
          font-size: var(--font-size--sm);
        }
        .empty-btn:hover {
          border-color: var(--color--orange-300);
          color: var(--color--orange-300);
        }

        .zoom-bar {
          position: absolute;
          bottom: var(--spacing--sm);
          left: var(--spacing--sm);
          display: flex;
          align-items: center;
          gap: var(--spacing--5xs);
          background-color: #fff;
          border: 1px solid var(--color--neutral-150);
          border-radius: var(--radius--full);
          padding: var(--spacing--5xs);
        }
        .zoom-btn {
          padding: var(--spacing--3xs);
          border-radius: 50%;
          border: 0;
          background: transparent;
          cursor: pointer;
          transition: background-color var(--duration--snappy) var(--easing--ease-out);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .zoom-btn:hover {
          background-color: var(--color--neutral-100);
        }

        .execute-wrap {
          position: absolute;
          bottom: var(--spacing--sm);
          left: 50%;
          transform: translateX(-50%);
        }
        .execute-wrap :global(.execute-btn) {
          background-color: var(--color--orange-300) !important;
          color: #fff !important;
          border-radius: var(--radius--full) !important;
          padding-inline: var(--spacing--md) !important;
          gap: var(--spacing--3xs) !important;
        }
        .execute-wrap :global(.execute-btn:hover) {
          background-color: var(--color--orange-400) !important;
        }

        .logs-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 32px;
          background-color: #fff;
          border-top: 1px solid var(--color--neutral-150);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-inline: var(--spacing--sm);
        }

        .right-toolbar {
          position: absolute;
          top: var(--spacing--sm);
          right: var(--spacing--sm);
          display: flex;
          flex-direction: column;
          gap: var(--spacing--5xs);
          background-color: #fff;
          border: 1px solid var(--color--neutral-150);
          border-radius: var(--radius--xs);
          padding: var(--spacing--5xs);
        }
        .tb-btn {
          padding: var(--spacing--3xs);
          border: 0;
          background: transparent;
          border-radius: var(--radius--3xs);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color var(--duration--snappy) var(--easing--ease-out);
        }
        .tb-btn:hover {
          background-color: var(--color--neutral-100);
        }
        .tb-sep {
          width: 100%;
          height: 1px;
          background-color: var(--color--neutral-150);
        }
      `}</style>
    </div>
  )
}
