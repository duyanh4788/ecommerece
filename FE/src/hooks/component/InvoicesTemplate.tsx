import React from 'react';
import { Document, Page, View, Image, Text } from '@react-pdf/renderer';
import { styles } from './StylesPdf';
import _ from 'lodash';
import { Invoices } from 'interface/Subscriptions.model';
import { Users } from 'interface/Users.model';
import { AppHelper } from 'utils/app.helper';
import { CL_WT, NODEJS1 } from 'commom/common.contants';

interface Props {
  invoice: Invoices;
  userInfor: Users | null;
}

export const InvoiceTemplate = ({ invoice, userInfor }: Props) => {
  const taxRate = _.isEqual(invoice?.currency, 'AUD') ? '10%' : '0%';

  return (
    <Document>
      <Page size="C3" style={{ backgroundColor: CL_WT }}>
        {/* ========= header ========= */}
        <View style={styles.headerContainer}>
          <View style={styles.leftCol}>
            <View style={styles.headerLeftColContainer}>
              <View style={styles.logoNameColumn}>
                <Image src={NODEJS1} style={styles.imgLogo} />
              </View>

              <View style={styles.titleColum}>
                <Text style={styles.headerSubtitle1}>Ecommerce AnhVu</Text>
                <Text style={styles.headerSubtitle}>Email: duyanh4788@gmail.com</Text>
                <Text style={styles.headerSubtitle}>Github: https://github.com/duyanh4788</Text>
                <Text style={styles.headerSubtitle}>Phone: 0906068024</Text>
              </View>
            </View>
          </View>

          <View>
            <Image src={NODEJS1} style={styles.img} />
          </View>
        </View>
        <View style={styles.paymentInfoContainer}>
          <View style={styles.personalInfoCol1}>
            <Text style={styles.paymentInfoTitle2}>Bill To</Text>
            <View style={styles.personalInfoCol}>
              <Text style={styles.paymentInfoTitle1}>
                {userInfor?.fullName} | {userInfor?.email}
              </Text>
            </View>
          </View>

          <View style={styles.otherInfoTitleCol}>
            <Text style={styles.paymentInfoTitle1}>Invoice number</Text>
            <Text style={styles.paymentInfoTitle1}>Invoice Issue Date</Text>
            <Text style={styles.paymentInfoTitle1}>Invoice Due Date</Text>
            <Text style={styles.paymentInfoTitle1}>Invoice status</Text>
            <Text style={styles.paymentInfoTitle1}>Payment Terms</Text>
            <Text style={styles.paymentInfoTitle1}>Currency</Text>
          </View>

          <View style={styles.otherInfoContentCol}>
            <Text style={styles.contentText}>{invoice?.id}</Text>
            <Text style={styles.contentText}>
              {AppHelper.formmatDateTime(invoice?.invoiceFrom)}
            </Text>
            <Text style={styles.contentText}>{AppHelper.formmatDateTime(invoice?.invoiceTo)}</Text>
            <Text style={styles.contentText}>Completed</Text>
            <Text style={styles.contentText}>{invoice?.paymentProcessor}</Text>
            <Text style={styles.contentText}>USD</Text>
          </View>
        </View>

        <View style={styles.latestBillContainer}>
          <View>
            <Text style={styles.latestBillTitle}>Tax Invoice</Text>
          </View>
          <View style={styles.summaryRowLightBlue2}>
            <Text style={{ ...styles.paymentInfoTitle3, flex: 1 }}>Item Details</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ ...styles.paymentInfoTitle3, marginRight: 15 }}>Service Terms</Text>
            </View>
          </View>

          <View style={styles.billDetailRow}>
            <View style={styles.column}>
              <Text style={styles.contentText2}>SUBSCRIPTION</Text>
            </View>
            <View style={styles.col1}>
              <Text style={styles.contentText2}>NET AMOUNT</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.contentText2}>TAX RATE</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.contentText2}>TAXES</Text>
            </View>
            <View style={{ ...styles.col4, alignItems: 'flex-end' }}>
              <Text style={styles.contentText2}>TOTAL</Text>
            </View>
          </View>
          <View style={styles.billDetailRow}>
            <View style={styles.column}>
              <Text style={styles.contentText3}>
                Ecommerce subscription
                {AppHelper.capitalizeFirstLetter(invoice?.planType as string)})
              </Text>
            </View>
            <View style={styles.col1}>
              <Text style={styles.contentText3}>${invoice?.amount}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.contentText3}>{taxRate}</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.contentText3}>{invoice?.gst}</Text>
            </View>
            <View style={{ ...styles.col4, alignItems: 'flex-end' }}>
              <Text style={styles.contentText3}>${invoice?.totalAmount}</Text>
            </View>
          </View>

          <View style={styles.billDetailRow2}>
            <View style={styles.column}></View>
            <View style={styles.column3}>
              <View style={styles.column}>
                <Text style={styles.contentText3}>NET AMOUNT(USD)</Text>
              </View>
              <View style={styles.column2}>
                <Text style={{ ...styles.contentText3, marginRight: 15 }}>
                  ${invoice?.totalAmount}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ ...styles.billDetailRow2, paddingTop: 0 }}>
            <View style={styles.column}></View>
            <View style={styles.column3}>
              <View style={styles.column}>
                <Text
                  style={
                    styles.contentText3
                  }>{`TAXES (SEE DETAILS FOR RATES)\nGST(${taxRate})`}</Text>
              </View>
              <View style={styles.column2}>
                <Text style={{ ...styles.contentText3, marginRight: 15 }}>$0</Text>
              </View>
            </View>
          </View>

          <View style={{ ...styles.billDetailRow2, backgroundColor: '#6f9138' }}>
            <View style={styles.column}></View>
            <View style={styles.column3}>
              <View style={styles.column}>
                <Text style={styles.contentText4}>
                  {'Total Paid\nPaid via PayPal on ' + AppHelper.formmatDateTime(invoice?.paidAt)}
                </Text>
              </View>
              <View style={styles.column2}>
                <Text style={{ ...styles.contentText4, marginRight: 15 }}>
                  ${invoice?.totalAmount}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomDiv}>
          <View style={styles.container}>
            <View style={styles.titleRow}>
              <View style={styles.firstCol}>
                <Text style={styles.text}>DUE BY</Text>
              </View>

              <View>
                <Text>TOTAL AMOUNT</Text>
              </View>
            </View>

            <View style={styles.secondRow}>
              <View style={styles.leftCol}>
                <Text style={styles.bigBlueText}>
                  {AppHelper.formmatDateTime(invoice?.renewsDate)}
                </Text>
                <Text style={styles.description}>
                  Your account will be suspended until you make the payment
                </Text>
              </View>
              <View>
                {/* TODO: change $ to currency */}
                <Text style={styles.bigBlueText2}>
                  ${invoice?.totalAmount} {invoice?.currency}
                </Text>
              </View>
            </View>

            <View style={styles.secondContainer}>
              <Text style={styles.title}>HOW TO PAY</Text>
              <Text>
                <Text style={{ ...styles.description, color: '#000000' }}>Pay with Paypal </Text>
                <Text style={{ ...styles.description, color: '#2D2D2D' }}>
                  Pay using Emmcorce app - setting - subscription - pay now
                </Text>
              </Text>
            </View>
            <View style={styles.footerContainer}>
              <View>
                <Image style={styles.icon} src={NODEJS1} />
              </View>

              <View>
                <Text style={styles.textStyle}>duyanh4788@gmail.com</Text>
              </View>

              <View style={styles.marginLeft}>
                <Text style={styles.textStyle}>anhthuanhtu.online</Text>
              </View>

              <View>
                <Image style={styles.icon} src={NODEJS1} />
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
