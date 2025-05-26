import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Section,
} from '@react-email/components';

interface FileOtpProps {
  email: string;
  otp: string;
}


const FileAccessOtp = ({ email = 'example@gmail.com', otp = 'adfaA123' }: FileOtpProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your OTP to access the file on SendIt</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={{ marginBottom: '32px' }}>
            <Text style={styles.logo}>📤 SendIt</Text>
            <Text style={styles.heading}>Your OTP to Access File</Text>
            <Text style={styles.subtext}>
              Hi <strong>{email}</strong>, you requested to download a file from SendIt.
            </Text>
            <Text style={styles.subtext}>
              Please use the following One-Time Password (OTP) to access and download the file:
            </Text>
            <Text style={styles.otp}>{otp}</Text>
            <Text style={styles.subtext}>
              This OTP is valid for a limited time and can only be used once.
            </Text>
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
  otp: {
    fontSize: '20px',
    fontWeight: 'bold',
    backgroundColor: '#DFDFD6',
    color: '#1B1B1F',
    padding: '10px 20px',
    borderRadius: '8px',
    textAlign: 'center' as const,
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


export default FileAccessOtp;
