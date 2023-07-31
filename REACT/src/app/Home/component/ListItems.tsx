import { Info, ShoppingCartSharp } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { BANNER_SHOP } from 'commom/common.contants';
import { AppHelper } from 'utils/app.helper';
import { ItemsInterface } from 'interface/Items.mode';
import { useNavigate } from 'react-router-dom';

interface Props {
  items: ItemsInterface[];
}
export const ListItems = ({ items }: Props) => {
  if (!items.length) return;
  const naviage = useNavigate();
  return items.map((item, idx) => {
    return (
      <Grid item xs={6} sm={3} md={2} key={idx}>
        <Card className="card_profile">
          <CardHeader
            action={
              <IconButton onClick={() => naviage(`/item-details/${item.id}`)}>
                <Info sx={{ fontSize: '15px' }} color="info" />
              </IconButton>
            }
            title={
              <Tooltip title={item.nameItem}>
                <Typography variant="caption" display="block" gutterBottom>
                  {AppHelper.textTruncate(item?.nameItem as string)}
                </Typography>
              </Tooltip>
            }
            subheader={
              <Typography variant="caption" display="block" gutterBottom>
                Stock: {item?.quantityStock}
              </Typography>
            }
          />
          <CardMedia
            component="img"
            height="30"
            src={item?.itemThumb?.length ? item?.itemThumb[0] : BANNER_SHOP}
          />
          <CardContent sx={{ padding: '0', paddingBottom: '0 !important' }}>
            <Box display={'flex'} p={1} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="caption" display="block" gutterBottom margin={0} lineHeight={0}>
                Sold: {item?.quantitySold}{' '}
              </Typography>
              <Chip label={`${item.prices} $`} size="small" variant="outlined" />
            </Box>
            <Box textAlign={'center'}>
              <ShoppingCartSharp fontSize="medium" color="success" sx={{ cursor: 'pointer' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  });
};
