function Footer() {
  return (
    <footer style={{
      width: '100%',
      padding: '2rem 0',
      marginTop: '4rem',
      borderTop: '1px solid #e5e7eb',
      textAlign: 'center',
      backgroundColor: '#f9fafb'
    }}>
      <p style={{
        margin: 0,
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        © {new Date().getFullYear()} Martin Žust. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
