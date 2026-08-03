import QRCode from "react-qr-code";

export default function QRCodeCard({
  url,
  size = 300,
}) {
  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        No URL provided.
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-lg bg-white p-4">
        <QRCode
          value={url}
          size={size}
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="M"
        />
      </div>
    </div>
  );
}