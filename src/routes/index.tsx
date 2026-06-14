import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { Preloader } from "@/components/grad/Preloader";
import { MaskedHero } from "@/components/grad/MaskedHero";
import { PhotoScenes } from "@/components/grad/PhotoScenes";
import { Celebration } from "@/components/grad/Celebration";
import { Finale } from "@/components/grad/Finale";
import { Cursor } from "@/components/grad/Cursor";
import { Marquee } from "@/components/grad/Marquee";
import { SmoothScroll } from "@/components/grad/SmoothScroll";
import { CelebrationProvider } from "@/context/CelebrationContext";
import { CelebrationGallery } from "@/components/grad/CelebrationGallery";

const ParticleField = lazy(() =>
  import("@/components/grad/ParticleField").then((m) => ({ default: m.ParticleField }))
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Class of 2026 · A Cinematic Graduation Love Letter" },
      { name: "description", content: "A cinematic, scroll-driven celebration of two graduates and the beautiful journey they share." },
      { property: "og:title", content: "Class of 2026 · A Cinematic Graduation Love Letter" },
      { property: "og:description", content: "An immersive, cinematic tribute to a couple graduating together." },
    ],
  }),
  component: Index,
});

function Index() {
  const [ready, setReady] = useState(false);

  return (
    <CelebrationProvider>
      <SmoothScroll>
        <main className="relative grain vignette letterbox min-h-screen overflow-x-hidden bg-background text-foreground">
          <Preloader onDone={() => setReady(true)} />
          <Cursor />
          <Suspense fallback={null}>{ready && <ParticleField />}</Suspense>

          <MaskedHero ready={ready} />

          <div className="band-cream">
            <Marquee text="congratulations · class of 2026 · together · forever" speed={55} />
          </div>

          <PhotoScenes />

          <div className="band-cream">
            <Marquee text="love · growth · becoming · home" speed={45} reverse />
          </div>

          <Celebration />
          <Finale />
          <CelebrationGallery />

          <footer className="relative z-10 px-6 py-12 text-center text-xs uppercase tracking-[0.4em] text-white/40">
            made with love by Ayan · 2026
          </footer>
        </main>
      </SmoothScroll>
    </CelebrationProvider>
  );
}
