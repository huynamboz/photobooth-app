package com.familyguard.module;

import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import java.security.KeyStore;
import java.security.NoSuchAlgorithmException;
import java.security.InvalidAlgorithmParameterException;
import java.security.NoSuchProviderException;
import java.security.cert.CertificateException;
import java.io.IOException;
import java.security.UnrecoverableKeyException;
import java.security.KeyStoreException;
import java.security.InvalidKeyException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.Cipher; // Import Cipher để sử dụng mã hóa và giải mã
import android.security.keystore.KeyPermanentlyInvalidatedException;
public class BiometricModule extends ReactContextBaseJavaModule {

    public BiometricModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "BiometricModule";
    }

    @ReactMethod
    public void generateBiometricKey(String keyName,Promise promise) {
        try {
            // Khởi tạo KeyStore
            KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
            keyStore.load(null);

            // Tạo KeyGenerator
            KeyGenerator keyGenerator = KeyGenerator.getInstance(
                    KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");

            // Định nghĩa thuộc tính của khóa
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                keyGenerator.init(
                        new KeyGenParameterSpec.Builder(keyName,
                                KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                                .setUserAuthenticationRequired(true) // Yêu cầu xác thực người dùng
                                .setInvalidatedByBiometricEnrollment(true) // Vô hiệu hóa khóa khi sinh trắc học thay đổi
                                .build());
            }

            // Tạo khóa
            SecretKey secretKey = keyGenerator.generateKey();

            promise.resolve("GENERATE_SUCCESS");

        } catch (NoSuchAlgorithmException | InvalidAlgorithmParameterException | NoSuchProviderException
                | KeyStoreException | IOException | CertificateException e) {
            e.printStackTrace();
            promise.reject("GENERATE_FAILED", e);
        }
    }

    @ReactMethod
    public void useBiometricKeyToEncrypt(String keyName,Promise promise) {
        try {
            KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
            keyStore.load(null);

            SecretKey key = (SecretKey) keyStore.getKey(keyName, null);

            if (key != null) {
                // Tạo Cipher với các thiết lập giống lúc tạo Key
                Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
                try {
                    cipher.init(Cipher.ENCRYPT_MODE, key);
                    promise.resolve("ENROLLMENT_VALID");
                } catch (KeyPermanentlyInvalidatedException e) {
                    // Khóa đã bị vô hiệu hóa
                    promise.resolve("ENROLLMENT_CHANGE");
                }
            } else {
                promise.resolve("ENROLLMENT_NOT_FOUND");
            }

        } catch (NoSuchAlgorithmException | KeyStoreException | UnrecoverableKeyException | IOException
                | CertificateException | NoSuchPaddingException | InvalidKeyException e) {
            e.printStackTrace();
            promise.reject("Key operation failed", e);
        }
    }

    @ReactMethod
    public void removeBiometricKey(String keyName,Promise promise) {
        try {
            // Khởi tạo KeyStore
            KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
            keyStore.load(null);

            // Kiểm tra xem khóa có tồn tại không
            if (keyStore.containsAlias(keyName)) {
                // Xóa khóa
                keyStore.deleteEntry(keyName);
                promise.resolve("REMOVE_SUCCESS");
            } else {
                promise.resolve("KEY_NOT_FOUND");
            }

        } catch (KeyStoreException | NoSuchAlgorithmException | CertificateException | IOException e) {
            e.printStackTrace();
            promise.reject("REMOVE_FAILED", e);
        }
    }


}
