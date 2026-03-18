import Heading from '../components/Heading';
import Row from '../components/Row';
import CabinTable from '../features/cabins/CabinTable';
import AddCabin from '../features/cabins/AddCabin';
import CabinTableOperations from '../features/cabins/CabinTableOperations';

const Cabins = () => {
  return (
    <>
      <Row type='horizontal'>
        <Heading as='h1'>All cabins</Heading>
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
          <CabinTableOperations />
          <AddCabin />
        </div>
      </Row>

      <Row>
        <CabinTable />
      </Row>
    </>
  );
};

export default Cabins;
