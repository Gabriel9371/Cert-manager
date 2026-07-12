package br.com.mage.certmanager.exception;

public class CertificateNotFoundException extends RuntimeException {
    public CertificateNotFoundException(Long id) {
        super("Certificate with ID: " + id + " not found");
    }
}
