import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import CreateCabinForm from './CreateCabinForm';
import { useCurrentUser } from '../authentication/useCurrentUser';

const AddCabin = () => {
  const { user } = useCurrentUser();
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) return null;

  return (
    <div>
      <Modal>
        <Modal.Open opens='cabin-form'>
          <Button>Add new cabin</Button>
        </Modal.Open>
        <Modal.Window name='cabin-form'>
          <CreateCabinForm />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddCabin;
