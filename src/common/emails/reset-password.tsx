import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Button,
  Section,
} from '@react-email/components';


const ResetPassword = ({ email = 'user@example.com', resetUrl = '' }) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your SendIt password</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={{ marginBottom: '32px' }}>
            <Text style={styles.logo}>📤 SendIt</Text>
            <Text style={styles.heading}>Reset your Password</Text>
            <Text style={styles.subtext}>
              We&apos;ve received a request to reset the password for your SendIt account associated with <strong>{email}</strong>.
            </Text>
            <Button style={styles.button} href={resetUrl}>
              Reset Password
            </Button>
            <Text style={styles.subtext}>
              If the button doesn&apos;t work, copy and paste this URL into your browser:
            </Text>
            <Text style={styles.link}>{resetUrl}</Text>
            <Text style={styles.footer}>
              Built with 💌 by <a href="https://aayushmaan-soni.vercel.app" style={styles.link}>Aayushmaan Soni</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  body: {
    backgroundColor: '#1B1B1F',
    color: '#DFDFD6',
    fontFamily: 'monospace',
    padding: '20px',
  },
  container: {
    backgroundColor: '#161618',
    border: '1px solid #3C3F44',
    borderRadius: '10px',
    padding: '40px',
    paddingBottom: '0px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '20px 0 10px',
  },
  subtext: {
    fontSize: '14px',
    margin: '12px 0',
    lineHeight: '1.5',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#DFDFD6',
    color: '#1B1B1F',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    margin: '20px 0',
  },
  link: {
    fontSize: '12px',
    color: '#999',
    wordBreak: 'break-word',
  } as const,
  footer: {
    fontSize: '12px',
    color: '#98989F',
    marginTop: '32px',
    textAlign: 'center' as const,
  },
};


export default ResetPassword;
