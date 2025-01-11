export const NotFoundPage = () => {
    return (
      <div style={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '4rem',
          marginBottom: '1rem'
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '2rem'
        }}>
          Page Not Found
        </h2>
        <p style={{
          fontSize: '1.2rem',
          maxWidth: '600px',
          lineHeight: '1.6'
        }}>
          Oops! The page you're looking for doesn't exist. Please check the URL and try again.
        </p>
      </div>
    )
  }