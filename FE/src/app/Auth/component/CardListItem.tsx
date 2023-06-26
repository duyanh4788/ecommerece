/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';

interface Props {
  title: string;
  name: string;
  value: string | number | any;
  selectData?: any;
  handleOnChange?: (e: any) => any;
}

export const CardListItem = (props: Props) => {
  const { title, name, value, handleOnChange, selectData } = props;
  const [parseProduct, setParseProduct] = useState<any[]>([]);

  useEffect(() => {
    function initProduct(dataSell: any[], data: any[]) {
      if (!dataSell.length) {
        setParseProduct(data);
      }
      if (dataSell.length === data.length) {
        setParseProduct(dataSell);
      }
      if (dataSell.length && dataSell.length !== data.length) {
        let result: any[] = [];
        for (let itemA of data as any[]) {
          const find = dataSell.find((itemB: any) => itemB.id === itemA.id);
          if (!find) {
            result.push(itemA);
          }
        }
        setParseProduct([...dataSell, ...result]);
      }
    }
    if (selectData) {
      initProduct(selectData.prodcutSell, selectData.products);
    }
  }, [selectData?.prodcutSell, selectData?.products]);

  const renderChip = (selected: any[]) => {
    return selected.map(value => (
      <Chip
        key={value.id}
        label={value.nameProduct}
        size="small"
        avatar={<Avatar src={value.avatar} alt={value.avatar} />}
      />
    ));
  };

  return (
    <ListItem>
      <ListItemText sx={{ width: '30%' }}>
        <Typography variant="inherit">{title}:</Typography>
      </ListItemText>
      <ListItemText sx={{ width: '70%' }}>
        {selectData ? (
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            autoWidth
            value={selectData.prodcutSell}
            variant="outlined"
            sx={{ width: '100%', height: '30px', border: '1px solid #cdcdcd5c' }}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            onChange={handleOnChange}
            renderValue={selected => {
              if (selected.length > 2) {
                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {renderChip(selected.slice(0, 1))}
                    <Chip
                      label={`+${selectData.prodcutSell.length - selected.slice(0, 1).length}`}
                      size="small"
                    />
                  </Box>
                );
              }
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {renderChip(selected)}
                </Box>
              );
            }}>
            {parseProduct.map(item => {
              return (
                <MenuItem key={item.id} value={item}>
                  <Avatar
                    alt={item.avatar}
                    src={item.avatar}
                    sx={{ width: '20px', height: '20px', marginRight: '5px' }}
                  />
                  <ListItemText primary={item.nameProduct} />
                </MenuItem>
              );
            })}
          </Select>
        ) : (
          <input
            type={name === 'phone' ? 'number' : 'text'}
            pattern={name === 'phone' ? '[0-9]{10}' : undefined}
            maxLength={name === 'phone' ? 10 : 20}
            name={name}
            value={value}
            onChange={handleOnChange}
          />
        )}
      </ListItemText>
    </ListItem>
  );
};
