import { KiteLoader } from "./components/kite/KiteLoader";
import { KiteLogo } from "./components/kite/KiteLogo";
import { KitePageLoader } from "./components/kite/KitePageLoader";
import { Loading } from "./components/loading/Loading";

import "./App.css";

function App() {
  return (
    <main className="kite-fu-showcase">
      <section className="kite-fu-hero">
        <p className="kite-fu-eyebrow">FlyUI</p>
        <h1>Kite loading components for production-ready apps.</h1>
        <p>
          Import and use directly with zero extra setup. All styles are isolated
          via CSS Modules to avoid host-app conflicts.
        </p>
        <div className="kite-fu-actions">
          <KiteLogo size="lg" />
        </div>
      </section>

      <section className="kite-fu-grid">
        <div className="kite-fu-panel">
          <h3>KiteLoader</h3>
          <KiteLoader label="Loading panel data..." />
        </div>
        <div className="kite-fu-panel">
          <h3>Loading (3 dots)</h3>
          <Loading />
        </div>
      </section>

      <section className="kite-fu-pagePreview">
        <KitePageLoader
          message="Bootstrapping FlyUI demo..."
          className="kite-fu-demoPageLoader"
        />
      </section>
    </main>
  );
}

export default App;
