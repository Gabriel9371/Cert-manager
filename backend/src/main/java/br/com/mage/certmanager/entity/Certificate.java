package br.com.mage.certmanager.entity;


import br.com.mage.certmanager.enums.CertificateStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cnpj;
    private String companyName;
    private LocalDate validUntil;
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private CertificateStatus status;

    private LocalDate validFrom;
    private String contactName;
    private String contactPhone;
    private String issuer;
    private Boolean issuedByUs;
    private Double renewalValue;
    private LocalDateTime createdAt;


    @ManyToOne
    @JoinColumn(name = "renewed_by_id")
    private User renewedBy;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;

}
