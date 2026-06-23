"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { Citation } from "@/components/shared/Citation";

function CitationNodeView({ node }: NodeViewProps) {
  const { n, label } = node.attrs as { n: number; label: string; sourceId: string };
  return (
    <NodeViewWrapper as="span" className="inline">
      <Citation n={n} label={label} />
    </NodeViewWrapper>
  );
}

export const CitationNode = Node.create({
  name: "citation",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      n: { default: 1 },
      label: { default: "" },
      sourceId: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-citation]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes({ "data-citation": true }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CitationNodeView);
  },
});
