export default function HomePage() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', textAlign: 'center', lineHeight: '1.6' }}>
      <h1 style={{ color: '#4F46E5' }}>⚡ AuraMart E-Commerce Backend API</h1>
      <p style={{ fontSize: '18px', color: '#374151' }}>
        The backend API server is running successfully on port 5000.
      </p>
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#F3F4F6', borderRadius: '12px', display: 'inline-block' }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 10px 0' }}> Looking for the UI Storefront?</p>
        <a 
          href="http://localhost:5173" 
          style={{ 
            display: 'inline-block', 
            backgroundColor: '#4F46E5', 
            color: '#ffffff', 
            padding: '12px 24px', 
            borderRadius: '8px', 
            textDecoration: 'none', 
            fontWeight: '600' 
          }}
        >
          Open Frontend Storefront (http://localhost:5173) &rarr;
        </a>
      </div>
    </div>
  );
}
