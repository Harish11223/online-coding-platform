interface Tab {
  key: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export default function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex gap-6 border-b border-slate-800">
      {tabs.map((t) => (
        <button
          type="button"
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`pb-2 ${
            active === t.key
              ? "text-indigo-400 border-b-2 border-indigo-400"
              : "text-slate-500"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
