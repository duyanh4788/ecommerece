import { StyleSheet } from '@react-pdf/renderer';

export const styles: any = StyleSheet.create({
  bottomDiv: {
    marginTop: 'auto',
    backgroundColor: '#F7F7F7',
  },

  headerContainer: {
    flexDirection: 'row',
  },

  leftCol: {
    flexDirection: 'column',
    flexGrow: 2,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },

  headerLeftColContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginLeft: 105,
  },

  logoNameColumn: {
    flexDirection: 'column',
    marginRight: 60,
  },
  imgLogo: {
    width: 90,
    height: 69,
  },

  titleColum: {
    flexDirection: 'column',
  },

  headerTitle: {
    fontSize: 39,
    color: '#0F4B73',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#707070',
  },
  headerSubtitle1: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },

  img: {
    marginRight: -60,
    marginTop: -30,
    width: 213,
    height: 221,
  },

  paymentInfoContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 105,
    alignItems: 'center',
    marginBottom: 20,
  },
  personalInfoCol: {
    flexDirection: 'column',
    width: 320,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  personalInfoCol1: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },

  otherInfoTitleCol: {
    flexDirection: 'column',
    marginRight: 50,
  },

  otherInfoContentCol: {
    flexDirection: 'column',
  },

  paymentInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingBottom: 10,
    color: '#707070',
  },
  paymentInfoTitle1: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    paddingBottom: 10,
  },
  paymentInfoTitle3: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  paymentInfoTitle4: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#FFFFFF',
  },
  paymentInfoTitle2: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#707070',
    paddingBottom: 10,
    marginRight: 50,
  },
  contentText: {
    fontSize: 13,
    fontWeight: 'normal',
    paddingBottom: 10,
    color: '#2D2D2D',
  },

  contentText2: {
    fontSize: 13,
    fontWeight: 'normal',
    color: '#707070',
  },

  contentText3: {
    fontSize: 13,
    fontWeight: 'normal',
    color: '#2D2D2D',
  },

  contentText4: {
    fontSize: 13,
    fontWeight: 'normal',
    color: '#FFFFFF',
  },

  //   ========= Latest bill section styles =========
  latestBillContainer: {
    flexDirection: 'column',
    marginTop: 30,
    marginLeft: 105,
    marginRight: 101,
  },

  latestBillTitle: {
    color: '#0F4B73',
    fontSize: 26,
    fontWeight: 'bold',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },

  billDetailRow: {
    flexDirection: 'row',
    paddingBottom: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    alignItems: 'center',
  },

  billDetailRow2: {
    flexDirection: 'row',
    paddingBottom: 20,
    paddingTop: 20,
    alignItems: 'center',
  },

  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  //    14 font size text normal weight
  text: {
    fontSize: 14,
  },

  summaryWrapper: {
    width: 400,
    marginLeft: 'auto',
  },

  summaryRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },

  summaryRowLightBlue: {
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    backgroundColor: '#94c448',
    color: 'white',
  },

  summaryRowLightBlue2: {
    padding: '30px 10px',
    marginBottom: 10,
    flexDirection: 'row',
    backgroundColor: '#94c448',
    color: 'white',
    flex: 1,
  },

  summaryRowDarkBlue: {
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    backgroundColor: '#0F4B73',
    color: 'white',
  },

  //   ------------ bottom section
  container: {
    backgroundColor: '#F7F7F7',
    marginLeft: 105,
    marginRight: 101,
    paddingTop: 75,
    paddingBottom: 100,
  },

  titleRow: {
    flexDirection: 'row',
    borderBottomColor: '#707070',
    borderBottomWidth: 1,
    fontSize: 14,
    paddingBottom: 10,
  },

  secondRow: {
    flexDirection: 'row',
    paddingBottom: 30,
    paddingTop: 30,
    borderBottomColor: '#707070',
    borderBottomWidth: 1,
    marginBottom: 70,
    alignItems: 'center',
  },

  firstCol: {
    flexDirection: 'column',
    flexGrow: 2,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },

  bigBlueText: {
    color: '#94c448',
    fontSize: 25,
  },
  bigBlueText2: {
    color: '#0F4B73',
    fontSize: 35,
  },

  //   ------ unpaid : contents:
  smallLightBlueText: {
    color: '#94c448',
    fontSize: 18,
  },
  bigLightBlueText: {
    color: '#94c448',
    fontSize: 25,
  },
  descriptionText: {
    fontSize: 14,
  },
  //    --------------------------

  secondContainer: {
    flexDirection: 'column',
    marginBottom: 70,
  },

  title: {
    color: '#0F4B73',
    fontSize: 23,
    paddingBottom: 10,
  },

  description: {
    fontSize: 14,
    paddingBottom: 10,
  },
  //   ---- footer
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  marginLeft: {
    marginLeft: 'auto',
  },

  textStyle: {
    color: '#0F4B73',
    fontSize: 23,
    marginLeft: 10,
    marginRight: 10,
  },

  icon: {
    width: 30,
    height: 24,
  },
  col1: {
    width: 90,
    marginRight: 30,
  },
  col2: {
    width: 65,
    marginRight: 30,
  },
  col3: {
    width: 45,
    marginRight: 30,
  },
  col4: {
    width: 45,
    marginRight: 15,
  },
  column: {
    flex: 1,
  },
  column2: {
    width: 100,
    alignItems: 'flex-end',
  },
  column3: {
    width: 350,
    flexDirection: 'row',
  },
});
