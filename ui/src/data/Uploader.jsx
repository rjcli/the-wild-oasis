import { useState } from 'react';
import Button from '../components/Button';

const Uploader = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadAll = async () => {
    setIsLoading(true);
    alert(
      'Use the API seed command: npm run prisma:seed (from the api folder).',
    );
    setIsLoading(false);
  };

  const uploadBookings = async () => {
    setIsLoading(true);
    alert('Bookings are now seeded from the backend. Run: npm run prisma:seed');
    setIsLoading(false);
  };

  return (
    <div
      style={{
        marginTop: 'auto',
        backgroundColor: '#e0e7ff',
        padding: '8px',
        borderRadius: '5px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <h3>SAMPLE DATA</h3>

      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL
      </Button>

      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload bookings ONLY
      </Button>
    </div>
  );
};

export default Uploader;
