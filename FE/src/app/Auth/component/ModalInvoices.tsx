import React from 'react';
import { Box, Chip, Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Invoices } from 'interface/Subscriptions.model';
import { AttachMoney, Download, HelpOutline } from '@mui/icons-material';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { PAYPAL_BANNER } from 'commom/common.contants';
import { handleColorTier } from 'utils/color';
import { AppHelper } from 'utils/app.helper';
import { InvoiceTemplate } from './InvoicesTemplate';
import { Users } from 'interface/Users.model';

interface Props {
  modalInvoice: boolean;
  handleClose: (e: boolean) => void;
  invoices: Invoices[];
  userInfor: Users | null;
}

export const ModalInvoices = ({ modalInvoice, invoices, handleClose, userInfor }: Props) => {
  async function generatePdfDocument(documentData) {
    const blob = await pdf(
      <InvoiceTemplate invoice={documentData.row} userInfor={userInfor} />,
    ).toBlob();
    saveAs(blob, 'invoice.pdf');
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Number',
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'amount',
      headerName: 'Prices',
      align: 'center',
      headerAlign: 'center',
      renderCell: item => (
        <Box display={'flex'} alignItems={'center'}>
          {item.value}
          <AttachMoney style={{ fontSize: '13px' }} />
        </Box>
      ),
    },
    {
      field: 'planType',
      headerName: 'Plan',
      align: 'center',
      headerAlign: 'center',
      renderCell: item => (
        <Chip
          label={AppHelper.capitalizeFirstLetter(item.value)}
          style={{ color: handleColorTier(item.value) }}
          size="small"
        />
      ),
    },
    {
      field: 'invoiceFrom',
      headerName: 'Date Payment',
      align: 'center',
      headerAlign: 'center',
      width: 150,
      renderCell: item => <span>{AppHelper.formmatDateTime(item.value)}</span>,
    },
    {
      field: 'action',
      headerName: 'PDF',
      align: 'center',
      headerAlign: 'center',
      renderCell: item => (
        <IconButton onClick={() => generatePdfDocument(item)}>
          <Download />
        </IconButton>
      ),
    },
  ];

  const getRowId = (row: any) => row.id;

  return (
    <Dialog open={modalInvoice} onClose={() => handleClose(false)} maxWidth={'lg'}>
      <Box display={'flex'} justifyContent={'space-between'}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Invoices Paypal Ecommerce AnhVu{' '}
          <Tooltip
            title={`We are sending the invoice to your email after receiving payment from PayPal!`}>
            <HelpOutline sx={{ fontSize: '12px' }} color="success" />
          </Tooltip>
        </DialogTitle>
        <img src={PAYPAL_BANNER} alt={PAYPAL_BANNER} />
      </Box>
      <DialogContent style={{ border: '1px solid #ebebec' }}>
        <DataGrid
          rows={invoices}
          columns={columns}
          getRowId={getRowId}
          hideFooter={true}
          disableColumnMenu={true}
          style={{ minWidth: '600px' }}
        />
      </DialogContent>
    </Dialog>
  );
};
