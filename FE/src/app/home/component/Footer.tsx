import React from 'react';
import { Avatar, Chip, Grid, Typography, Box } from '@mui/material';
import { FOOTER, FOOTER_INFOR } from 'commom/common.contants';
import { styled } from '@mui/material/styles';

const Div = styled('h1')(({ theme }) => ({
  ...theme.typography.button,
  padding: theme.spacing(1),
  fontWeight: 'bolder',
  fontSize: '20px',
}));

export const Footer = () => {
  const renderImgaes = valueB => {
    return (
      <Chip
        avatar={<Avatar alt={valueB.img} src={valueB.img} />}
        label={valueB.item}
        variant="outlined"
        color="success"
        sx={{ width: 105, cursor: 'pointer' }}
      />
    );
  };
  return (
    <div className="footer">
      <Grid container sx={{ justifyContent: 'center' }} columns={{ xs: 3, sm: 8, md: 12 }}>
        {FOOTER.map((value, idx) => {
          if (value.key === 1) {
            return (
              <Grid item xs={2} sm={4} md={3} key={value.key} className="gird">
                {value.valueArr.map(valueC => (
                  <Typography
                    variant="h6"
                    mt={2}
                    mb={2}
                    gutterBottom
                    key={valueC.key}
                    style={{ fontWeight: 'bolder' }}>
                    {valueC.item}
                  </Typography>
                ))}
                <img alt={FOOTER_INFOR.nodejs} src={FOOTER_INFOR.nodejs} width={100} height={100} />
              </Grid>
            );
          }
          return (
            <Grid item xs={2} sm={4} md={3} key={value.key} className="gird">
              <Div>{value.item}</Div>
              {value.valueArr.map(valueB => (
                <Box key={valueB.key} sx={{ marginBottom: '5px' }}>
                  {value.key === 4 ? (
                    <a target="_blank" rel="noreferrer" href={valueB.link}>
                      {renderImgaes(valueB)}
                    </a>
                  ) : value.key === 2 ? (
                    renderImgaes(valueB)
                  ) : (
                    <img alt={valueB.img} src={valueB.img} width={100} />
                  )}
                </Box>
              ))}
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};
