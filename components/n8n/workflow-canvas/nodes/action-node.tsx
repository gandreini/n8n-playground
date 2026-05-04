// components/n8n/workflow-canvas/nodes/action-node.tsx
'use client'

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { ServiceIcon } from '@/components/n8n/shared/service-icon'
import type { ActionNodeData } from '../types'

type RFActionNode = Node<ActionNodeData, 'action'>

export function ActionNode({ data, selected }: NodeProps<RFActionNode>) {
  return (
    <div className="action-node" data-selected={selected ? 'true' : 'false'}>
      <Handle type="target" position={Position.Left} className="handle" />
      <div className="pill">
        <div className="icon-side">
          <ServiceIcon service={data.service} size={36} tinted={false} />
        </div>
        <div className="label-side">
          <div className="label">{data.label}</div>
          {data.sublabel && <div className="sublabel">{data.sublabel}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="handle" />

      <style jsx>{`
        .action-node {
          position: relative;
          display: flex;
          align-items: center;
        }
        .pill {
          display: flex;
          align-items: stretch;
          width: 200px;
          min-height: 60px;
          background: var(--color--neutral-white);
          border: 1px solid var(--color--neutral-150);
          border-radius: var(--radius--md, 6px);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          overflow: hidden;
        }
        .icon-side {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          flex-shrink: 0;
          background: transparent;
        }
        .label-side {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--spacing--3xs) var(--spacing--xs) var(--spacing--3xs) 0;
          gap: 2px;
          min-width: 0;
        }
        .label {
          font-size: var(--font-size--sm, 13px);
          font-weight: var(--font-weight--medium, 500);
          color: var(--color--neutral-800);
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sublabel {
          font-size: var(--font-size--2xs, 10px);
          color: var(--color--neutral-500);
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .action-node[data-selected='true'] .pill {
          border-color: var(--color--orange-300);
          box-shadow: 0 0 0 2px var(--color--orange-alpha-300);
        }
        .handle {
          width: 8px;
          height: 8px;
          background: var(--color--neutral-white);
          border: 1px solid var(--color--neutral-400);
        }
      `}</style>
    </div>
  )
}
