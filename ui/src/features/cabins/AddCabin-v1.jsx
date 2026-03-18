import { useState } from 'react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import CreateCabinForm from './CreateCabinForm';

const AddCabin = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleClose = () => {
    setIsOpenModal(false);
  };

  return (
    <div>
      <Button onClick={() => setIsOpenModal((show) => !show)}>
        Add new cabin
      </Button>
      {isOpenModal && (
        <Modal onClose={handleClose}>
          <CreateCabinForm onCloseModal={handleClose} />
        </Modal>
      )}
    </div>
  );
};

export default AddCabin;
