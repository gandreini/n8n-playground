'use client'

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { Zap } from 'lucide-react'
import { ServiceIcon } from '@/components/n8n/shared/service-icon'
import type { TriggerNodeData } from '../types'

type RFTriggerNode = Node<TriggerNodeData, 'trigger'>

export function TriggerNode({ data, selected }: NodeProps<RFTriggerNode>) {
  return (
    <div className="trigger-node" data-selected={selected ? 'true' : 'false'}>
      <span className="bolt" aria-hidden>
        <Zap size={14} fill="currentColor" strokeWidth={0} />
      </span>
      <div className="icon-box">
        <ServiceIcon service={data.service} size={40} tinted={false} />
      </div>
      <Handle type="source" position={Position.Right} className="handle" />
      {data.sublabel && <div className="handle-sublabel">{data.sublabel}</div>}
      <div className="label">{data.label}</div>

      <style jsx>{`
        .trigger-node {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing--3xs);
        }
        .icon-box {
          position: relative;
          width: 64px;
          height: 64px;
          border-radius: 50px 6px 6px 50px;
          background: var(--color--neutral-white);
          border: 1px solid var(--color--neutral-150);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .trigger-node[data-selected='true'] .icon-box {
          border-color: var(--color--orange-300);
          box-shadow: 0 0 0 2px var(--color--orange-alpha-300);
        }
        .bolt {
          position: absolute;
          top: -4px;
          left: -8px;
          color: var(--color--orange-400);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        .label {
          font-size: var(--font-size--xs, 12px);
          font-weight: var(--font-weight--medium, 500);
          color: var(--color--neutral-800);
          line-height: 1.3;
          text-align: center;
          max-width: 110px;
          margin-top: var(--spacing--3xs);
        }
        .handle-sublabel {
          position: absolute;
          top: 32px;
          left: calc(50% + 32px + 6px);
          transform: translateY(-50%);
          font-size: 10px;
          color: var(--color--neutral-500);
          white-space: nowrap;
          pointer-events: none;
          line-height: 1;
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
