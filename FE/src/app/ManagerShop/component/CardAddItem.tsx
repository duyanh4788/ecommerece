/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, RefObject, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ItemSlice from 'store/items/shared/slice';
import * as ItemSelector from 'store/items/shared/selectors';
import * as ShopSelector from 'store/shops/shared/selectors';
import { Cancel, Done } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { FileUpload, FileUploadProps } from 'hooks/component/FileUpload';
import {
  EntityClothesIntersface,
  EntityCosmeticsInterface,
  EntityElectronicsInterface,
  EntityFunituresInterface,
  ValuesItems,
  ItemsType,
  formInputItem,
} from 'interface/Items.mode';
import { BANNER_SHOP } from 'commom/common.contants';
import { FormClosthers } from 'hooks/entityItem/FormClosthers';
import { FormCosmetics } from 'hooks/entityItem/FormCosmetics';
import { FormElectronics } from 'hooks/entityItem/FormElectronics';
import { FormFunitures } from 'hooks/entityItem/FormFunitures';
import { SwipersList } from 'hooks/component/SwipersList';

interface Props {
  setAddItem: (e: boolean) => void;
  resetDataRefItems: RefObject<boolean | null>;
}

export const CardAddItem = ({ setAddItem, resetDataRefItems }: Props) => {
  const dispatch = useDispatch();
  const shopInfor = useSelector(ShopSelector.selectShopInfor);
  const url = useSelector(ItemSelector.selectUrl);
  const [items, setItems] = useState<ValuesItems | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [typeProduct, setTypeProduct] = useState<string | null>(
    (shopInfor?.prodcutSell && shopInfor?.prodcutSell[0].nameProduct?.toUpperCase()) || null,
  );
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (resetDataRefItems.current) {
      resetData();
      const newResetData = false;
      Object.assign(resetDataRefItems, { current: newResetData });
    }
  }, [resetDataRefItems.current]);

  const resetData = () => {
    setAddItem(false);
    setItems(null);
    setSelectedIndex(0);
    setAnchorEl(null);
    setTypeProduct(null);
  };

  const handleMenuItemClick = (index: number, productId: string, nameProduct: string) => {
    setSelectedIndex(index);
    setTypeProduct(nameProduct.toUpperCase());
    setAnchorEl(null);
    setItems({ ...items, productId });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    }: any = event;
    setItems(prevItems => ({ ...prevItems, [name]: value }));
  };

  const fileUploadProp: FileUploadProps = {
    accept: 'image/*',
    idInput: 'input-shop',
    onChange: (newFormData: FormData | null) => {
      dispatch(ItemSlice.actions.uploadFile(newFormData));
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      const { files }: any = event.dataTransfer;
      if (files !== null && files.length > 0) {
        const formData = new FormData();
        formData.append('file', files.length === 1 ? files[0] : files);
        dispatch(ItemSlice.actions.uploadFile(formData));
      }
    },
  };

  const renderFormEntity = () => {
    switch (typeProduct) {
      case ItemsType.CLOTHES:
        return (
          <FormClosthers
            items={items}
            handleChange={handleChange}
            nameProduct={
              shopInfor?.prodcutSell &&
              (shopInfor?.prodcutSell[selectedIndex].nameProduct as string)
            }
          />
        );
      case ItemsType.ELECTRONICS:
        return (
          <FormElectronics
            items={items}
            handleChange={handleChange}
            nameProduct={
              shopInfor?.prodcutSell &&
              (shopInfor?.prodcutSell[selectedIndex].nameProduct as string)
            }
          />
        );
      case ItemsType.COSMETICS:
        return (
          <FormCosmetics
            items={items}
            handleChange={handleChange}
            nameProduct={
              shopInfor?.prodcutSell &&
              (shopInfor?.prodcutSell[selectedIndex].nameProduct as string)
            }
          />
        );
      case ItemsType.FUNITURES:
        return (
          <FormFunitures
            items={items}
            handleChange={handleChange}
            nameProduct={
              shopInfor?.prodcutSell &&
              (shopInfor?.prodcutSell[selectedIndex].nameProduct as string)
            }
          />
        );
      default:
        break;
    }
  };

  const handleDone = () => {
    if (!shopInfor || !shopInfor?.prodcutSell?.length) return;
    const itemsPayload = {
      shopId: shopInfor?.id,
      productId: shopInfor?.prodcutSell[selectedIndex].id,
      nameItem: items?.nameItem,
      itemThumb: url && url.length ? url : null,
      description: items?.description,
      prices: Number(items?.prices),
      quantityStock: Number(items?.quantityStock),
      brandName: items?.brandName,
      origin: items?.origin,
    };
    const payload = {
      items: itemsPayload,
      payloadEntity: configPayloadEntity(),
    };
    dispatch(ItemSlice.actions.createdItem(payload));
  };

  const configPayloadEntity = () => {
    if (typeProduct === ItemsType.CLOTHES) {
      return {
        color: items?.color,
        material: items?.material,
        size: items?.size,
        styleList: items?.styleList,
      } as EntityClothesIntersface;
    }
    if (typeProduct === ItemsType.FUNITURES) {
      return {
        size: items?.size,
        material: items?.material,
        manufactury: items?.manufactury,
        funtion: items?.funtion,
        warranty: items?.warranty,
      } as EntityFunituresInterface;
    }
    if (typeProduct === ItemsType.COSMETICS) {
      return {
        volume: items?.volume,
        weight: items?.weight,
        activesIngredients: items?.activesIngredients,
        expiry: items?.expiry,
      } as EntityCosmeticsInterface;
    }
    if (typeProduct === ItemsType.ELECTRONICS) {
      return {
        color: items?.color,
        storage: items?.storage,
        screenSize: items?.screenSize,
        weight: items?.weight,
        technology: items?.technology,
        warranty: items?.warranty,
      } as EntityElectronicsInterface;
    }
  };

  return (
    <Card className="card_profile" sx={{ marginBottom: '20px' }}>
      <CardHeader
        action={
          <React.Fragment>
            <IconButton aria-label="settings" onClick={handleDone}>
              <Done />
            </IconButton>
            <IconButton
              aria-label="settings"
              onClick={() => {
                resetData();
                if (url.length) {
                  dispatch(ItemSlice.actions.removeFile({ idImage: url }));
                  dispatch(ItemSlice.actions.clearUrl());
                }
              }}>
              <Cancel />
            </IconButton>
          </React.Fragment>
        }
      />
      {url.length ? (
        <SwipersList data={url} />
      ) : (
        <img src={BANNER_SHOP} alt={BANNER_SHOP} width={'100%'} height={'200px'} />
      )}
      <FileUpload {...fileUploadProp} />
      <CardContent className="card_content">
        <Box className="box_add_item">
          <List component="nav">
            <ListItem
              button
              onClick={event => setAnchorEl(event.currentTarget)}
              className="menu_prod">
              <ListItemText
                primary={<Typography variant="caption">Product</Typography>}
                secondary={
                  shopInfor?.prodcutSell && shopInfor?.prodcutSell[selectedIndex].nameProduct
                }
              />
            </ListItem>
          </List>
          <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
            {shopInfor?.prodcutSell &&
              shopInfor?.prodcutSell.map((item, index) => (
                <MenuItem
                  key={index}
                  selected={index === selectedIndex}
                  onClick={event =>
                    handleMenuItemClick(index, item.id, item?.nameProduct as string)
                  }>
                  {item.nameProduct}
                </MenuItem>
              ))}
          </Menu>
          {formInputItem.map(item => (
            <input
              type={item.type}
              key={item.key}
              placeholder={item.placeholder}
              name={item.name}
              value={(items && items[item.name]) || ''}
              onChange={handleChange}
            />
          ))}
          <TextareaAutosize
            className="text_area"
            placeholder="Description"
            value={items?.description}
            onChange={handleChange}
          />
        </Box>
        {renderFormEntity()}
      </CardContent>
    </Card>
  );
};
