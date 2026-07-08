package br.com.mage.certmanager.service;

import br.com.mage.certmanager.repository.CertificateRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CertificateService {
    private final CertificateRepository certificateRepository;

    public CertificateResponseDTO createCertificate(CreateRequestCertificateDTO dto){


        return null;
    }

    public List<CertificateResponseDTO> listAllCertificates(){

        return null;
    }

    public CertificateResponseDTO updateCertificate(UpdateRequestCertificateDTO dtoatt, Long id){

        return null;
    }

    public void deleteCertificate(Long id){

        //delete.
    }

    public CertificateResponseDTO listCertificateById(Long id){

        return null;
    }

    public CertificateResponseDTO updateStatusCertificate(Long id){

        return null;
    }


    public void checkExpirations(){


    }



}
