import React from "react";

// Two big soft colour blobs drifting behind the menu, in derived pop
// colours. Fixed, transform-only animation, still for reduced motion.
export default function Blobs() {
  return (
    <div className="cv-blobs" aria-hidden="true">
      <span className="cv-blob cv-blob-a" />
      <span className="cv-blob cv-blob-b" />
    </div>
  );
}
