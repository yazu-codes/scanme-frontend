import LanguageSelector from "./LanguageSelector";

export default function LocalCard({
  size = 300,
}) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-lg bg-white p-4">
        <LanguageSelector />
      </div>
    </div>
  );
}