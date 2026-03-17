import Heading from '../ui/Heading';
import Row from '../ui/Row';
import BookingTable from '../features/bookings/BookingTable';
import BookingTableOperations from '../features/bookings/BookingTableOperations';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import CreateBookingForm from '../features/bookings/CreateBookingForm';

const Bookings = () => {
  return (
    <>
      <Row type='horizontal'>
        <Heading as='h1'>All bookings</Heading>
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
          <BookingTableOperations />
          <Modal>
            <Modal.Open opens='new-booking'>
              <Button>+ New booking</Button>
            </Modal.Open>
            <Modal.Window name='new-booking'>
              <CreateBookingForm />
            </Modal.Window>
          </Modal>
        </div>
      </Row>
      <BookingTable />
    </>
  );
};

export default Bookings;
