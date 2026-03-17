/* eslint-disable react/prop-types */

import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { HiPencil, HiSquare2Stack, HiTrash } from 'react-icons/hi2';
import { formatCurrency } from '../../utils/helpers';
import CreateCabinForm from './CreateCabinForm';
import { useCreateCabin } from './useCreateCabin';
import { useDeleteCabin } from './useDeleteCabin';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;

const CabinLink = styled.span`
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  color: ${(p) => (p.$disabled ? 'var(--color-grey-400)' : 'var(--color-brand-600)')};
  text-decoration: ${(p) => (p.$disabled ? 'none' : 'underline')};
  text-underline-offset: 3px;
  transition: color 0.2s;

  &:hover {
    color: ${(p) => (p.$disabled ? 'var(--color-grey-400)' : 'var(--color-brand-700)')};
  }
`;

const BookedBadge = styled.span`
  display: inline-block;
  margin-left: 0.6rem;
  padding: 0.2rem 0.7rem;
  background-color: var(--color-red-100);
  color: var(--color-red-700);
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 100px;
  vertical-align: middle;
  letter-spacing: 0.3px;
`;

const CabinRow = ({ cabin, canManage = false, isBooked = false }) => {
  const navigate = useNavigate();
  const { createCabin } = useCreateCabin();
  const { isDeleting, deleteCabin } = useDeleteCabin();

  const {
    id: cabinId,
    cabinNumber,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
    description,
  } = cabin;

  const handleDuplicate = () => {
    createCabin({
      name: `Copy of ${name}`,
      maxCapacity,
      regularPrice,
      discount,
      image,
      description,
    });
  };

  const handleNavigate = () => {
    if (!isBooked) navigate(`/cabins/${cabinId}`);
  };

  return (
    <Table.Row>
      <Img src={image} alt={name} />
      <Cabin>
        <CabinLink $disabled={isBooked} onClick={handleNavigate}>
          {name}
          {isBooked && <BookedBadge>Booked</BookedBadge>}
        </CabinLink>
        {cabinNumber && (
          <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 400, color: 'var(--color-grey-400)' }}>
            #{cabinNumber}
          </span>
        )}
      </Cabin>
      <div>Fits up to {maxCapacity} guests</div>
      <Price>{formatCurrency(regularPrice)} USD</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      {canManage && (
        <div>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={cabinId} />

              <Menus.List id={cabinId}>
                <Menus.Button icon={<HiSquare2Stack />} onClick={handleDuplicate}>
                  Duplicate
                </Menus.Button>

                <Modal.Open opens='edit'>
                  <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                </Modal.Open>

                <Modal.Open opens='delete'>
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              </Menus.List>
            </Menus.Menu>

            <Modal.Window name='edit'>
              <CreateCabinForm cabinToEdit={cabin} />
            </Modal.Window>

            <Modal.Window name='delete'>
              <ConfirmDelete
                resourceName='cabins'
                disabled={isDeleting}
                onConfirm={() => deleteCabin(cabinId)}
              />
            </Modal.Window>
          </Modal>
        </div>
      )}
    </Table.Row>
  );
};

export default CabinRow;
