import React from 'react';
import { ListItem, ListItemText, Typography } from '@mui/material';

interface Props {
  title: string;
  name: string;
  value: string | number | any;
  handleOnChange?: (e: any) => any;
}

export const CardListItem = (props: Props) => {
  const { title, name, value, handleOnChange } = props;
  return (
    <ListItem>
      <ListItemText sx={{ width: '30%' }}>
        <Typography variant="inherit">{title}:</Typography>
      </ListItemText>
      <ListItemText sx={{ width: '70%' }}>
        <input
          type={name === 'phone' ? 'number' : 'text'}
          pattern={name === 'phone' ? '[0-9]{10}' : undefined}
          maxLength={name === 'phone' ? 10 : 20}
          name={name}
          value={value}
          onChange={handleOnChange}
        />
      </ListItemText>
    </ListItem>
  );
};
