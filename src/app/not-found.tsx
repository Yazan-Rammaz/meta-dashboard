import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f8f8',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}
    >
      <h1 style={{ fontSize: '4em', margin: '0', color: '#555' }}>404</h1>
      <h2 style={{ fontSize: '1.5em', margin: '10px 0 20px' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: '1em', margin: '0 0 20px' }}>
        Could not find the requested resource
      </p>
      <Link
        href="/"
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '1em'
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
