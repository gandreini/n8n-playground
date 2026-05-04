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
        <Zap size={12} fill="currentColor" strokeWidth={0} />
      </span>
      <div className="icon-box">
        <ServiceIcon service={data.service} size={32} tinted={false} />
      </div>
      <Handle type="source" position={Position.Right} className="handle" style={{ top: 40 }} />
      {data.sublabel && <div className="handle-sublabel">{data.sublabel}</div>}
      <div className="label">{data.label}</div>

      <style jsx>{`
        .trigger-node {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .icon-box {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 50px 6px 6px 50px;
          background: var(--background--surface, #ffffff);
          border: 1px solid var(--color--foreground--tint-1, #e0e0e0);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .trigger-node[data-selected='true'] .icon-box {
          border-color: var(--color--primary, var(--color--orange-300));
          box-shadow: 0 0 0 2px var(--color--primary--tint-2, rgba(255, 110, 90, 0.25));
        }
        .bolt {
          position: absolute;
          top: -2px;
          left: -6px;
          color: var(--color--primary, var(--color--orange-400));
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        .label {
          margin-top: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.3;
          color: var(--color--text, #3d3d3d);
          text-align: center;
          max-width: 110px;
        }
        .handle-sublabel {
          position: absolute;
          top: 40px;
          left: calc(50% + 40px + 6px);
          transform: translateY(-50%);
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          color: var(--color--text--tint-1, var(--color--neutral-500));
          white-space: nowrap;
          pointer-events: none;
          line-height: 1;
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
