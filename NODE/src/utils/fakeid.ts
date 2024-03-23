import { Messages } from '../common/messages';
import { SECRETKEY_FAKEID } from '../common/variable';
import { RestError } from '../services/error/error';

export const enCryptFakeId = (value: number) => {
  const valueBuffer = Buffer.from(value.toString());
  const keyBuffer = Buffer.from(SECRETKEY_FAKEID, 'base64');
  const encryptedBuffer = Buffer.alloc(valueBuffer.length);
  for (let i = 0; i < valueBuffer.length; i++) {
    encryptedBuffer[i] = valueBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }
  const encryptedValue = Buffer.concat([keyBuffer, encryptedBuffer]).toString('base64').replace(/\//g, '_').replace(/==/g, '');
  return encryptedValue;
};

export const deCryptFakeId = (id: string) => {
  try {
    const decodedString = id.replace(/_/g, '/').padEnd(id.length + (id.length % 4), '=');
    const encryptedBuffer = Buffer.from(decodedString, 'base64');
    const keyBuffer = Buffer.from(SECRETKEY_FAKEID, 'base64');
    const decryptedBuffer = Buffer.alloc(encryptedBuffer.length - keyBuffer.length);
    for (let i = 0; i < decryptedBuffer.length; i++) {
      decryptedBuffer[i] = encryptedBuffer[i + keyBuffer.length] ^ keyBuffer[i % keyBuffer.length];
    }
    const decryptedValue = parseInt(decryptedBuffer.toString(), 10);
    return decryptedValue;
  } catch (error) {
    throw new RestError(Messages.NOT_AVAILABLE, 404);
  }
};
