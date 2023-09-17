'use strict';

const CryptoJS = require('crypto-js');

const AES_KEY = 'abc123qwertqqqwe';

module.exports = {
  // ecb
  // 解密 data：要加密解密的数据，AES_KEY：密
  ecbdecrypt(data) {
    const key = CryptoJS.enc.Utf8.parse(AES_KEY);
    const decrypt = CryptoJS.AES.decrypt(data, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    const Str = decrypt.toString(CryptoJS.enc.Utf8);
    return Str;
  },
  // 加密
  ecbencrypt(data) {
    const key = CryptoJS.enc.Utf8.parse(AES_KEY);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  },
  // cbc
  // 解密 data：要加密解密的数据，AES_KEY：密钥，IV:偏移量
  cbcdecrypt(data, IV) {
    const key = CryptoJS.enc.Utf8.parse(AES_KEY);
    const iv = CryptoJS.enc.Utf8.parse(IV);
    const decrypt = CryptoJS.AES.decrypt(data, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    return decrypt;
  },
  // 加密
  cbcencrypt(data, IV) {
    const key = CryptoJS.enc.Utf8.parse(AES_KEY);
    const iv = CryptoJS.enc.Utf8.parse(IV);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  },

};
