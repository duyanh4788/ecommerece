/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, RefObject, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ItemSlice from 'store/items/shared/slice';
import * as ItemSelector from 'store/items/shared/selectors';
import * as ShopSelector from 'store/shops/shared/selectors';
import { Cancel, Done, Edit } from '@mui/icons-material';
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
  ItemsInterface,
} from 'interface/Items.mode';
import { BG_MAIN_2, renderMsgUploadItems } from 'commom/common.contants';
import { FormClosthers } from 'hooks/entityItem/FormClosthers';
import { FormCosmetics } from 'hooks/entityItem/FormCosmetics';
import { FormElectronics } from 'hooks/entityItem/FormElectronics';
import { FormFunitures } from 'hooks/entityItem/FormFunitures';
import { SwipersList } from 'hooks/component/SwipersList';
import { AppHelper } from 'utils/app.helper';
import { toast } from 'react-toastify';
import { RenderImagesList } from 'hooks/component/RenderImagesList';

interface Props {
  handleResetAddUpdate: () => void;
  resetDataRefItems: RefObject<boolean | null>;
}

export const CardAddUpdateItem = ({ handleResetAddUpdate, resetDataRefItems }: Props) => {
  const dispatch = useDispatch();
  const shopInfor = useSelector(ShopSelector.selectShopInfor);
  const itemInfor: ItemsInterface | null = useSelector(ItemSelector.selectItemInfor);
  const url = useSelector(ItemSelector.selectUrl);
  const [items, setItems] = useState<ValuesItems | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [typeProduct, setTypeProduct] = useState<string | null>(
    (shopInfor?.prodcutSell && shopInfor?.prodcutSell[0].nameProduct?.toUpperCase()) || null,
  );
  const [editSlides, setEditSlides] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    function initItemCurr(data) {
      if (!data) return;
      const parseObj = AppHelper.parseItemObject(data);
      if (!parseObj) return;
      setItems(prevItems => ({ ...prevItems, ...parseObj }));
      setTypeProduct(parseObj.typeProduct as string);
      return;
    }
    setTimeout(() => initItemCurr(itemInfor));
  }, [itemInfor]);

  useEffect(() => {
    if (resetDataRefItems.current) {
      resetData();
      const newResetData = false;
      Object.assign(resetDataRefItems, { current: newResetData });
    }
  }, [resetDataRefItems.current]);

  const resetData = () => {
    handleResetAddUpdate();
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
      if (newFormData) {
        const formDataEntries = Array.from(newFormData.entries());
        const formDataLength = formDataEntries.length;
        if (
          itemInfor &&
          itemInfor.itemThumb &&
          itemInfor.itemThumb.length &&
          itemInfor.itemThumb.length + formDataLength > 5
        ) {
          toast.error(renderMsgUploadItems(5 - itemInfor.itemThumb.length));
          return;
        }
        dispatch(ItemSlice.actions.uploadFile(newFormData));
      }
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      const { files }: any = event.dataTransfer;
      if (files !== null && files.length > 0) {
        if (
          itemInfor &&
          itemInfor.itemThumb &&
          itemInfor.itemThumb.length &&
          itemInfor.itemThumb.length + files.length > 5
        ) {
          toast.error(renderMsgUploadItems(5 - itemInfor.itemThumb.length));
          return;
        }
        const newFormData = new FormData();
        for (let i = 0; i < files.length; i++) {
          newFormData.append('file', files[i]);
        }
        dispatch(ItemSlice.actions.uploadFile(newFormData));
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
    if (!itemInfor) {
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
      return;
    }
    if (itemInfor) {
      if (!items || !items?.itemChildId) return;
      const itemsPayload = {
        id: items?.id,
        shopId: items?.shopId,
        productId: items?.productId,
        nameItem: items?.nameItem,
        itemThumb: configItemThum(),
        description: items?.description,
        prices: Number(items?.prices),
        quantityStock: Number(items?.quantityStock),
        brandName: items?.brandName,
        origin: items?.origin,
      };
      const payloadEntity = configPayloadEntity();
      const payload = {
        items: itemsPayload,
        payloadEntity: {
          ...payloadEntity,
          id: items.itemChildId as string,
          entityId: items?.entityId,
        },
      };
      dispatch(ItemSlice.actions.updatedItem(payload));
      return;
    }
    return;
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
        warranty: items?.warranty ? true : false,
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
        warranty: items?.warranty ? true : false,
      } as EntityElectronicsInterface;
    }
  };

  const configItemThum = () => {
    if (items?.itemThumb && items?.itemThumb.length && url.length) {
      return [...items?.itemThumb, ...url];
    }

    if (
      (!items?.itemThumb && url.length) ||
      (items?.itemThumb && !items.itemThumb.length && url.length)
    ) {
      return url;
    }

    if (items?.itemThumb && items?.itemThumb.length && !url.length) {
      return items?.itemThumb;
    }

    return [];
  };

  const handleUploadSlider = (idImage: string) => {
    const listThumb = itemInfor?.itemThumb?.filter(item => item !== idImage);
    const result = {
      id: itemInfor?.id,
      itemThumb: listThumb,
      idImageRemove: idImage,
    };
    dispatch(ItemSlice.actions.updatedThumb(result));
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
      {url.length ||
      (itemInfor && itemInfor.itemThumb && itemInfor.itemThumb.length && !editSlides) ? (
        <Box className="box_media">
          <SwipersList data={url.length ? url : (itemInfor?.itemThumb as string[])} />
          {items && items.itemThumb && items.itemThumb.length < 5 ? (
            <FileUpload {...fileUploadProp} />
          ) : null}
        </Box>
      ) : (
        <Card sx={{ background: BG_MAIN_2, margin: '10px 0' }}>
          <RenderImagesList
            sliders={itemInfor?.itemThumb as string[]}
            setEditSlides={setEditSlides}
            handleUploadSlider={handleUploadSlider}
            fileUploadProp={fileUploadProp}
          />
        </Card>
      )}

      <IconButton onClick={() => setEditSlides(true)}>
        <Edit />
      </IconButton>
      <CardContent className="card_content">
        <Box className="box_add_item">
          <List component="nav">
            <ListItem
              button
              disabled={itemInfor ? true : false}
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
            name="description"
            value={items?.description}
            onChange={handleChange}
          />
        </Box>
        {renderFormEntity()}
      </CardContent>
    </Card>
  );
};
