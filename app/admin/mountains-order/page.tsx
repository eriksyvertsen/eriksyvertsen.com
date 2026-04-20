"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Entry {
  slug: string;
  title: string;
  order: number;
  path: string;
}

function DragHandle() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      style={{ flexShrink: 0, color: "#8A8580", cursor: "grab" }}
      aria-hidden
    >
      <circle cx="5" cy="4" r="1.5" />
      <circle cx="11" cy="4" r="1.5" />
      <circle cx="5" cy="8" r="1.5" />
      <circle cx="11" cy="8" r="1.5" />
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="11" cy="12" r="1.5" />
    </svg>
  );
}

function SortableRow({ entry, index }: { entry: Entry; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: entry.slug });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "14px 20px",
        background: isDragging ? "#F4F1ED" : "#FAF8F5",
        border: "1px solid",
        borderColor: isDragging ? "#3D6B99" : "#E5E0DB",
        marginBottom: "6px",
        boxShadow: isDragging ? "0 4px 16px rgba(0,0,0,0.1)" : "none",
        zIndex: isDragging ? 10 : "auto",
        position: "relative",
        userSelect: "none",
      }}
    >
      <div {...attributes} {...listeners} style={{ display: "flex", alignItems: "center" }}>
        <DragHandle />
      </div>
      <span
        style={{
          fontFamily: "Verdana, Geneva, sans-serif",
          fontSize: "12px",
          color: "#8A8580",
          width: "20px",
          flexShrink: 0,
        }}
      >
        {index + 1}
      </span>
      <span
        style={{
          fontFamily: "Verdana, Geneva, sans-serif",
          fontSize: "14px",
          color: "#2C2825",
          flex: 1,
        }}
      >
        {entry.title}
      </span>
      <span
        style={{
          fontFamily: "Verdana, Geneva, sans-serif",
          fontSize: "11px",
          color: "#8A8580",
        }}
      >
        {entry.slug}
      </span>
    </div>
  );
}

export default function MountainsOrderPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/mountains-order");
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to load");
      }
      setEntries(await res.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setEntries((prev) => {
      const oldIndex = prev.findIndex((e) => e.slug === active.id);
      const newIndex = prev.findIndex((e) => e.slug === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
    setDirty(true);
    setStatus("idle");
  }

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const updates = entries.map((e, i) => ({ path: e.path, order: i + 1 }));
      const res = await fetch("/api/admin/mountains-order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Save failed");
      }
      setStatus("saved");
      setDirty(false);
      // Refresh to show updated order values
      await load();
    } catch (e) {
      setStatus("error");
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF8F5",
        padding: "48px 32px",
        maxWidth: "680px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
          <a
            href="/keystatic/branch/main/collection/mountains"
            style={{
              fontFamily: "Verdana, Geneva, sans-serif",
              fontSize: "12px",
              color: "#3D6B99",
              textDecoration: "none",
            }}
          >
            ← Back to Mountains
          </a>
        </div>
        <h1
          style={{
            fontFamily: "'Gill Sans', sans-serif",
            fontSize: "28px",
            fontWeight: 400,
            color: "#2C2825",
            margin: "0 0 8px",
          }}
        >
          Reorder Mountains
        </h1>
        <p
          style={{
            fontFamily: "Verdana, Geneva, sans-serif",
            fontSize: "13px",
            color: "#8A8580",
            margin: 0,
          }}
        >
          Drag rows to set display order. Save to commit changes to GitHub.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <p style={{ fontFamily: "Verdana, Geneva, sans-serif", fontSize: "13px", color: "#8A8580" }}>
          Loading…
        </p>
      ) : error ? (
        <div>
          <p style={{ fontFamily: "Verdana, Geneva, sans-serif", fontSize: "13px", color: "#c0392b" }}>
            {error}
          </p>
          {error.includes("GITHUB_TOKEN") && (
            <p style={{ fontFamily: "Verdana, Geneva, sans-serif", fontSize: "12px", color: "#8A8580", marginTop: "8px" }}>
              Add a GitHub personal access token with <code>contents:write</code> permission
              as <code>GITHUB_TOKEN</code> in your Vercel environment variables.
            </p>
          )}
        </div>
      ) : entries.length === 0 ? (
        <p style={{ fontFamily: "Verdana, Geneva, sans-serif", fontSize: "13px", color: "#8A8580" }}>
          No mountain entries found.
        </p>
      ) : (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={entries.map((e) => e.slug)} strategy={verticalListSortingStrategy}>
              {entries.map((entry, i) => (
                <SortableRow key={entry.slug} entry={entry} index={i} />
              ))}
            </SortableContext>
          </DndContext>

          {/* Save bar */}
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              style={{
                fontFamily: "Verdana, Geneva, sans-serif",
                fontSize: "13px",
                padding: "10px 24px",
                background: dirty ? "#3D6B99" : "#E5E0DB",
                color: dirty ? "#FAF8F5" : "#8A8580",
                border: "none",
                cursor: dirty ? "pointer" : "default",
                transition: "background 200ms ease",
              }}
            >
              {saving ? "Saving…" : "Save order"}
            </button>

            {status === "saved" && (
              <span style={{ fontFamily: "Verdana, Geneva, sans-serif", fontSize: "12px", color: "#2E7D52" }}>
                ✓ Saved — changes committed to GitHub
              </span>
            )}
            {status === "error" && (
              <span style={{ fontFamily: "Verdana, Geneva, sans-serif", fontSize: "12px", color: "#c0392b" }}>
                Error saving. Check console.
              </span>
            )}
            {dirty && status === "idle" && (
              <span style={{ fontFamily: "Verdana, Geneva, sans-serif", fontSize: "12px", color: "#8A8580" }}>
                Unsaved changes
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
