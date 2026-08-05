package br.com.mage.certmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class CertManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(CertManagerApplication.class, args);
	}

}
