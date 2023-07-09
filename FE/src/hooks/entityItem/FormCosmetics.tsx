import React, { ChangeEvent } from 'react';
import { Box } from '@mui/material';
import { EntityCosmeticsInterface, formInputCosmetics } from 'interface/Items.mode';

interface Props {
  items: EntityCosmeticsInterface | null;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  nameProduct: string | undefined;
}

export const FormCosmetics = ({ items, handleChange, nameProduct }: Props) => {
  return (
    <Box className="box_add_item">
      {formInputCosmetics.map(item => (
        <input
          type={item.type}
          key={item.key}
          placeholder={item.placeholder}
          name={item.name}
          value={(items && items[item.name]) || ''}
          onChange={handleChange}
        />
      ))}
      <Box textAlign={'center'}>{nameProduct}</Box>
    </Box>
  );
};
