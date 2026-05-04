'use client'

import { NodeResizer, type Node, type NodeProps } from '@xyflow/react'
import type { StickyNodeData, StickyColor } from '../types'

type RFStickyNode = Node<StickyNodeData, 'sticky'>

const COLOR_BG: Record<StickyColor, string> = {
  yellow: '#FFF4B8',
  blue:   '#CFE6FF',
  green:  '#D1F0D6',
  pink:   '#FFD6E1',
}

const COLOR_BORDER: Record<StickyColor, string> = {
  yellow: '#E6D266',
  blue:   '#86B6E0',
  green:  '#88C997',
  pink:   '#E89AB1',
}

export function StickyNode({ data, selected }: NodeProps<RFStickyNode>) {
  return (
    <div
      className="sticky-node"
      data-selected={selected ? 'true' : 'false'}
      style={{
        background: COLOR_BG[data.color],
        borderColor: COLOR_BORDER[data.color],
        width: data.width,
        height: data.height,
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={120}
        minHeight={60}
        lineStyle={{ borderColor: COLOR_BORDER[data.color] }}
        handleStyle={{
          width: 8,
          height: 8,
          background: '#ffffff',
          borderColor: COLOR_BORDER[data.color],
        }}
      />
      <div className="text">{data.text}</div>

      <style jsx>{`
        .sticky-node {
          border-radius: var(--radius--md, 6px);
          border: 1px solid;
          padding: var(--spacing--2xs);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          font-size: var(--font-size--sm, 13px);
          color: var(--color--neutral-800);
          line-height: 1.4;
          white-space: pre-wrap;
          overflow: hidden;
        }
        .sticky-node[data-selected='true'] {
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </div>
  )
}
