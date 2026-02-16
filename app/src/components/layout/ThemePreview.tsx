interface ThemePreviewProps {
  swatches: [string, string, string];
}

export function ThemePreview({ swatches }: ThemePreviewProps) {
  return (
    <div className="flex items-center gap-1">
      {swatches.map((color, i) => (
        <div
          key={i}
          className="h-4 w-4 rounded-full border border-border"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
