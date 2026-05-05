// src/components/ui/Home.jsx
export default function Home() {
  return (
    <section className="section" id="home">
      <div style={{ maxWidth: '800px' }}>
        <p className="label-caps" style={{ marginBottom: '16px' }}>System Online // 01</p>
        <h1 className="display-2xl">Alpha Sketcher</h1>
        <p style={{ fontSize: '18px', lineHeight: '160%', marginTop: '24px', opacity: 0.8 }}>
          A cinematic intersection of Web3 aesthetics, luxury design, and 3D technical mastery.
        </p>
        <button className="btn-primary" style={{ marginTop: '48px' }}>
          Explore Portfolio
        </button>
      </div>
    </section>
  );
}