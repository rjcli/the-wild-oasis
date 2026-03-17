import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useMoveBack = () => {
  const navigate = useNavigate();
  return useCallback(() => navigate(-1), [navigate]);
};
