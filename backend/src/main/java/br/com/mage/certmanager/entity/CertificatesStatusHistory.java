package br.com.mage.certmanager.entity;

import br.com.mage.certmanager.enums.CertificateStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "certificate_status_history")
public class CertificatesStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime changedAt;

    @Enumerated(EnumType.STRING)
    private CertificateStatus previousStatus;

    @Enumerated(EnumType.STRING)
    private CertificateStatus newStatus;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User changedBy;

    @ManyToOne
    @JoinColumn(name = "certificate_id")
    private Certificate certificate;

}
