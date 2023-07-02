import nodemailer from 'nodemailer';
import { isDevelopment } from '../../server';
import { UserAttributes } from '../../interface/UserInterface';
import { INodeMailerServices } from '../../repository/INodeMailerServices';
import { RequestEmail } from '../../interface/SubscriptionInterface';
import { formatYearMonthDate } from '../../utils/timer';

export class NodeMailerServices implements INodeMailerServices {
  private nodemailerTransport!: nodemailer.Transporter;
  private readonly FE_URL: string | undefined = process.env.FE_URL;

  constructor() {
    this.startNodeMailer();
  }

  async startNodeMailer() {
    this.nodemailerTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'duyanh4788@gmail.com',
        pass: 'lqsceqququpalcvj'
      }
    });
    this.nodemailerTransport.verify((error, success) => {
      if (error) {
        console.log('Mail server connection failed', error);
      } else {
        console.log('Mail server connection is running', success);
      }
    });
  }

  async sendWelcomeUserNotification(email: string): Promise<void> {
    const baseMail = `
        <div style='overflow-wrap: break-word; background-color:#ffffff; line-height: 140%; padding: 30px;'>
          <h1>Welcome System Ecommerce</h1>
          <p>To access all of Ecommerce amazing features, Subscriber Paypal and 30 DAYS ACCESS TO ALL FEATURES on your selected subscription.
           Change and/or cancel your subscription at any time</p>
          <p>See you there,<br> Your friends at Ecommerce<br></p>
        </div>
      `;
    await this.sendMail(email, 'Welcome to System Ecommerce By duyanh4788', this.renderHtmlMailServices(baseMail, 'Welcome to System Ecommerce By duyanh4788'));
    return;
  }

  async sendAuthCodeResetPassWord(user: UserAttributes, authCode: string): Promise<void> {
    const baseMail = `
        <div style='overflow-wrap: break-word; background-color:#ffffff; line-height: 140%; padding: 30px;'>
          <h1>Hi ${user.fullName}.</h1>
          <p>You has ordered reset password in Ecommerce account !</p>
          <p>To reset password of Ecommerce, <br>get this code and started reset password.</br></p>
          <p style='border: 1px solid #e7e2e2;font-size: 40px;font-weight: bolder; border-radius: 10px;padding: 15px;width: 160px'>
            ${authCode}
          </p>
          <p>See you there,<br> Your friends at Ecommerce<br></p>
        </div>
      `;
    await this.sendMail(user.email as string, 'System Ecommerce send auth code for reset password', this.renderHtmlMailServices(baseMail, 'Verify Your ChatApp PassWord'));
    return;
  }

  async sendAuthCodeForLogin(user: UserAttributes, authCode: string): Promise<void> {
    const baseMail = `
        <div style='overflow-wrap: break-word; background-color:#ffffff; line-height: 140%; padding: 30px;'>
          <h1>Hi ${user.fullName}.</h1>
          <p>This is code for login to System Ecommerce account !</p>
          <p style='border: 1px solid #e7e2e2;font-size: 40px;font-weight: bolder; border-radius: 10px;padding: 15px;width: 160px'>
            ${authCode}
          </p>
          <p>See you there,<br> Your friends at Ecommerce<br></p>
        </div>
      `;
    await this.sendMail(user.email as string, 'System Ecommerce send auth code for login', this.renderHtmlMailServices(baseMail, 'Verify Your ChatApp PassWord'));
    return;
  }

  async sendOverLoadSystem(memory: number, numberConectDb: number): Promise<void> {
    const baseMail = `
        <div style='overflow-wrap: break-word; background-color:#ffffff; line-height: 140%; padding: 30px;'>
          <h1>Hi Admin</h1>
          <p>System hass connected: ${numberConectDb} || Memory overload : ${memory} MB</p>
        </div>
        `;
    await this.sendMail('duyanh4788@gmail.com', 'Notifycation overload server', this.renderHtmlMailServices(baseMail, 'System overload!!!'));
    return;
  }

  async sendSubscriptionCanceled(user: UserAttributes): Promise<void> {
    const baseMail = `
        <div style='overflow-wrap: break-word; background-color:#ffffff; line-height: 140%; padding: 30px;'>
            <p><strong>Hi ${user.fullName}</strong></p>
            <p>It looks like you’ve recently cancelled your Ecommerce Subscription. Our friendly support team is happy to
              help with any issues you may have encountered. Don’t hesitate to get in touch with us <a href='mailto:duyanh4788@gmail.com'>here<a>.</p>
            <p><strong> We’d love you to stick around.</strong> </p>
        </div>
        `;
    await this.sendMail(user.email as string, 'Subscription Canceled', this.renderHtmlMailServices(baseMail, 'We’re Sorry to See You Go'));
    return;
  }

  async sendSubscriptionSuspended(user: UserAttributes) {
    const baseMail = `
        <div style='overflow-wrap: break-word; background-color:#ffffff; line-height: 140%; padding: 30px;'>
            <p><strong>Hi ${user.fullName}</strong></p>
            <p>It looks like you’ve have a payment problem with Paypal. Our friendly support team is happy to
              help with any issues you may have encountered. Don’t hesitate to get in touch with us <a href='mailto:duyanh4788@gmail.com'>here<a>.</p>
            <p><strong> We’d love you to stick around.</strong> </p>
        </div>
        `;
    await this.sendMail(user.email as string, 'Subscription Suspend', this.renderHtmlMailServices(baseMail, 'We’re Sorry to See You Go'));
    return;
  }

  async sendInvoices(requestEmail: RequestEmail) {
    const {
      billingName,
      addressLine1,
      addressLine2,
      invoiceNumber,
      invoiceIsueDate,
      invoiceDueDate,
      invoiceStatus,
      paymentTerms,
      paymentCurrent,
      plantType,
      totalAmount,
      gst,
      taxRate,
      amountBreakdown,
      emailUser
    } = requestEmail;
    const netAmountPrice = (parseInt(amountBreakdown.total) / 1.1).toFixed(2);
    const taxes = (parseInt(amountBreakdown.total) / 11).toFixed(2);
    const baseEmail = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <title>Invoice_paid</title>
          <style type="text/css">
              html * {
                  font-family: Arial;
              }

              .container {
                width: 90%;
                margin: 0 auto;
                border: 1px solid #c1bdbd47;
                padding: 20px;
                border-radius: 20px;
              }

              hr {
                  margin-top: 1rem;
                  margin-bottom: 1rem;
                  border: 0;
                  border-top: 1px solid rgba(0, 0, 0, 0.1);
              }

              .row:after {
                content: "";
                display: table;
                clear: both;
              }

              .img {
                  width: 150px;
                  border-radius: 50%;
              }

              .column_1 {
                  float: left;
                  width: 10%;
              }

              .column_2 {
                  float: left;
                  width: 70%;
              }

              .column_3 {
                  float: left;
                  width: 20%;
              }

              .column_4 {
                  float: left;
                  width: 40%;
              }

              .column_5 {
                float: left;
                width: 50%;
              }

              table {
                width: 100%;
                border: 1px solid #c1bdbd47;
              }
          </style>
        </head>
        <body>
            <div class="container">
                <div class="row">
                    <div class="column_1">
                        <img width="80px" height="80px" alt="image"
                            src="https://dv19cu1ukmppw.cloudfront.net/ecommerce/1688289445901.png" />
                    </div>
                    <div class="column_2">
                        <p style="font-size: 16px;font-weight: bold">
                            Ecommerce AnhVu
                        </p>
                        <p style="color:#707070">
                            Email: duyanh4788@gmail.com
                            <br>
                            Github: https://github.com/duyanh4788
                            <br>
                            Phone: 0906068024
                        </p>
                    </div>
                    <div class="column_3">
                        <img class="img" alt="image" src="https://anhthuanhtu.com:50004/data_publish/images/anhvu.jpeg" />
                    </div>
                </div>
                <div class="row">
                  <div class="column_1">
                      <p style="color: #ACA7A7">Bill to</p>
                  </div>
                  <div class="column_4 ">
                      <h1 style="color:#000000; font-size: 16px;font-weight: bold;">
                          ${billingName}
                      </h1>
                      <p style="color: #ACA7A7"> ${addressLine1} <br> ${addressLine2}</p>
                  </div>
                  <div class="column_1">
                      <p style="color: #ACA7A7"></p>
                  </div>
                  <div class="column_3">
                      <h1 style="color:#000000; font-size: 16px;font-weight: bold;">
                          Invoice Number
                      </h1>
                      <h1 style="color:#000000; font-size: 16px;font-weight: bold;">
                          Invoice Issue Date
                      </h1>
                      <h1 style="color:#000000; font-size: 16px;font-weight: bold;">
                          Invoice Due Date
                      </h1>
                      <h1 style="color:#000000; font-size: 16px;font-weight: bold;">
                          Invoice Status
                      </h1>
                      <h1 style="color:#000000; font-size: 16px;font-weight: bold;">
                          Payment Terms
                      </h1>
                      <h1 style="color:#000000; font-size: 16px;font-weight: bold;">
                          Currency
                      </h1>
                  </div>
                  <div class="column_3">
                      <h1 style=" font-size: 16px">
                          ${invoiceNumber}
                      </h1>
                      <h1 style="color:#000000; font-size: 16px;">
                          ${formatYearMonthDate(invoiceIsueDate)}
                      </h1>
                      <h1 style="color:#000000; font-size: 16px;">
                          ${formatYearMonthDate(invoiceDueDate)}
                      </h1>
                      <h1 style="color:#000000; font-size: 16px;">
                          ${invoiceStatus}
                      </h1>
                      <h1 style="color:#000000; font-size: 16px;">
                          ${paymentTerms}
                      </h1>
                      <h1 style="color:#000000; font-size: 16px;">
                          ${paymentCurrent}
                      </h1>
                  </div>
                </div>
                <div style="height:40px;"></div>
                <div>
                    <h1 style="color: #43712e; font-size: 26px; font-weight: bold;">Tax Invoice</h1>
                    <table>
                        <thead>
                            <tr style="background-color: #56ab2f; color: #FFFFFF; height:45px">
                                <th scope="col">Item Details</th>
                                <th scope="col"></th>
                                <th scope="col">Service Terms</th>
                                <th scope="col">
                                    ${formatYearMonthDate(invoiceIsueDate)} to ${formatYearMonthDate(invoiceDueDate)}
                                </th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="color: #707070; height:45px">
                                <td>SUBSCRIPTION</td>
                                <td>NET AMOUNT</td>
                                <td>TAX RATE</td>
                                <td>TAXES</td>
                                <td>TOTAL</td>
                            </tr>
                            <tr style="color: #020202; height:45px">
                                <td>Ecommerce AnhVu <strong>${plantType}</strong> subscription</td>
                                <td>$ ${netAmountPrice}</td>
                                <td>${parseInt(taxRate)}%</td>
                                <td>$ ${taxes}</td>
                                <td>$ ${amountBreakdown.total}</td>
                            </tr>
                            <tr style="color: #020202" rowspan="2">
                                <td></td>
                                <td>
                                    <p>NET AMOUNT(${amountBreakdown.currency})</p>
                                    <p>TAXES (SEE DETAILS FOR RATES) GST(${parseInt(taxRate)}%)</p>
                                </td>
                                <td></td>
                                <td></td>
                                <td>
                                    <p>$${netAmountPrice}</p>
                                    <p>$${taxes}</p>
                                </td>
                            </tr>
                            <tr style="background-color: #43712e; color: #FFFFFF;">
                                <td></td>
                                <td>
                                    <p>
                                        Total Paid
                                    </p>
                                    <p>
                                        from Credit Card Ending on ${formatYearMonthDate(invoiceDueDate)}
                                    </p>
                                </td>
                                <td></td>
                                <td></td>
                                <td>$${amountBreakdown.total}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="height:40px ;"></div>
                <div style="background-color: #F7F7F7;">
                    <div style="padding-top: 20px; margin-left: 20px; width:90% ;">
                        <h1 style="font-size: 16px;font-weight: bold;">
                            <span>DUE BY</span>
                            <span style="float: right">TOTAL AMOUNT</span>
                        </h1>
                    </div>
                    <hr style="height:2px;border-width:0;color:gray;background-color:#80808036">
                    <div style="padding-top: 20px; margin-left: 20px; width:90% ;">
                        <h2 style="color: #56ab2f; font-size: 35px;font-weight: bold;">
                            <span>${formatYearMonthDate(invoiceDueDate)}</span>
                            <span style="float: right; color: #43712e;">$${totalAmount} ${amountBreakdown.currency}</span>
                        </h2>
                    </div>
                    <hr style="height:2px;border-width:0;color:gray;background-color:gray">
                    <div style="padding-top: 20px; margin-left: 20px; width:90% ;">
                        <h1 style="color: #43712e;font-size: 23px;font-weight: bold;">
                            HOW TO PAY
                        </h1>
                        <p>
                            <span style="color: #000000; font-weight: bold;">Pay with PayPal </span>
                            <span>Pay using Ecommerce app - setting- subscriptions - pay now</span>
                        </p>
                    </div>
                    <div style="padding: 20px;">
                          <div class="row">
                            <div class="column_5">
                                <img alt="image" src="https://dv19cu1ukmppw.cloudfront.net/ecommerce/1688289445901.png" width="40px"
                                    height="40px" />
                                <span
                                    style="color:#0F4B73;font-size: 23px;font-weight: bold; margin-left: 10px;">duyanh4788@gmail.com</span>
                            </div>
                            <div class="column_5" style="text-align: right;">
                                <span
                                    style="color:#0F4B73;font-size: 23px;font-weight: bold; margin-right: 10px;">anhthuanhtu.online</span>
                                <img alt="image" src="https://dv19cu1ukmppw.cloudfront.net/ecommerce/1688289445901.png" width="40px"
                                    height="40px" />
                            </div>
                          </div>
                        </div>
                    <div style="height: 80px ;"></div>
                </div>
            </div>
        </body>
      </html>
    `;
    await this.sendMail(emailUser, `System Ecommerce AnhVu sends Invoice via Paypal in ${formatYearMonthDate(invoiceIsueDate)}`, baseEmail);
  }

  private renderHtmlMailServices(teamplate: any, status: string) {
    const baseTeamplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name='Verify Your Ecommerce Account ' content='width=device-width, initial-scale=1'>
          <style>
            div {
              margin: 0 auto;
              min-width: 320px;
              max-width: 500px;
            }
            body {
              background-color: #F7F7F7;
              font-size: 14px;
              font-family: "Open Sans", Helvetica, sans-serif;
            }
            h1 {
              font-size: 22px;
            }
            p, span {
              font-size: 14px;
            }
            a {
              color: #46a4ca;
            }
          </style>
        </head>
        <body>
            <div style='Margin: 0 auto;min-width: 320px;max-width: 500px;'>
            <div style='background-color:#56ab2f; color: white; text-align: center; padding:10px 0;'>
                <p style='line-height: 140%; text-align: center;font-size: 20px;font-weight: bolder'>${status}</p>
            </div>
            ${teamplate}
            <div style='background-color:#56ab2f; color: white; text-align: center; padding:10px 0;'>
                <p style='line-height: 140%; text-align: center;font-size: 20px;font-weight: bolder'>Ecommerce</p>
            </div>
            </div>
        </body>
      </html>
    `;
    return baseTeamplate;
  }

  private async sendMail(toEmail: string, subject: string, htmlContent: string) {
    // if (isDevelopment) return;
    await this.nodemailerTransport.sendMail({
      from: 'System Ecommerce Notification <duyanh4788@gmail.com>',
      to: isDevelopment ? 'duyanh4788@gmail.com' : toEmail,
      subject: subject,
      html: htmlContent
    });
  }
}

export const nodeMailerServices = new NodeMailerServices();
