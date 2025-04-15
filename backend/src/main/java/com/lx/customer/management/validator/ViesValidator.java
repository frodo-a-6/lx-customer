package com.lx.customer.management.validator;

import eu.europa.ec.taxation_customs.vies.checkVat.CheckVatPortType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.xml.ws.Holder;
import jakarta.xml.ws.Service;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.namespace.QName;

/**
 * Experimental validator for VAT ID using VIES (VAT Information Exchange System).
 * This is rather flaky as the VIES service has a high chance of throttling or being unavailable.
 */
public class ViesValidator implements ConstraintValidator<ViesApproved, String> {
    private final CheckVatPortType port;

    public ViesValidator() throws MalformedURLException {
        URL wsdlURL = URI.create("https://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl").toURL();
        QName serviceName = new QName("urn:ec.europa.eu:taxud:vies:services:checkVat", "checkVatService");
        Service service = Service.create(wsdlURL, serviceName);
        port = service.getPort(CheckVatPortType.class);
    }

    @Override
    public boolean isValid(String dirtyVatId, ConstraintValidatorContext constraintValidatorContext) {
        if (dirtyVatId == null || dirtyVatId.isBlank()) {
            return true;
        }
        String vatId = dirtyVatId.trim().toUpperCase();
        String isoCountryCode = vatId.substring(0, 2);
        String vatNumber = vatId.substring(2);
        var isoCode = new Holder<>(isoCountryCode);
        var vatNum = new Holder<>(vatNumber);
        var requestDate = new Holder<XMLGregorianCalendar>();
        var valid = new Holder<Boolean>();
        var name = new Holder<String>();
        var address = new Holder<String>();

        port.checkVat(isoCode, vatNum, requestDate, valid, name, address);

        return valid.value;
    }
}
