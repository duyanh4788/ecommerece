import React, { ChangeEvent } from 'react';
import { Box, Checkbox, Typography } from '@mui/material';
import { EntityFunituresInterface, formInputFunitures } from 'interface/Items.mode';

interface Props {
  items: EntityFunituresInterface | null;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  nameProduct: string | undefined;
}

export const FormFunitures = ({ items, handleChange, nameProduct }: Props) => {
  return (
    <Box className="box_add_item">
      {formInputFunitures.map(item => (
        <input
          type={item.type}
          key={item.key}
          placeholder={item.placeholder}
          name={item.name}
          value={(items && items[item.name]) || ''}
          onChange={handleChange}
        />
      ))}
      <Typography variant="caption">
        Warnty <Checkbox defaultChecked value={items?.warranty} onChange={handleChange} />
      </Typography>
      <Box textAlign={'center'}>{nameProduct}</Box>
    </Box>
  );
};
