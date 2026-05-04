// components/n8n/workflow-canvas/nodes/action-node.tsx
'use client'

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { ServiceIcon } from '@/components/n8n/shared/service-icon'
import type { ActionNodeData } from '../types'

type RFActionNode = Node<ActionNodeData, 'action'>

export function ActionNode({ data, selected }: NodeProps<RFActionNode>) {
  return (
    <div className="action-node" data-selected={selected ? 'true' : 'false'}>
      <Handle type="target" position={Position.Left} className="handle" style={{ top: 40 }} />
      <div className="box">
        <ServiceIcon service={data.service} size={32} tinted={false} />
      </div>
      <Handle type="source" position={Position.Right} className="handle" style={{ top: 40 }} />
      <div className="caption">
        <div className="label">{data.label}</div>
        {data.sublabel && <div className="sublabel">{data.sublabel}</div>}
      </div>

      <style jsx>{`
        .action-node {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
        }
        .box {
          width: 80px;
          height: 80px;
          background: var(--background--surface, #ffffff);
          border: 1px solid var(--color--foreground--tint-1, #e0e0e0);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .action-node[data-selected='true'] .box {
          border-color: var(--color--primary, var(--color--orange-300));
          box-shadow: 0 0 0 2px var(--color--primary--tint-2, rgba(255, 110, 90, 0.25));
        }
        .caption {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          max-width: 130px;
        }
        .label {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.3;
          color: var(--color--text, #3d3d3d);
          text-align: center;
        }
        .sublabel {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          line-height: 1.2;
          color: var(--color--text--tint-1, var(--color--neutral-500));
          text-align: center;
        }
        .handle {
          width: 8px;
          height: 8px;
          background: var(--background--surface, #ffffff);
          border: 1px solid var(--color--foreground, var(--color--neutral-300));
        }
      `}</style>
    </div>
  )
}
