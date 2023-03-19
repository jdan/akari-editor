"use client";
import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface Surface {
  x: number;
  y: number;
  label: "empty" | 0 | 1 | 2 | 3 | 4;
}

// 189, 189, 189
const gridColor = "#bdbdbd";
// 229, 229, 229
const surfaceColor = "#e5e5e5";

export function Editor() {
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(4);
  const [focus, setFocus] = useState<{ x: number; y: number } | undefined>({
    x: 0,
    y: 0,
  });
  const [surfaces, setSurfaces] = useState<Array<Surface>>([]);

  const handleClick = useCallback(
    (x: number, y: number) => {
      setFocus({ x, y });
      const hasSurface = surfaces.find((s) => s.x === x && s.y === y);
      if (hasSurface) {
        setSurfaces(surfaces.filter((s) => s.x !== x || s.y !== y));
      } else {
        setSurfaces([...surfaces, { x, y, label: "empty" }]);
      }
    },
    [surfaces]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!focus) {
        return;
      }

      const { x, y } = focus;
      const surface = surfaces.find((s) => s.x === x && s.y === y);
      if (!surface) {
        return;
      }

      const keyNum = parseInt(e.key);

      if (
        keyNum === 0 ||
        keyNum === 1 ||
        keyNum === 2 ||
        keyNum === 3 ||
        keyNum === 4
      ) {
        setSurfaces(
          surfaces.map((s) => {
            if (s.x === x && s.y === y) {
              return { ...s, label: keyNum };
            }
            return s;
          })
        );
      } else if (e.key === "Backspace") {
        setSurfaces(
          surfaces.map((s) => {
            if (s.x === x && s.y === y) {
              return { ...s, label: "empty" };
            }
            return s;
          })
        );
      }
    },
    [surfaces, focus]
  );

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent): void {
      if (
        event.target instanceof HTMLElement &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setFocus(undefined);
      }
    }
    // Bind the event listener
    // @ts-ignore
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      // @ts-ignore
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div
      ref={wrapperRef}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)`,
        gap: 1,
        background: gridColor,
        border: `1px solid ${gridColor}`,
      }}
      onKeyDown={handleKeyDown}
    >
      {Array.from({ length: width * height }).map((_, i) => {
        const x = i % width;
        const y = Math.floor(i / width);
        const surface = surfaces.find((s) => s.x === x && s.y === y);
        const isFocused = focus?.x === x && focus?.y === y;
        return (
          <button
            key={i}
            onClick={() => handleClick(x, y)}
            style={{
              border: "none",
              backgroundColor: surface ? "black" : surfaceColor,
              color: "white",
              width: 40,
              height: 40,
              outline: isFocused ? "4px solid #66b5ff" : "none",
              zIndex: isFocused ? 1 : 0,
              fontSize: 24,
            }}
          >
            {surface && surface.label !== "empty" ? surface.label : null}
          </button>
        );
      })}
    </div>
  );
}
