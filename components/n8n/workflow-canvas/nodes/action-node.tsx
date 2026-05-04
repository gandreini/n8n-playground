'use client'

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { ServiceIcon } from '@/components/n8n/shared/service-icon'
import type { ActionNodeData } from '../types'

type RFActionNode = Node<ActionNodeData, 'action'>

export function ActionNode({ data, selected }: NodeProps<RFActionNode>) {
  return (
    <div className="action-node" data-selected={selected ? 'true' : 'false'}>
      <Handle type="target" position={Position.Left} className="handle" />
      <div className="icon-box">
        <ServiceIcon service={data.service} size={28} />
      </div>
      <Handle type="source" position={Position.Right} className="handle" />
      <div className="labels">
        <div className="label">{data.label}</div>
        {data.sublabel && <div className="sublabel">{data.sublabel}</div>}
      </div>

      <style jsx>{`
        .action-node {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing--3xs);
        }
        .icon-box {
          width: 64px;
          height: 64px;
          border-radius: var(--radius--md, 6px);
          background: var(--color--neutral-white);
          border: 1px solid var(--color--neutral-200);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .action-node[data-selected='true'] .icon-box {
          border-color: var(--color--orange-300);
          box-shadow: 0 0 0 2px var(--color--orange-alpha-300);
        }
        .labels {
          margin-top: var(--spacing--3xs);
          text-align: center;
          max-width: 110px;
        }
        .label {
          font-size: var(--font-size--xs, 12px);
          font-weight: var(--font-weight--medium, 500);
          color: var(--color--neutral-800);
          line-height: 1.3;
        }
        .sublabel {
          font-size: var(--font-size--2xs, 10px);
          color: var(--color--neutral-500);
          line-height: 1.3;
          margin-top: 2px;
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
